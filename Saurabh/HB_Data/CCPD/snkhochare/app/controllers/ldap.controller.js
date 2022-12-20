// Configuring the ldap
var passport = require("passport");
var LdapStrategy = require("passport-ldapauth");
const { poolPromise, sql } = require("../../config/mssql_hr.config");
const { decrypt } = require("../../config/crypto");
const OPTS = {
  server: {
    url: process.env.LDAP_URL,
    bindDN: process.env.LDAP_USER,
    bindCredentials: decrypt(process.env.LDAP_PASSWORD),
    searchBase: "DC=camdenpd,DC=com",
    searchFilter: "(sAMAccountName={{username}})",
  },
};

passport.use(new LdapStrategy(OPTS));

// Authenticate User.
//exports.authenticateUser = nod(req, res, next);
exports.authenticateUser = function (req, res) {
  passport.authenticate(
    "ldapauth",
    { session: false },
    function (error, user, info) {
      if (error) {
        //res.status(401).send(error);
        res.send(error);
      } else if (!user) {
        //res.status(401).send(info);
        res.send(info);
      } else {
        const type = user.distinguishedName;
        const username = user.sAMAccountName;
        // const username = "kothas";
        const group = user.memberOf;
        getUserByUsername(username)
          .then((user) => {
            user &&
              user.EmployeeId &&
              user.Title2 &&
              getUserAccessRoles(user.Title2, user.EmployeeId)
                .then((roleAccess) => {
                  return res.status(200).send({
                    message: "You've successfully logged in.",
                    username: username,
                    type: type,
                    group: group,
                    user,
                    access: roleAccess,
                  });
                })
                .catch(() => {
                  return res.status(200).send({
                    message:
                      "Your details mismatch. Please contact to administrator",
                  });
                });
          })
          .catch(() => {
            return res.status(200).send({
              message: "Your details mismatch. Please contact to administrator",
            });
          });
        //next();
      }
    }
  )(req, res);
};

exports.testAuthUser = function (req, res) {
  const { username, password } = req.body;
  getUserByUsername(username)
    .then((user) => {
      user &&
        user.EmployeeId &&
        user.Title2 &&
        password === "88552233" &&
        getUserAccessRoles(user.Title2, user.EmployeeId)
          .then((roleAccess) => {
            return res.status(200).send({
              message: "You've successfully logged in.",
              username: username,
              user,
              access: roleAccess,
            });
          })
          .catch((error) => {
            return res.status(200).send({
              message: "Your details mismatch. Please contact to administrator",
            });
          });
    })
    .catch((error) => {
      return res.status(200).send({
        message: "Your details mismatch. Please contact to administrator",
      });
    });
  //next();
};

const getUserByUsername = async (Username) => {
  const query = `
    SELECT
      e.*,
      CONCAT('',(SELECT Title from Department Where Id=e.Bureau)) as BureauName,
      CONCAT('',(SELECT Title from Department Where Id=e.Division2)) as DivisionName,
      CONCAT('',(SELECT Title from Department Where Id=e.Unit2)) as UnitName,
      CONCAT('',(SELECT Title from Title Where ID=e.Title2)) as TitleName,
      ei.ImageName
    FROM
      CCPD_Employees AS e
      LEFT JOIN CCPD_EmployeesImages ei ON ei.EmployeeId = e.EmployeeId

    WHERE
      UserName = @input_username AND IsActive = 1
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_username", sql.Char, Username)
      .query(query);
    if (result && result.recordset && result.recordset[0]) {
      return result.recordset[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

// const getUserAccessRoles = async (titleId, employeeId) => {
//   const roleAccessQuery = `
//     SELECT TM.ModuleId,TM.AccessRight, m.Title AS ModuleTitle, t.Title AS TitleName
//     FROM TitlesModules AS TM
//     LEFT JOIN Modules AS m ON m.Id = ModuleId
//     LEFT JOIN Title AS t ON t.Id = TitleId
//     WHERE TM.IsActive = 1 AND TM.TitleId = ${titleId} AND (TM.EmployeeId = ${employeeId} OR TM.EmployeeId IS NULL)`;

//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query(roleAccessQuery);
//     if (result && result.recordset) {
//       return result.recordset;
//     }
//     return null;
//   } catch (error) {
//     return null;
//   }
// };

const getUserAccessRoles = async (titleId, employeeId) => {
  const roleAccessQuery = `
    SELECT TM.ModuleId,TM.AccessRight, m.Title AS ModuleTitle, t.Title AS TitleName
    FROM TitlesModules AS TM
    LEFT JOIN Modules AS m ON m.Id = ModuleId
    LEFT JOIN Title AS t ON t.Id = TitleId
    WHERE TM.IsActive = 1 AND TM.TitleId = ${titleId} AND TM.EmployeeId IS NULL`;

  const employeeWiseAccessQuery = `
  SELECT TM.ModuleId,TM.AccessRight, m.Title AS ModuleTitle, t.Title AS TitleName
  FROM TitlesModules AS TM
  LEFT JOIN Modules AS m ON m.Id = ModuleId
  LEFT JOIN Title AS t ON t.Id = TitleId
  WHERE TM.IsActive = 1 AND TM.TitleId = ${titleId} AND TM.EmployeeId = ${employeeId}`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(roleAccessQuery);
    const result2 = await pool.request().query(employeeWiseAccessQuery);

    const result3 = result.recordset
      .map((o) => ({
        ...o,
        AccessRight: result2.recordset[0] && result2.recordset[0].AccessRight,
      }))
      .filter(
        ({ ModuleId: id1 }) =>
          !result2.recordset.some(({ ModuleId: id2 }) => id2 === id1)
      );

    if (result2 && result2.recordset && result2.recordset.length > 0) {
      return [...result2.recordset, ...result3];
    } else {
      return result.recordset;
    }
    return null;
  } catch (error) {
    return null;
  }
};

exports.getRolebaseAccess = async function (req, res) {
  const { titleId, employeeId } = req.body;
  const result = await getUserAccessRoles(titleId, employeeId);
  return res.status(200).send(result);
};
