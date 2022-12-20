// Configuring the database
const { sql, poolPromise } = require("../../config/mssql_hr.config.js");
const { Parser } = require("json2csv");
const excel = require("exceljs");
const fs = require("fs");
const path = require("path");
// const sharp = require("sharp");
const {
  basicSelectFilterQueryBuilder,
} = require("../helper/datatable-fetch.js");

exports.saveThumbImageInFolder = async function (req, res) {
  try {
    var accessQuery =
      "SELECT ei.Image, ei.EmployeeId, e.UserName, ei.ImageName FROM CCPD_EmployeesImages ei INNER JOIN CCPD_Employees e ON e.EmployeeId = ei.EmployeeId AND ei.ImageName IS NULL";

    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    if (result.recordset) {
      for (let image of result.recordset) {
        console.log(image);
        fs.writeFileSync(
          `${path.join(__dirname, "/profiles/")}${image.UserName}_thumb.png`,
          image.Image,
          "binary"
        );
        const filename = `${image.UserName}_thumb.png`;
        $query = `UPDATE CCPD_EmployeesImages SET ImageName='${filename}' WHERE EmployeeId=${image.EmployeeId}`;
        await pool.request().query($query);
        // sharp(
        //   `${path.join(__dirname, "/profiles/")}${image.EmployeeId}_thumb.png`
        // )
        //   .resize(600, 500)
        //   .toFile(
        //     `${path.join(__dirname, "/profiles/")}${image.UserName}_thumb.png`
        //   );

        // fs.rmSync(
        //   `${path.join(__dirname, "/profiles/")}${image.UserName}_thumb.png`,
        //   {
        //     force: true,
        //   }
        // );
      }
    }
  } catch (error) {
    console.log("fetchphoto api error ", error);
  }
  res.send("Saved SuccessFully");
};
exports.saveFullImageInFolder = async function (req, res) {
  try {
    var accessQuery =
      "SELECT ei.Image, ei.EmployeeId, e.UserName FROM CCPD_EmployeesImages2 ei INNER JOIN CCPD_Employees e ON e.EmployeeId = ei.EmployeeId AND ei.ImageName IS NULL";

    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    if (result.recordset) {
      for (let image of result.recordset) {
        fs.writeFileSync(
          `${path.join(__dirname, "/profiles/")}${image.UserName}_full.png`,
          image.Image,
          "binary"
        );
        const filename = `${image.UserName}_full.png`;
        $query = `UPDATE CCPD_EmployeesImages2 SET ImageName='${filename}' WHERE EmployeeId=${image.EmployeeId}`;
        const result = await pool.request().query($query);

        // sharp(
        //   `${path.join(__dirname, "/profiles/")}${image.EmployeeId}_full.png`
        // )
        //   .resize(00, 500)
        //   .toFile(
        //     `${path.join(__dirname, "/profiles/")}${image.UserName}_full.png`
        //   );

        // fs.rmSync(
        //   `${path.join(__dirname, "/profiles/")}${image.UserName}_full.png`,
        //   {
        //     force: true,
        //   }
        // );
      }
    }
  } catch (error) {
    console.log("fetchphoto api error ", error);
  }
  res.send("Saved Successfully");
};
// Retrieve and return all employees from the database.
exports.findAll = async function (req, res) {
  // var accessQuery = "select * from vwCCPDEmployeesMobile";
  const accessQuery = `
    SELECT
      e.[EmployeeId],
      CONCAT(e.[LastName], ', ', e.[FirstName], ', ', et.[Title], ' [', e.[BadgeNumber], ']') AS EmployeeName,
      b.Title AS BureauDesc,
      d.Title AS DivisionDesc,
      u.Title AS UnitDesc,
      e.Status,
      e.WorkEmail,
      CONVERT(varchar(10), e.DOB, 110) AS DOB,
      e.HomeTelephone,
      CONCAT(ce.[LastName], ', ', ce.[FirstName], ', ', cet.[Title], ' [', ce.[BadgeNumber], ']') AS CommanderName,
      e.SSN AS SSN,
      et.Title AS Title
    FROM
      CCPD_Employees AS e
    LEFT JOIN
      Department AS b
    ON
      b.Id = e.Bureau AND b.Level = 1
    LEFT JOIN
      Department AS d
    ON
      d.Id = e.Division2 AND d.Level = 2
    LEFT JOIN
      Department AS u
    ON
      u.Id = e.Unit2 AND u.Level = 3
    LEFT JOIN
      CCPD_Employees AS ce
    ON
      ce.EmployeeId = e.Commander1
    LEFT JOIN
      Title AS et
    ON
      e.Title2 = et.ID
    LEFT JOIN
      Title AS cet
    ON
      ce.Title2 = cet.ID
    ORDER BY
      EmployeeName ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordsets);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return the employee from the database.
exports.findOne = async function (req, res) {
  const accessQuery = `SELECT
    tbl_employees.*,
    tbl_bureau.Title AS BureauName,
    tbl_divisions.Title AS DivisionName,
    tbl_units.Title AS UnitName,
    tbl_titles.Title AS TitleName,
    tbl_branch.Branch AS BranchName,
    ei.ImageName,
    ei2.ImageName as fullPic
    FROM CCPD_Employees AS tbl_employees

    LEFT JOIN Department AS tbl_bureau
    ON tbl_employees.Bureau = tbl_bureau.Id AND tbl_bureau.Level = 1

    LEFT JOIN Department AS tbl_divisions
    ON tbl_employees.Division2 = tbl_divisions.Id AND tbl_divisions.Level = 2

    LEFT JOIN Department AS tbl_units
    ON tbl_employees.Unit2 = tbl_units.Id AND tbl_units.Level = 3

    LEFT JOIN Title AS tbl_titles
    ON tbl_employees.Title2 = tbl_titles.ID

    LEFT JOIN CCPD_EmployeesImages AS ei
    ON ei.EmployeeId = tbl_employees.EmployeeId

    LEFT JOIN CCPD_EmployeesImages2 AS ei2
    ON ei2.EmployeeId = tbl_employees.EmployeeId


    LEFT JOIN Branch AS tbl_branch
    ON tbl_employees.BranchId = tbl_branch.ID

    WHERE tbl_employees.EmployeeId = @input_parameter`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return the employee from the database.
exports.findOneByBadgeNo = async function (req, res) {
  const accessQuery = `SELECT
    tbl_employees.*,
    tbl_bureau.Title AS BureauName,
    tbl_divisions.Title AS DivisionName,
    tbl_units.Title AS UnitName,
    tbl_titles.Title AS TitleName,
    tbl_branch.Branch AS BranchName
    FROM CCPD_Employees AS tbl_employees

    LEFT JOIN Department AS tbl_bureau
    ON tbl_employees.Bureau = tbl_bureau.Id AND tbl_bureau.Level = 1

    LEFT JOIN Department AS tbl_divisions
    ON tbl_employees.Division2 = tbl_divisions.Id AND tbl_divisions.Level = 2

    LEFT JOIN Department AS tbl_units
    ON tbl_employees.Unit2 = tbl_units.Id AND tbl_units.Level = 3

    LEFT JOIN Title AS tbl_titles
    ON tbl_employees.Title2 = tbl_titles.ID

    LEFT JOIN Branch AS tbl_branch
    ON tbl_employees.BranchId = tbl_branch.ID

    WHERE tbl_employees.BadgeNumber = @input_parameter`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return the employee photo1 from the database.
exports.findPhoto1 = async function (req, res) {
  try {
    const response = await this.fetchPhoto(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

fetchPhoto = async (id) => {
  try {
    var accessQuery =
      "SELECT * FROM CCPD_EmployeesImages WHERE EmployeeId = @input_parameter";

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, id)
      .query(accessQuery);

    if (result.recordset[0]) {
      if (result.recordset[0].Image2) {
        result.recordset[0].Image = result.recordset[0].Image2;
      } else {
        result.recordset[0].Image =
          "data:image/png;base64," +
          Buffer.from(result.recordset[0].Image).toString("base64");
      }
      return result.recordset[0];
    } else {
      return {
        EmployeeId: id,
        Image:
          "data:image/png;base64,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",
      };
    }
  } catch (error) {
    console.log("fetchphoto api error ", error);
  }
};
// Retrieve and return the employee photo2 from the database.
exports.findPhoto2 = async function (req, res) {
  var accessQuery =
    "SELECT * FROM CCPD_EmployeesImages2 WHERE EmployeeId = @input_parameter";

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    if (result.recordset[0]) {
      if (result.recordset[0].Image2) {
        result.recordset[0].Image = result.recordset[0].Image2;
      } else {
        result.recordset[0].Image =
          "data:image/png;base64," +
          Buffer.from(result.recordset[0].Image).toString("base64");
      }
      res.send(result.recordset[0]);
    } else {
      res.send({
        EmployeeId: req.params.id,
        Image:
          "data:image/png;base64,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",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return the supervisor from the database.
exports.findSupervisor = async function (req, res) {
  var accessQuery =
    "select EmployeeId, BadgeNumber from CCPD_Employees_View where BadgeNumber = @input_parameter";

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findSupervisorsByEmployeeId = async function (req, res) {
  try {
    const employeeDetails = await getDepartmentIdByEmployeeId(req.params.id);

    if (employeeDetails) {
      const {
        CellPhone,
        bureauId,
        divisionId,
        unitId,
        bureau,
        division,
        unit,
      } = employeeDetails;

      let departmentId = 0;

      if (unitId && unit && unit.indexOf("$") < 0) {
        departmentId = unitId;
      } else if (divisionId && division && division.indexOf("$") < 0) {
        departmentId = divisionId;
      } else if (bureauId && bureau && bureau.indexOf("$") < 0) {
        departmentId = bureauId;
      }

      const data = await getSupervisorByDepartmentId(departmentId);

      if (data) {
        const supervisorDetails = await getDepartmentIdByEmployeeId(
          data.UserId
        );
        const {
          CellPhone,
          bureauId,
          divisionId,
          unitId,
          bureau,
          division,
          unit,
        } = supervisorDetails;
        let supervisorDepartment = "";
        let supervisorDepartmentLevel = "";
        if (unitId && unit && unit.indexOf("$") < 0) {
          supervisorDepartment = unit;
          supervisorDepartmentLevel = "Unit";
        } else if (divisionId && division && division.indexOf("$") < 0) {
          supervisorDepartment = division;
          supervisorDepartmentLevel = "Division";
        } else if (bureauId && bureau && bureau.indexOf("$") < 0) {
          supervisorDepartment = bureau;
          supervisorDepartmentLevel = "Bureau";
        }

        // End Supervisor details

        const supervisorId = data.UserId;
        if (parseInt(supervisorId) === parseInt(req.params.id)) {
          const parentData = await getSupervisorByDepartmentId(data.ParentId);
          const supervisorDetails = await getDepartmentIdByEmployeeId(
            data.ParentId
          );
          const {
            CellPhone,
            bureauId,
            divisionId,
            unitId,
            bureau,
            division,
            unit,
          } = supervisorDetails;
          let supervisorDepartment = "";
          let supervisorDepartmentLevel = "";
          if (unitId && unit && unit.indexOf("$") < 0) {
            supervisorDepartment = unit;
            supervisorDepartmentLevel = "Unit";
          } else if (divisionId && division && division.indexOf("$") < 0) {
            supervisorDepartment = division;
            supervisorDepartmentLevel = "Division";
          } else if (bureauId && bureau && bureau.indexOf("$") < 0) {
            supervisorDepartment = bureau;
            supervisorDepartmentLevel = "Bureau";
          }
          if (parentData) {
            res.json({
              status: 1,
              data: {
                ...parentData,
                CellPhone,
                supervisorDepartment,
                supervisorDepartmentLevel,
              },
              message: "success",
            });
          } else {
            res.json({
              status: 0,
              data: null,
              message: "No data found!",
            });
          }
        } else {
          res.json({
            status: 1,
            data: {
              ...data,
              CellPhone,
              supervisorDepartment,
              supervisorDepartmentLevel,
            },
            message: "success",
          });
        }
      } else {
        res.json({
          status: 0,
          data: null,
          message: "No data found!",
        });
      }
    } else {
      res.json({
        status: 0,
        data: null,
        message: "No data found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: 0,
      data: null,
      message: err.message,
    });
  }
};

fetchThumbImage = async (EmployeeId) => {
  try {
    var accessQuery = `SELECT * from CCPD_EmployeesImages WHERE EmployeeId=${EmployeeId}`;

    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    if (result.recordset[0]) {
      return result.recordset[0].ImageName;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Retrieve and return the subordinate from the database.
exports.findSubordinate = async function (req, res) {
  const employeeIds = [];
  const deptIds = [];
  const supervisorIds = [];
  console.log(req.params.id, req.params.filterValue);
  const findSupervisorsByDelegates = `SELECT
  DISTINCT t.Supervisor
    FROM
      LeaveDelegates as t
    WHERE
      t.DelegateTo = @input_id`;

  try {
    const pool = await poolPromise;
    const result2 = await pool
      .request()
      .input("input_id", sql.Int, req.params.id)
      .query(findSupervisorsByDelegates);

    supervisorIds.push(parseInt(req.params.id));
    result2.recordset.forEach((r) => {
      supervisorIds.push(r.Supervisor);
    });

    const result = await pool
      .request()
      .input("input_id", sql.Int, req.params.id).query(`
        SELECT
          d.Id AS Id,
          d.Level AS Level
        FROM
          [Department Inspector] AS di
        LEFT JOIN
          Department d
        ON
          d.Id = di.DepartmentId
        WHERE
          di.UserId IN (${supervisorIds.join()}) AND d.IsActive = 1 AND d.Title NOT LIKE '%$'
      `);

    if (result.recordset && result.recordset.length) {
      const getSubordinateIdsByDepartmentPromises = [];

      result.recordset.forEach((r) => {
        const { Id, Level } = r;
        deptIds.push(Id);
        getSubordinateIdsByDepartmentPromises.push(
          new Promise((resolve, reject) => {
            getUserIdsByDepartmentForSubordinates(Id, Level)
              .then((ids) => {
                // console.log(ids);
                resolve(ids);
              })
              .catch(() => {
                reject([]);
              });
          })
        );
      });
      Promise.all(getSubordinateIdsByDepartmentPromises)
        .then(async (results) => {
          results.forEach((ids) => {
            employeeIds.push(...ids);
          });
          const childDeptInspectorsQuery = `
            SELECT
              di.UserId
            FROM
              [Department Inspector] AS di
            LEFT JOIN
              Department d
            ON
              d.Id = di.DepartmentId
            WHERE
              d.ParentId IN (${deptIds.join()}) AND d.IsActive = 1
          `;
          const childDeptInspectors = await pool
            .request()
            .query(childDeptInspectorsQuery);
          if (
            childDeptInspectors.recordset &&
            childDeptInspectors.recordset.length
          ) {
            const ids = childDeptInspectors.recordset.map((o) => o.UserId);
            employeeIds.push(...ids);
          }
          if (employeeIds && employeeIds.length) {
            const employeeQuery = `
              SELECT
                e.EmployeeId,
                e.UserName,
                CONCAT(e.[LastName], ', ', e.[FirstName], ', ', tl.[Title], ' [', e.[BadgeNumber], ']') AS EmployeeName,
                bd.Title AS Bureau,
                bd.Id AS BureauId,
                dd.Title AS Division,
                dd.Id AS DivisionId,
                ud.Title AS Unit,
                ud.Id AS UnitId,
                e.Title2 As TitleId,
                ei.ImageName
              FROM
                CCPD_Employees AS e
              LEFT JOIN 
                CCPD_EmployeesImages ei  
              ON e.EmployeeId = ei.EmployeeId  
              LEFT JOIN
                Department AS bd
              ON
                e.Bureau = bd.Id
              LEFT JOIN
                Department AS dd

              ON
                e.Division2 = dd.Id
              LEFT JOIN
                Department AS ud
              ON
                e.Unit2 = ud.Id
              LEFT JOIN
                Title AS tl
              ON
                e.Title2 = tl.ID            
              WHERE
                e.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
                AND e.EmployeeId <> @input_id
                AND e.EmployeeId IN (${employeeIds.join()}) 
              `;
            // console.log(req.params.filterValue, '..........')
            // if(req.params.filterValue != 'null'){
            //   const fv = req.params.filterValue
            //   employeeQuery +=` AND (FirstName LIKE '%${fv}%' OR LastName LIKE '%${fv}%') `
            // }
            const subordinatesResult = await pool
              .request()
              .input("input_id", sql.Int, req.params.id)
              .query(employeeQuery);
            //console.log(subordinatesResult, employeeQuery);
            if (subordinatesResult.recordset) {
              for (let ele of subordinatesResult.recordset) {
                ele["Image"] = null;
              }
              res.status(200).json(subordinatesResult.recordset);
            } else {
              res.status(200).json([]);
            }
          } else {
            res.status(200).json([]);
          }
        })
        .catch(() => {
          res.status(200).json([]);
        });
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getSupervisorsByTitle = async (titleId, b, d, u) => {
  // /*
  //   12 DETECTIVE
  //   20	OFFICER
  //   33	SERGEANT
  //   17	SERGEANT GPA
  //   19	LIEUTENANT
  //   84	LIEUTENANT GPA
  //   3	CAPTAIN
  //   11	DEPUTY CHIEF
  //   2	ASSISTANT CHIEF
  //   4	CHIEF
  // */

  let requiredSupervisorTitle = [];
  switch (+titleId) {
    case 12:
      requiredSupervisorTitle.push(17, 33);
      break;
    case 20:
      requiredSupervisorTitle.push(17, 33);
      break;
    case 17:
      requiredSupervisorTitle.push(19, 84);
      break;
    case 33:
      requiredSupervisorTitle.push(19, 84);
      break;
    case 19:
      requiredSupervisorTitle.push(3);
      break;
    case 84:
      requiredSupervisorTitle.push(3);
      break;
    case 3:
      requiredSupervisorTitle.push(11);
      break;
    case 11:
      requiredSupervisorTitle.push(2);
      break;
    case 2:
      requiredSupervisorTitle.push(4);
      break;
  }

  const employeeQuery = `SELECT
    e.EmployeeId,
    e.UserName,
    CONCAT(e.[LastName], ', ', e.[FirstName], ', ', tl.[Title], ' [', e.[BadgeNumber], ']') AS EmployeeName,
    e.Bureau,
    e.Division2,
    e.Unit2
  FROM
    CCPD_Employees AS e
  LEFT JOIN
    Title AS tl
  ON
    e.Title2 = tl.ID
  WHERE
    e.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
    AND (e.Bureau = ${b} OR e.Bureau is Null) AND (e.Division2 =  ${d} OR e.Division2 is Null) AND (e.Unit2 = ${u} OR e.Unit2 is Null) AND
    e.Title2 IN (${requiredSupervisorTitle.join()}) AND e.isActive = 1`;

  if (requiredSupervisorTitle.length > 0) {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(employeeQuery);
      return result.recordset;
    } catch (err) {
      return err.message;
    }
  } else {
    return [];
  }
};

exports.findSupervisorsByTitle = async (req, res) => {
  const { titleId, b, d, u } = req.params;
  const SupervisorsByTitle = await getSupervisorsByTitle(titleId, b, d, u);
  if (SupervisorsByTitle.length > 0) {
    try {
      res.json(SupervisorsByTitle);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(200).json([]);
  }
};

//Retrieve the employee id
exports.findEmployeeId = async function (req, res) {
  var accessQuery =
    "select EmployeeId from CCPD_Employees where UserName = @input_name";

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_name", sql.Char, req.params.name)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve the employee username

exports.findEmployeeUsernameById = async function (req, res) {
  var accessQuery =
    "select UserName from CCPD_Employees where EmployeeId = @input_id";

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findEmployeeByUsername = async function (req, res) {
  const query = `
    SELECT
      e.*,
      CONCAT(e.LastName, ', ', e.FirstName, ', ', e.Title, '[', e.BadgeNumber, ']') AS FullNameWithBadge
    FROM
      CCPD_Employees AS e
    WHERE
      e.UserName = @input_name
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_name", sql.Char, req.params.username)
      .query(query);
    if (result.recordset && result.recordset[0]) {
      res.json(result.recordset[0]);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return all Titles from the database.
exports.findTitle = async function (req, res) {
  var accessQuery =
    "SELECT *, ID AS value, Title AS label FROM Title WHERE Title <> '' ORDER BY Title";
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    return res.json(result.recordset);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
exports.findTitlev2 = async function (req, res) {
  const status = req.params.status;
  var accessQuery = `SELECT *, ID AS value, Title AS label FROM Title WHERE Title <> '' AND ID IN(select distinct Title2 from CCPD_Employees where IsActive=${status}) ORDER BY Title`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    return res.json(result.recordset);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.TransferReport = async function (req, res) {
  const {
    StartDate,
    EndDate,
    DivisionId,
    BureauId,
    Unit,
    Employee,
    page,
    rowperpage,
    orderDirection,
    orderBy,
    recordTypeTransfer,
    recordTypePromotion,
    recordTypeTermination,
  } = req.body;

  let includes1 = "";

  if (recordTypeTransfer) {
    includes1 += "'bureau','division','unit'";
  }
  if (recordTypePromotion) {
    recordTypeTransfer ? (includes1 += ",'title'") : (includes1 += "'title'");
  }
  if (recordTypeTermination) {
    recordTypeTransfer
      ? (includes1 += ",''")
      : recordTypePromotion
      ? (includes1 += ",''")
      : (includes1 += "''");
  }

  let query1 = `
    SELECT NextValue 
    FROM
    EmployeeLogHistory as eh
      INNER JOIN CCPD_Employees ON eh.EmployeeId = CCPD_Employees.EmployeeId`;

  query1 += ` WHERE eh.CreatedAt >= @input_start_date AND eh.CreatedAt <= @input_end_date AND Field In(${includes1}) AND CCPD_Employees.Status NOT IN ('RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;

  if (Unit) {
    query1 += ` AND CCPD_Employees.Unit2 = ${Unit}`;
  }

  if (DivisionId) {
    query1 += ` AND CCPD_Employees.Division2 = ${DivisionId}`;
  }
  if (BureauId) {
    query1 += ` AND  CCPD_Employees.Bureau = ${BureauId}`;
  }
  if (Employee) {
    query1 += ` AND CCPD_Employees.UserName = '${Employee}'`;
  }

  // End Count Query 1

  let includes3 = "";

  if (recordTypeTransfer) {
    includes3 += "'bureau','division','unit'";
  }
  if (recordTypePromotion) {
    recordTypeTransfer ? (includes3 += ",'title'") : (includes3 += "'title'");
  }
  if (recordTypeTermination) {
    recordTypeTransfer
      ? (includes3 += ",'status'")
      : recordTypePromotion
      ? (includes3 += ",'status'")
      : (includes3 += "'status'");
  }

  let query3 = `
    SELECT NextValue 
    FROM
    EmployeeLogHistory as eh3
      INNER JOIN CCPD_Employees ON eh3.EmployeeId = CCPD_Employees.EmployeeId`;

  query3 += ` WHERE eh3.CreatedAt >= @input_start_date AND eh3.CreatedAt <= @input_end_date AND Field In(${includes3}) AND CCPD_Employees.Status NOT IN ('RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;

  if (Unit) {
    query3 += ` AND CCPD_Employees.Unit2 = ${Unit}`;
  }

  if (DivisionId) {
    query3 += ` AND CCPD_Employees.Division2 = ${DivisionId}`;
  }
  if (BureauId) {
    query3 += ` AND  CCPD_Employees.Bureau = ${BureauId}`;
  }
  if (Employee) {
    query3 += ` AND CCPD_Employees.UserName = '${Employee}'`;
  }

  // Start Query

  let includes = "";

  if (recordTypeTransfer) {
    includes += "'bureau','division','unit'";
  }
  if (recordTypePromotion) {
    recordTypeTransfer ? (includes += ",'title'") : (includes += "'title'");
  }

  if (recordTypeTermination) {
    recordTypeTransfer
      ? (includes += ",''")
      : recordTypePromotion
      ? (includes += ",''")
      : (includes += "''");
  }

  let query = `SELECT
  eh.*,CCPD_Employees.Bureau, CCPD_Employees.Division2, CCPD_Employees.Unit2,CCPD_Employees.Title2, CCPD_Employees.Status, CONCAT(CCPD_Employees.LastName, ', ', CCPD_Employees.FirstName, ', ', CCPD_Employees.Title, ' [', CCPD_Employees.BadgeNumber, ']') 
AS EmployeeName,
CONCAT('',(select Title from Department WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh.PrevValue))) as PrevDepart, 
CONCAT('',(select Title from Department WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh.NextValue))) as NextDepart,
(select Title from Title WHERE CONVERT(VARCHAR(100), ID) =  CONVERT(VARCHAR(100), eh.PrevValue)) as PrevTitle,
(select Title from Title WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh.NextValue)) as NextTitle, 
CONCAT('',(select CONCAT(e.LastName, ', ', e.FirstName, ', ', e.Title, ' [', e.BadgeNumber, ']') from CCPD_Employees e WHERE e.UserName = eh.CreatedBy AND e.IsActive = 1)) AS ModifiedBy
  FROM
  EmployeeLogHistory as eh
    LEFT JOIN CCPD_Employees ON eh.EmployeeId = CCPD_Employees.EmployeeId 
  `;
  query += ` WHERE eh.CreatedAt >= @input_start_date AND eh.CreatedAt <= @input_end_date AND Field In(${includes}) AND CCPD_Employees.Status NOT IN ('RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;

  if (Unit) {
    query += ` AND CCPD_Employees.Unit2 = ${Unit}`;
  }

  if (DivisionId) {
    query += ` AND CCPD_Employees.Division2 = ${DivisionId}`;
  }
  if (BureauId) {
    query += ` AND  CCPD_Employees.Bureau = ${BureauId}`;
  }
  if (Employee) {
    query += ` AND CCPD_Employees.UserName = '${Employee}'`;
  }
  // Start Query 2

  let includes2 = "";

  if (recordTypeTransfer) {
    includes2 += "'bureau','division','unit'";
  }
  if (recordTypePromotion) {
    recordTypeTransfer ? (includes2 += ",'title'") : (includes2 += "'title'");
  }

  if (recordTypeTermination) {
    recordTypeTransfer
      ? (includes2 += ",'status'")
      : recordTypePromotion
      ? (includes2 += ",'status'")
      : (includes2 += "'status'");
  }

  let query2 = `SELECT
  eh2.*,CCPD_Employees.Bureau, CCPD_Employees.Division2, CCPD_Employees.Unit2,CCPD_Employees.Title2, CCPD_Employees.Status, CONCAT(CCPD_Employees.LastName, ', ', CCPD_Employees.FirstName, ', ', CCPD_Employees.Title, ' [', CCPD_Employees.BadgeNumber, ']') 
AS EmployeeName,
CONCAT('',(select Title from Department WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh2.PrevValue))) as PrevDepart, 
CONCAT('',(select Title from Department WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh2.NextValue))) as NextDepart,
(select Title from Title WHERE CONVERT(VARCHAR(100), ID) =  CONVERT(VARCHAR(100), eh2.PrevValue)) as PrevTitle,
(select Title from Title WHERE CONVERT(VARCHAR(100), ID) = CONVERT(VARCHAR(100), eh2.NextValue)) as NextTitle, 
CONCAT('',(select CONCAT(e.LastName, ', ', e.FirstName, ', ', e.Title, ' [', e.BadgeNumber, ']') from CCPD_Employees e WHERE e.UserName = eh2.CreatedBy AND e.IsActive = 1)) AS ModifiedBy
  FROM
  EmployeeLogHistory as eh2
    LEFT JOIN CCPD_Employees ON eh2.EmployeeId = CCPD_Employees.EmployeeId 
  `;
  query2 += ` WHERE eh2.CreatedAt >= @input_start_date AND eh2.CreatedAt <= @input_end_date AND Field In(${includes2}) AND CCPD_Employees.Status NOT IN ('RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;

  if (Unit) {
    query2 += ` AND CCPD_Employees.Unit2 = ${Unit}`;
  }

  if (DivisionId) {
    query2 += ` AND CCPD_Employees.Division2 = ${DivisionId}`;
  }
  if (BureauId) {
    query2 += ` AND  CCPD_Employees.Bureau = ${BureauId}`;
  }
  if (Employee) {
    query2 += ` AND CCPD_Employees.UserName = '${Employee}'`;
  }

  const offset = page * rowperpage;
  const finalQuery = `${query} UNION ${query2} AND eh2.NextValue='TERMINATED' ORDER BY eh.Id DESC OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY`;
  const finalQuery3 = `select count(*) AS totalCount from(${query1} UNION ALL ${query3} AND eh3.NextValue='TERMINATED') as abc`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(finalQuery);

    const result1 = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(finalQuery3);
    console.log(finalQuery3);
    if (result && result.recordset) {
      const [{ totalCount }] = result1.recordset;
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        total: totalCount,
        message: "Records Fetched Successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: [],
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

// Retrieve and return all Status from the database.
exports.findStatus = async function (req, res) {
  var accessQuery =
    "SELECT *, Status AS value, Status AS label FROM Status WHERE Status <> '' ORDER BY Status";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// exports.findInActiveStatus = async function (req, res) {
//   var accessQuery =
//     "SELECT *, Status AS value, Status AS label FROM Status WHERE Status <> '' AND Status IN(select distinct Status from CCPD_Employees where IsActive=0) AND Status<>'ACTIVE' ORDER BY Status";

//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query(accessQuery);
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };
// exports.fetchInactiveEmployee = async function (req, res) {
//   const { title, status, rowperpage, page, orderDirection, searchText } =
//     req.body;
//   let query2 = "",
//     query3 = "";
//   let query = `
//   SELECT
//     e.*,
//     (SELECT Title from Department Where Id=e.Bureau) as BureauName,
//     (SELECT Title from Department Where Id=e.Division2) as DivisionName,
//     (SELECT Title from Department Where Id=e.Unit2) as UnitName,
//     (SELECT Title from Title Where ID=e.Title2 order By Title) as TitleName,
//     ei.ImageName
//   FROM
//     CCPD_Employees AS e
//     LEFT JOIN CCPD_EmployeesImages ei ON ei.EmployeeId = e.EmployeeId
//   WHERE
//      Status <> 'ACTIVE'`;

//   if (title && title != "null") {
//     query += ` AND Title2=${title}`;
//   }
//   if (status && status != "null") {
//     query += ` AND Status='${status}'`;
//   }
//   if (searchText) {
//     query += ` AND (e.FirstName LIKE '%${searchText}%' OR e.LastName LIKE '%${searchText}%' )`;
//   }
//   query2 = query3 = query;
//   const offset = page * rowperpage;
//   query += ` ORDER BY TitleName  asc OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY`;
//   try {
//     console.log(query)
//     const pool = await poolPromise;
//     const result = await pool.request().query(query);
//     const result2 = await pool.request().query(query2);
//     const result3 = await pool.request().query(query3);
//     if (result && result.recordset && result.recordset) {
//       let totalCount = result2.recordset.length;
//       return res.status(200).json({
//         status: 1,
//         data: result.recordset,
//         totalData: result3.recordset,
//         total: totalCount,
//         message: "Records Fetched Successfully!",
//         error: "",
//       });
//     }
//     return null;
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: "",
//       error: "Something went wrong! Please try again later." + error,
//     });
//   }
// };
// Retrieve and return all State from the database.
exports.findState = async function (req, res) {
  var accessQuery =
    "SELECT *, State AS value, State AS label FROM State WHERE State <> '' ORDER BY State";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve handgun
exports.Findhandgun = async function (req, res) {
  var accessQuery = `SELECT Handgun.SerialNumber,Equipment_types.Name,Action
  FROM [CCPDEmployeesDev].[dbo].EmployeeHandgunLog
  inner join Handgun on HandgunId = Handgun.Id
  inner join Equipment_types on Equipment_types.Id = EquipmentType_id where EmployeeId = ${req.params.id} order by EmployeeHandgunLog.Id desc`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return all Education Code from the database.
exports.findEducation = async function (req, res) {
  var accessQuery =
    "SELECT *, Code AS value, Code AS label FROM EducationalCode WHERE Code <> '' ORDER BY Code";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve and return all Race from the database.
exports.findRace = async function (req, res) {
  var accessQuery =
    "SELECT *, Race AS value, Race AS label FROM Race WHERE Race <> '' ORDER BY Race";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.findInActiveStatus = async function (req, res) {
  var accessQuery =
    "SELECT *, Status AS value, Status AS label FROM Status WHERE Status <> '' AND Status IN(select distinct Status from CCPD_Employees where IsActive=0) AND Status<>'ACTIVE' ORDER BY Status";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.fetchInactiveEmployee = async function (req, res) {
  const { title, status, rowperpage, page, orderDirection, searchText } =
    req.body;
  let query2 = "",
    query3 = "";
  let query = `
  SELECT
    e.*,
    (SELECT Title from Department Where Id=e.Bureau) as BureauName,
    (SELECT Title from Department Where Id=e.Division2) as DivisionName,
    (SELECT Title from Department Where Id=e.Unit2) as UnitName,
    (SELECT Title from Title Where ID=e.Title2) as TitleName
  FROM
    CCPD_Employees AS e
  WHERE
     Status <> 'ACTIVE'`;

  if (title && title != "null") {
    query += ` AND Title2=${title}`;
  }
  if (status && status != "null") {
    query += ` AND Status='${status}'`;
  }
  if (searchText) {
    query += ` AND (e.FirstName LIKE '%${searchText}%' OR e.LastName LIKE '%${searchText}%' )`;
  }
  query2 = query3 = query;
  const offset = page * rowperpage;
  query += ` ORDER BY TitleName ASC OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY`;
  try {
    console.log(query)
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const result2 = await pool.request().query(query2);
    const result3 = await pool.request().query(query3);
    if (result && result.recordset && result.recordset) {
      let totalCount = result2.recordset.length;
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        totalData: result3.recordset,
        total: totalCount,
        message: "Records Fetched Successfully!",
        error: "",
      });
    }
    return null;
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

// Create new record for the database.
exports.createOne = async function (req, res) {
  var accessQuery = `insert into CCPD_Employees (
    FirstName, MiddleInitial, LastName, Suffix, DOB, Race, Gender, SSN, StateofBirth, MaritalStatus, USCitizenStatus, VeteranStatus, DriverLicense, StateId, DLIssueDate, DLExpirationDate, BadgeNumber, UserName, HireDate, Status, IsActive, SwornOfficer, HomeTelephone, CellPhone, WorkEmail, OtherEmail, HouseNumber, ApartmentNumber, StreetName, City, County, State, Zip, EmgContactName1, EmgRelationShip1, EmgAddress1, EmgPhone11, EmgPhone12, EmgContactName2, EmgRelationShip2, EmgAddress2, EmgPhone21, EmgPhone22, HandgunSerialNumber, LockerNumber, Bilingual, Language, EducationCode, HealthInsuranceD1Ssn, HealthInsuranceD1Name, HealthInsuranceD1DOB, HealthInsuranceD2Ssn, HealthInsuranceD2Name, HealthInsuranceD2DOB, HealthInsuranceD3Ssn, HealthInsuranceD3Name, HealthInsuranceD3DOB, HealthInsuranceD4Ssn, HealthInsuranceD4Name, HealthInsuranceD4DOB, HealthInsuranceD5Ssn, HealthInsuranceD5Name, HealthInsuranceD5DOB, HealthInsuranceD6Ssn, HealthInsuranceD6Name, HealthInsuranceD6DOB, HealthInsuranceD7Ssn, HealthInsuranceD7Name, HealthInsuranceD7DOB, HealthInsuranceD8Ssn, HealthInsuranceD8Name, HealthInsuranceD8DOB, HealthInsuranceD9Ssn, HealthInsuranceD9Name, HealthInsuranceD9DOB, CreateDate, CreatedBy, Bureau, Unit2, Title2, Division2, BranchId, BranchActive
  ) values (
    @input_firstName, @input_middleInitial, @input_lastName, @input_suffix, @input_dob, @input_race, @input_gender, @input_ssn, @input_stateofBirth, @input_maritalStatus, @input_usCitizenStatus, @input_veteranStatus, @input_driverLicense, @input_stateId, @input_dlIssueDate, @input_dlExpirationDate, @input_badgeNumber, @input_userName, @input_hireDate, @input_status, 1, @input_swornOfficer, @input_homeTelephone, @input_cellPhone, @input_workEmail, @input_otherEmail, @input_houseNumber, @input_apartmentNumber, @input_streetName, @input_city, @input_county, @input_state, @input_zip, @input_emgContactName1, @input_emgRelationShip1, @input_emgAddress1, @input_emgPhone11, @input_emgPhone12, @input_emgContactName2, @input_emgRelationShip2, @input_emgAddress2, @input_emgPhone21, @input_emgPhone22, @input_handgunSerialNumber, @input_lockerNumber, @input_bilingual, @input_language, @input_educationCode, @input_healthInsuranceD1Ssn, @input_healthInsuranceD1Name, @input_healthInsuranceD1DOB, @input_healthInsuranceD2Ssn, @input_healthInsuranceD2Name, @input_healthInsuranceD2DOB, @input_healthInsuranceD3Ssn, @input_healthInsuranceD3Name, @input_healthInsuranceD3DOB, @input_healthInsuranceD4Ssn, @input_healthInsuranceD4Name, @input_healthInsuranceD4DOB, @input_healthInsuranceD5Ssn, @input_healthInsuranceD5Name, @input_healthInsuranceD5DOB, @input_healthInsuranceD6Ssn, @input_healthInsuranceD6Name, @input_healthInsuranceD6DOB, @input_healthInsuranceD7Ssn, @input_healthInsuranceD7Name, @input_healthInsuranceD7DOB, @input_healthInsuranceD8Ssn, @input_healthInsuranceD8Name, @input_healthInsuranceD8DOB, @input_healthInsuranceD9Ssn, @input_healthInsuranceD9Name, @input_healthInsuranceD9DOB, GETDATE(), @input_createdBy, @input_bureauId, @input_unitId, @input_titleId, @input_divisionId, @input_branch, @input_branchActive
  );`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_firstName", sql.Char, req.body.firstName)
      .input(
        "input_middleInitial",
        sql.Char,
        req.body.middleInitial ? req.body.middleInitial : null
      )
      .input("input_lastName", sql.Char, req.body.lastName)
      .input("input_suffix", sql.Char, req.body.suffix ? req.body.suffix : null)
      .input("input_dob", sql.DateTime2, req.body.dob ? req.body.dob : null)
      .input("input_race", sql.Char, req.body.race)
      .input("input_gender", sql.Char, req.body.gender ? req.body.gender : null)
      .input("input_ssn", sql.Char, req.body.ssn)
      .input(
        "input_stateofBirth",
        sql.Char,
        req.body.stateofBirth ? req.body.stateofBirth : null
      )
      .input(
        "input_maritalStatus",
        sql.Char,
        req.body.maritalStatus ? req.body.maritalStatus : null
      )
      .input(
        "input_usCitizenStatus",
        sql.Char,
        req.body.usCitizenStatus ? req.body.usCitizenStatus : null
      )
      .input(
        "input_veteranStatus",
        sql.Char,
        req.body.veteranStatus ? req.body.veteranStatus : null
      )
      .input(
        "input_driverLicense",
        sql.Char,
        req.body.driverLicense ? req.body.driverLicense : null
      )
      .input(
        "input_stateId",
        sql.Char,
        req.body.stateId ? req.body.stateId : null
      )
      .input(
        "input_dlIssueDate",
        sql.Char,
        req.body.dlIssueDate ? req.body.dlIssueDate : null
      )
      .input(
        "input_dlExpirationDate",
        sql.Char,
        req.body.dlExpirationDate ? req.body.dlExpirationDate : null
      )
      .input(
        "input_badgeNumber",
        sql.Int,
        req.body.badgeNumber ? req.body.badgeNumber : null
      )
      .input("input_userName", sql.Char, req.body.userName)
      .input(
        "input_hireDate",
        sql.DateTime2,
        req.body.hireDate ? req.body.hireDate : null
      )
      .input("input_status", sql.Char, req.body.status ? req.body.status : null)
      .input(
        "input_swornOfficer",
        sql.Bit,
        req.body.swornOfficer && req.body.swornOfficer === "1" ? 1 : 0
      )
      .input(
        "input_homeTelephone",
        sql.Char,
        req.body.homeTelephone ? req.body.homeTelephone : null
      )
      .input(
        "input_cellPhone",
        sql.Char,
        req.body.cellPhone ? req.body.cellPhone : null
      )
      .input("input_workEmail", sql.Char, req.body.workEmail)
      .input(
        "input_otherEmail",
        sql.Char,
        req.body.otherEmail ? req.body.otherEmail : null
      )
      .input(
        "input_houseNumber",
        sql.Char,
        req.body.houseNumber ? req.body.houseNumber : null
      )
      .input(
        "input_apartmentNumber",
        sql.Char,
        req.body.apartmentNumber ? req.body.apartmentNumber : null
      )
      .input(
        "input_streetName",
        sql.Char,
        req.body.streetName ? req.body.streetName : null
      )
      .input("input_city", sql.Char, req.body.city ? req.body.city : null)
      .input("input_county", sql.Char, req.body.county ? req.body.county : null)
      .input("input_state", sql.Char, req.body.state ? req.body.state : null)
      .input("input_zip", sql.Char, req.body.zip ? req.body.zip : null)
      .input(
        "input_emgContactName1",
        sql.Char,
        req.body.emgContactName1 ? req.body.emgContactName1 : null
      )
      .input(
        "input_emgRelationShip1",
        sql.Char,
        req.body.emgRelationShip1 ? req.body.emgRelationShip1 : null
      )
      .input(
        "input_emgAddress1",
        sql.Char,
        req.body.emgAddress1 ? req.body.emgAddress1 : null
      )
      .input(
        "input_emgPhone11",
        sql.Char,
        req.body.emgPhone11 ? req.body.emgPhone11 : null
      )
      .input(
        "input_emgPhone12",
        sql.Char,
        req.body.emgPhone12 ? req.body.emgPhone12 : null
      )
      .input(
        "input_emgContactName2",
        sql.Char,
        req.body.emgContactName2 ? req.body.emgContactName2 : null
      )
      .input(
        "input_emgRelationShip2",
        sql.Char,
        req.body.emgRelationShip2 ? req.body.emgRelationShip2 : null
      )
      .input(
        "input_emgAddress2",
        sql.Char,
        req.body.emgAddress2 ? req.body.emgAddress2 : null
      )
      .input(
        "input_emgPhone21",
        sql.Char,
        req.body.emgPhone21 ? req.body.emgPhone21 : null
      )
      .input(
        "input_emgPhone22",
        sql.Char,
        req.body.emgPhone22 ? req.body.emgPhone22 : null
      )
      .input(
        "input_handgunSerialNumber",
        sql.Char,
        req.body.handgunSerialNumber ? req.body.handgunSerialNumber : null
      )
      .input(
        "input_lockerNumber",
        sql.Char,
        req.body.lockerNumber ? req.body.lockerNumber : null
      )
      .input(
        "input_bilingual",
        sql.Char,
        req.body.bilingual ? req.body.bilingual : null
      )
      .input(
        "input_language",
        sql.Char,
        req.body.language ? req.body.language : null
      )
      .input(
        "input_educationCode",
        sql.Char,
        req.body.educationCode ? req.body.educationCode : null
      )
      .input(
        "input_healthInsuranceD1Ssn",
        sql.Char,
        req.body.healthInsuranceD1Ssn ? req.body.healthInsuranceD1Ssn : null
      )
      .input(
        "input_healthInsuranceD1Name",
        sql.Char,
        req.body.healthInsuranceD1Name ? req.body.healthInsuranceD1Name : null
      )
      .input(
        "input_healthInsuranceD1DOB",
        sql.DateTime2,
        req.body.healthInsuranceD1DOB ? req.body.healthInsuranceD1DOB : null
      )
      .input(
        "input_healthInsuranceD2Ssn",
        sql.Char,
        req.body.healthInsuranceD2Ssn ? req.body.healthInsuranceD2Ssn : null
      )
      .input(
        "input_healthInsuranceD2Name",
        sql.Char,
        req.body.healthInsuranceD2Name ? req.body.healthInsuranceD2Name : null
      )
      .input(
        "input_healthInsuranceD2DOB",
        sql.DateTime2,
        req.body.healthInsuranceD2DOB ? req.body.healthInsuranceD2DOB : null
      )
      .input(
        "input_healthInsuranceD3Ssn",
        sql.Char,
        req.body.healthInsuranceD3Ssn ? req.body.healthInsuranceD3Ssn : null
      )
      .input(
        "input_healthInsuranceD3Name",
        sql.Char,
        req.body.healthInsuranceD3Name ? req.body.healthInsuranceD3Name : null
      )
      .input(
        "input_healthInsuranceD3DOB",
        sql.DateTime2,
        req.body.healthInsuranceD3DOB ? req.body.healthInsuranceD3DOB : null
      )
      .input(
        "input_healthInsuranceD4Ssn",
        sql.Char,
        req.body.healthInsuranceD4Ssn ? req.body.healthInsuranceD4Ssn : null
      )
      .input(
        "input_healthInsuranceD4Name",
        sql.Char,
        req.body.healthInsuranceD4Name ? req.body.healthInsuranceD4Name : null
      )
      .input(
        "input_healthInsuranceD4DOB",
        sql.DateTime2,
        req.body.healthInsuranceD4DOB ? req.body.healthInsuranceD4DOB : null
      )
      .input(
        "input_healthInsuranceD5Ssn",
        sql.Char,
        req.body.healthInsuranceD5Ssn ? req.body.healthInsuranceD5Ssn : null
      )
      .input(
        "input_healthInsuranceD5Name",
        sql.Char,
        req.body.healthInsuranceD5Name ? req.body.healthInsuranceD5Name : null
      )
      .input(
        "input_healthInsuranceD5DOB",
        sql.DateTime2,
        req.body.healthInsuranceD5DOB ? req.body.healthInsuranceD5DOB : null
      )
      .input(
        "input_healthInsuranceD6Ssn",
        sql.Char,
        req.body.healthInsuranceD6Ssn ? req.body.healthInsuranceD6Ssn : null
      )
      .input(
        "input_healthInsuranceD6Name",
        sql.Char,
        req.body.healthInsuranceD6Name ? req.body.healthInsuranceD6Name : null
      )
      .input(
        "input_healthInsuranceD6DOB",
        sql.DateTime2,
        req.body.healthInsuranceD6DOB ? req.body.healthInsuranceD6DOB : null
      )
      .input(
        "input_healthInsuranceD7Ssn",
        sql.Char,
        req.body.healthInsuranceD7Ssn ? req.body.healthInsuranceD7Ssn : null
      )
      .input(
        "input_healthInsuranceD7Name",
        sql.Char,
        req.body.healthInsuranceD7Name ? req.body.healthInsuranceD7Name : null
      )
      .input(
        "input_healthInsuranceD7DOB",
        sql.DateTime2,
        req.body.healthInsuranceD7DOB ? req.body.healthInsuranceD7DOB : null
      )
      .input(
        "input_healthInsuranceD8Ssn",
        sql.Char,
        req.body.healthInsuranceD8Ssn ? req.body.healthInsuranceD8Ssn : null
      )
      .input(
        "input_healthInsuranceD8Name",
        sql.Char,
        req.body.healthInsuranceD8Name ? req.body.healthInsuranceD8Name : null
      )
      .input(
        "input_healthInsuranceD8DOB",
        sql.DateTime2,
        req.body.healthInsuranceD8DOB ? req.body.healthInsuranceD8DOB : null
      )
      .input(
        "input_healthInsuranceD9Ssn",
        sql.Char,
        req.body.healthInsuranceD9Ssn ? req.body.healthInsuranceD9Ssn : null
      )
      .input(
        "input_healthInsuranceD9Name",
        sql.Char,
        req.body.healthInsuranceD9Name ? req.body.healthInsuranceD9Name : null
      )
      .input(
        "input_healthInsuranceD9DOB",
        sql.DateTime2,
        req.body.healthInsuranceD9DOB ? req.body.healthInsuranceD9DOB : null
      )
      .input(
        "input_createdBy",
        sql.Char,
        req.body.createdBy ? req.body.createdBy : null
      )
      .input(
        "input_bureauId",
        sql.Int,
        req.body.bureau ? req.body.bureau : null
      )
      .input("input_unitId", sql.Int, req.body.unit ? req.body.unit : null)
      .input("input_titleId", sql.Int, req.body.title ? req.body.title : null)
      .input(
        "input_divisionId",
        sql.Int,
        req.body.division ? req.body.division : null
      )
      .input("input_branch", sql.Int, req.body.branch ? req.body.branch : null)
      .input(
        "input_branchActive",
        sql.Bit,
        req.body.branchActive
          ? true
          : req.body.branchActive === false
          ? false
          : null
      )
      .query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update record - Personal Info for the database.
exports.updateOneP1 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    FirstName = @input_firstName,
    MiddleInitial = @input_middleInitial,
    LastName = @input_lastName,
    Suffix = @input_suffix,
    DOB = @input_dob,
    Race = @input_race,
    Gender = @input_gender,
    SSN = @input_ssn,
    StateofBirth = @input_stateofBirth,
    MaritalStatus = @input_maritalStatus,
    USCitizenStatus = @input_usCitizenStatus,
    VeteranStatus = @input_veteranStatus,
    DriverLicense = @input_driverLicense,
    StateId = @input_stateId,
    DLIssueDate = @input_dlIssueDate,
    DLExpirationDate = @input_dlExpirationDate,
    BranchId = @input_branch,
    BranchActive = @input_branchActive,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_firstName", sql.Char, req.body.firstName)
      .input(
        "input_middleInitial",
        sql.Char,
        req.body.middleInitial ? req.body.middleInitial : null
      )
      .input("input_lastName", sql.Char, req.body.lastName)
      .input("input_suffix", sql.Char, req.body.suffix ? req.body.suffix : null)
      .input("input_dob", sql.DateTime2, req.body.dob ? req.body.dob : null)
      .input("input_race", sql.Char, req.body.race)
      .input("input_gender", sql.Char, req.body.gender)
      .input("input_ssn", sql.Char, req.body.ssn)
      .input(
        "input_stateofBirth",
        sql.Char,
        req.body.stateofBirth ? req.body.stateofBirth : null
      )
      .input(
        "input_maritalStatus",
        sql.Char,
        req.body.maritalStatus ? req.body.maritalStatus : null
      )
      .input(
        "input_usCitizenStatus",
        sql.Char,
        req.body.usCitizenStatus ? req.body.usCitizenStatus : null
      )
      .input(
        "input_veteranStatus",
        sql.Char,
        req.body.veteranStatus ? req.body.veteranStatus : null
      )
      .input(
        "input_driverLicense",
        sql.Char,
        req.body.driverLicense ? req.body.driverLicense : null
      )
      .input(
        "input_stateId",
        sql.Char,
        req.body.stateId ? req.body.stateId : null
      )
      .input(
        "input_dlIssueDate",
        sql.DateTime2,
        req.body.dlIssueDate ? req.body.dlIssueDate : null
      )
      .input(
        "input_dlExpirationDate",
        sql.DateTime2,
        req.body.dlExpirationDate ? req.body.dlExpirationDate : null
      )
      .input("input_branch", sql.Char, req.body.branch ? req.body.branch : null)
      .input(
        "input_branchActive",
        sql.Bit,
        req.body.branchActive
          ? true
          : req.body.branchActive === false
          ? false
          : null
      )
      .input("input_updatedBy", sql.Char, req.body.updatedBy)

      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const verifyDepartmentBeforeTransfer = async (empId, b, d, u) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      `SELECT
        e.UserName, e.Title2, e.Bureau AS bureauId, e.Division2 AS divisionId, e.Unit2 AS unitId,
        db.Title AS bureau, dd.Title AS division, du.Title AS unit
      FROM
        CCPD_Employees AS e
      LEFT JOIN
        Department AS db
      ON
        db.Id = e.Bureau
      LEFT JOIN
        Department AS dd
      ON
        dd.Id = e.Division2
      LEFT JOIN
        Department AS du
      ON
        du.Id = e.Unit2
      WHERE
        e.EmployeeId = ${empId}`
    );
    const {
      UserName,
      Title2,
      bureauId,
      divisionId,
      unitId,
      bureau,
      division,
      unit,
    } = result.recordset[0];

    let verificationResult = true;
    let departmentId = 0;
    let newDepartmentId = 0;
    let newSupervisorId = 0;

    if (unitId && unit && unit.indexOf("$") < 0) {
      departmentId = unitId;
      newDepartmentId = u;
      verificationResult = unitId === u ? true : false;
    } else if (divisionId && division && division.indexOf("$") < 0) {
      departmentId = divisionId;
      newDepartmentId = d;
      verificationResult = divisionId === d ? true : false;
    } else if (bureauId && bureau && bureau.indexOf("$") < 0) {
      departmentId = bureauId;
      newDepartmentId = b;
      verificationResult = bureauId === b ? true : false;
    }

    if (!verificationResult) {
      const data = await getSupervisorByDepartmentId(newDepartmentId);
      if (data) {
        const newSupportSupervisors = await getSupervisorsByTitle(
          Title2,
          b,
          d,
          u
        );
        if (parseInt(data.UserId) === parseInt(empId)) {
          const parentData = await getSupervisorByDepartmentId(data.ParentId);
          newSupervisorId = parentData.UserId;
        } else {
          newSupervisorId = data.UserId;
        }
        const updateQuery = `
        UPDATE EmployeeLeaves SET
            Supervisor = ${newSupervisorId},
            Supervisor2 = '${
              newSupportSupervisors &&
              newSupportSupervisors.map((o) => o.EmployeeId).join(",")
            }'
        WHERE
            UserName LIKE '%${UserName}%'`;
        await pool.request().query(updateQuery);
        return true;
      }
    }
  } catch (error) {
    return error;
  }
};

// Update record - Department Info for the database.
exports.updateOneP2 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    BadgeNumber = @input_badgeNumber,
    UserName = @input_userName,
    Title2 = @input_title,
    HireDate = @input_hireDate,
    Status = @input_status,
    RetireDate = @input_retireDate,
    SwornOfficer = @input_swornOfficer,
    IsActive = @input_isActive,
    Bureau = @input_bureau,
    Division2 = @input_division,
    Unit2 = @input_unit,
    TransferEffectiveDate = @input_transferDate,
    PromotionDate = @input_PromotionDate,
    TransferNotes = @input_TransferNotes,
    TerminateDate = @input_TerminateDate,
    TerminateNotes = @input_TerminateNotes,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    verifyDepartmentBeforeTransfer(
      req.params.id,
      req.body.bureau,
      req.body.division,
      req.body.unit
    );
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(
        "input_badgeNumber",
        sql.Int,
        req.body.badgeNumber ? req.body.badgeNumber : null
      )
      .input("input_userName", sql.Char, req.body.userName)
      .input("input_title", sql.Int, req.body.title ? req.body.title : null)
      .input(
        "input_hireDate",
        sql.DateTime2,
        req.body.hireDate ? req.body.hireDate : null
      )
      .input("input_status", sql.Char, req.body.status ? req.body.status : null)
      .input(
        "input_retireDate",
        sql.DateTime2,
        req.body.retireDate ? req.body.retireDate : null
      )
      .input(
        "input_swornOfficer",
        sql.Bit,
        req.body.swornOfficer && req.body.swornOfficer === "1" ? 1 : 0
      )
      .input(
        "input_isActive",
        sql.Bit,
        req.body.isActive && req.body.isActive === "1" ? 1 : 0
      )
      .input("input_bureau", sql.Char, req.body.bureau ? req.body.bureau : null)
      .input(
        "input_division",
        sql.Int,
        req.body.division ? req.body.division : null
      )
      .input("input_unit", sql.Int, req.body.unit ? req.body.unit : null)
      .input(
        "input_transferDate",
        sql.DateTime2,
        req.body.transferDate ? req.body.transferDate : null
      )
      .input(
        "input_PromotionDate",
        sql.DateTime2,
        req.body.PromotionDate ? req.body.PromotionDate : null
      )
      .input(
        "input_TransferNotes",
        sql.Char,
        req.body.TransferNotes ? req.body.TransferNotes : null
      )
      .input(
        "input_TerminateDate",
        sql.DateTime2,
        req.body.TerminateDate ? req.body.TerminateDate : null
      )
      .input(
        "input_TerminateNotes",
        sql.Char,
        req.body.TerminateNotes ? req.body.TerminateNotes : null
      )
      .input("input_updatedBy", sql.Char, req.body.updatedBy)
      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    // const resultOfEmployees = await pool.request()
    //   .query(`select  di.UserId,di.DepartmentId,EmployeeLeaves.* from [Department Inspector]  as di
    // inner join CCPD_employees on CCPD_employees.EmployeeId  = ${req.params.id}
    // inner join EmployeeLeaves on EmployeeLeaves.Username  = CCPD_employees.UserName
    // where di.DepartmentId = ${req.body.unit} and EmployeeLeaves.LeaveStatus = 'Requested'`);

    // resultOfEmployees.recordset.forEach(async (o, i) => {
    //   await pool
    //     .request()
    //     .query(
    //       `update EmployeeLeaves set Supervisor = ${o.UserId} where ID = ${o.ID}`
    //     );
    // });
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update record - Contact Info for the database.
exports.updateOneP3 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    HomeTelephone = @input_homeTelephone,
    CellPhone = @input_cellPhone,
    WorkEmail = @input_workEmail,
    OtherEmail = @input_otherEmail,
    HouseNumber = @input_houseNumber,
    ApartmentNumber = @input_apartmentNumber,
    StreetName = @input_streetName,
    City = @input_city,
    County = @input_county,
    State = @input_state,
    Zip = @input_zip,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(
        "input_homeTelephone",
        sql.Char,
        req.body.homeTelephone ? req.body.homeTelephone : null
      )
      .input(
        "input_cellPhone",
        sql.Char,
        req.body.cellPhone ? req.body.cellPhone : null
      )
      .input("input_workEmail", sql.Char, req.body.workEmail)
      .input(
        "input_otherEmail",
        sql.Char,
        req.body.otherEmail ? req.body.otherEmail : null
      )
      .input(
        "input_houseNumber",
        sql.Char,
        req.body.houseNumber ? req.body.houseNumber : null
      )
      .input(
        "input_apartmentNumber",
        sql.Char,
        req.body.apartmentNumber ? req.body.apartmentNumber : null
      )
      .input(
        "input_streetName",
        sql.Char,
        req.body.streetName ? req.body.streetName : null
      )
      .input("input_city", sql.Char, req.body.city ? req.body.city : null)
      .input("input_county", sql.Char, req.body.county ? req.body.county : null)
      .input("input_state", sql.Char, req.body.state ? req.body.state : null)
      .input("input_zip", sql.Char, req.body.zip)
      .input("input_updatedBy", sql.Char, req.body.updatedBy)

      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update record - Emergency Contact Info for the database.
exports.updateOneP4 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    EmgContactName1 = @input_emgContactName1,
    EmgRelationShip1 = @input_emgRelationShip1,
    EmgAddress1 = @input_emgAddress1,
    EmgPhone11 = @input_emgPhone11,
    EmgPhone12 = @input_emgPhone12,
    EmgContactName2 = @input_emgContactName2,
    EmgRelationShip2 = @input_emgRelationShip2,
    EmgAddress2 = @input_emgAddress2,
    EmgPhone21 = @input_emgPhone21,
    EmgPhone22 = @input_emgPhone22,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(
        "input_emgContactName1",
        sql.Char,
        req.body.emgContactName1 ? req.body.emgContactName1 : null
      )
      .input(
        "input_emgRelationShip1",
        sql.Char,
        req.body.emgRelationShip1 ? req.body.emgRelationShip1 : null
      )
      .input(
        "input_emgAddress1",
        sql.Char,
        req.body.emgAddress1 ? req.body.emgAddress1 : null
      )
      .input(
        "input_emgPhone11",
        sql.Char,
        req.body.emgPhone11 ? req.body.emgPhone11 : null
      )
      .input(
        "input_emgPhone12",
        sql.Char,
        req.body.emgPhone12 ? req.body.emgPhone12 : null
      )
      .input(
        "input_emgContactName2",
        sql.Char,
        req.body.emgContactName2 ? req.body.emgContactName2 : null
      )
      .input(
        "input_emgRelationShip2",
        sql.Char,
        req.body.emgRelationShip2 ? req.body.emgRelationShip2 : null
      )
      .input(
        "input_emgAddress2",
        sql.Char,
        req.body.emgAddress2 ? req.body.emgAddress2 : null
      )
      .input(
        "input_emgPhone21",
        sql.Char,
        req.body.emgPhone21 ? req.body.emgPhone21 : null
      )
      .input(
        "input_emgPhone22",
        sql.Char,
        req.body.emgPhone22 ? req.body.emgPhone22 : null
      )
      .input("input_updatedBy", sql.Char, req.body.updatedBy)

      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update record - Equipment Info/ Certification/Skills Info for the database.
exports.updateOneP5 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    HandgunSerialNumber= @input_handgunSerialNumber,
    LockerNumber= @input_lockerNumber,
    Bilingual= @input_bilingual,
    Language= @input_language,
    EducationCode= @input_educationCode,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(
        "input_handgunSerialNumber",
        sql.Char,
        req.body.handgunSerialNumber ? req.body.handgunSerialNumber : null
      )
      .input(
        "input_lockerNumber",
        sql.Char,
        req.body.lockerNumber ? req.body.lockerNumber : null
      )
      .input(
        "input_bilingual",
        sql.Char,
        req.body.bilingual ? req.body.bilingual : null
      )
      .input(
        "input_language",
        sql.Char,
        req.body.language ? req.body.language : null
      )
      .input(
        "input_educationCode",
        sql.Char,
        req.body.educationCode ? req.body.educationCode : null
      )
      .input("input_updatedBy", sql.Char, req.body.updatedBy)

      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update record - Insurance Info for the database.
exports.updateOneP6 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_Employees SET
    HealthInsuranceD1Ssn= @input_healthInsuranceD1Ssn,
    HealthInsuranceD1Name= @input_healthInsuranceD1Name,
    HealthInsuranceD1DOB= @input_healthInsuranceD1DOB,
    HealthInsuranceD2Ssn= @input_healthInsuranceD2Ssn,
    HealthInsuranceD2Name= @input_healthInsuranceD2Name,
    HealthInsuranceD2DOB= @input_healthInsuranceD2DOB,
    HealthInsuranceD3Ssn= @input_healthInsuranceD3Ssn,
    HealthInsuranceD3Name= @input_healthInsuranceD3Name,
    HealthInsuranceD3DOB= @input_healthInsuranceD3DOB,
    HealthInsuranceD4Ssn= @input_healthInsuranceD4Ssn,
    HealthInsuranceD4Name= @input_healthInsuranceD4Name,
    HealthInsuranceD4DOB= @input_healthInsuranceD4DOB,
    HealthInsuranceD5Ssn= @input_healthInsuranceD5Ssn,
    HealthInsuranceD5Name= @input_healthInsuranceD5Name,
    HealthInsuranceD5DOB= @input_healthInsuranceD5DOB,
    HealthInsuranceD6Ssn= @input_healthInsuranceD6Ssn,
    HealthInsuranceD6Name= @input_healthInsuranceD6Name,
    HealthInsuranceD6DOB= @input_healthInsuranceD6DOB,
    HealthInsuranceD7Ssn= @input_healthInsuranceD7Ssn,
    HealthInsuranceD7Name= @input_healthInsuranceD7Name,
    HealthInsuranceD7DOB= @input_healthInsuranceD7DOB,
    HealthInsuranceD8Ssn= @input_healthInsuranceD8Ssn,
    HealthInsuranceD8Name= @input_healthInsuranceD8Name,
    HealthInsuranceD8DOB= @input_healthInsuranceD8DOB,
    HealthInsuranceD9Ssn= @input_healthInsuranceD9Ssn,
    HealthInsuranceD9Name= @input_healthInsuranceD9Name,
    HealthInsuranceD9DOB= @input_healthInsuranceD9DOB,
    UpdatedBy = @input_updatedBy,
    UpdateDate = GETDATE()
    WHERE EmployeeId = @input_employeeId`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(
        "input_healthInsuranceD1Ssn",
        sql.Char,
        req.body.healthInsuranceD1Ssn ? req.body.healthInsuranceD1Ssn : null
      )
      .input(
        "input_healthInsuranceD1Name",
        sql.Char,
        req.body.healthInsuranceD1Name ? req.body.healthInsuranceD1Name : null
      )
      .input(
        "input_healthInsuranceD1DOB",
        sql.DateTime2,
        req.body.healthInsuranceD1DOB ? req.body.healthInsuranceD1DOB : null
      )
      .input(
        "input_healthInsuranceD2Ssn",
        sql.Char,
        req.body.healthInsuranceD2Ssn ? req.body.healthInsuranceD2Ssn : null
      )
      .input(
        "input_healthInsuranceD2Name",
        sql.Char,
        req.body.healthInsuranceD2Name ? req.body.healthInsuranceD2Name : null
      )
      .input(
        "input_healthInsuranceD2DOB",
        sql.DateTime2,
        req.body.healthInsuranceD2DOB ? req.body.healthInsuranceD2DOB : null
      )
      .input(
        "input_healthInsuranceD3Ssn",
        sql.Char,
        req.body.healthInsuranceD3Ssn ? req.body.healthInsuranceD3Ssn : null
      )
      .input(
        "input_healthInsuranceD3Name",
        sql.Char,
        req.body.healthInsuranceD3Name ? req.body.healthInsuranceD3Name : null
      )
      .input(
        "input_healthInsuranceD3DOB",
        sql.DateTime2,
        req.body.healthInsuranceD3DOB ? req.body.healthInsuranceD3DOB : null
      )
      .input(
        "input_healthInsuranceD4Ssn",
        sql.Char,
        req.body.healthInsuranceD4Ssn ? req.body.healthInsuranceD4Ssn : null
      )
      .input(
        "input_healthInsuranceD4Name",
        sql.Char,
        req.body.healthInsuranceD4Name ? req.body.healthInsuranceD4Name : null
      )
      .input(
        "input_healthInsuranceD4DOB",
        sql.DateTime2,
        req.body.healthInsuranceD4DOB ? req.body.healthInsuranceD4DOB : null
      )
      .input(
        "input_healthInsuranceD5Ssn",
        sql.Char,
        req.body.healthInsuranceD5Ssn ? req.body.healthInsuranceD5Ssn : null
      )
      .input(
        "input_healthInsuranceD5Name",
        sql.Char,
        req.body.healthInsuranceD5Name ? req.body.healthInsuranceD5Name : null
      )
      .input(
        "input_healthInsuranceD5DOB",
        sql.DateTime2,
        req.body.healthInsuranceD5DOB ? req.body.healthInsuranceD5DOB : null
      )
      .input(
        "input_healthInsuranceD6Ssn",
        sql.Char,
        req.body.healthInsuranceD6Ssn ? req.body.healthInsuranceD6Ssn : null
      )
      .input(
        "input_healthInsuranceD6Name",
        sql.Char,
        req.body.healthInsuranceD6Name ? req.body.healthInsuranceD6Name : null
      )
      .input(
        "input_healthInsuranceD6DOB",
        sql.DateTime2,
        req.body.healthInsuranceD6DOB ? req.body.healthInsuranceD6DOB : null
      )
      .input(
        "input_healthInsuranceD7Ssn",
        sql.Char,
        req.body.healthInsuranceD7Ssn ? req.body.healthInsuranceD7Ssn : null
      )
      .input(
        "input_healthInsuranceD7Name",
        sql.Char,
        req.body.healthInsuranceD7Name ? req.body.healthInsuranceD7Name : null
      )
      .input(
        "input_healthInsuranceD7DOB",
        sql.DateTime2,
        req.body.healthInsuranceD7DOB ? req.body.healthInsuranceD7DOB : null
      )
      .input(
        "input_healthInsuranceD8Ssn",
        sql.Char,
        req.body.healthInsuranceD8Ssn ? req.body.healthInsuranceD8Ssn : null
      )
      .input(
        "input_healthInsuranceD8Name",
        sql.Char,
        req.body.healthInsuranceD8Name ? req.body.healthInsuranceD8Name : null
      )
      .input(
        "input_healthInsuranceD8DOB",
        sql.DateTime2,
        req.body.healthInsuranceD8DOB ? req.body.healthInsuranceD8DOB : null
      )
      .input(
        "input_healthInsuranceD9Ssn",
        sql.Char,
        req.body.healthInsuranceD9Ssn ? req.body.healthInsuranceD9Ssn : null
      )
      .input(
        "input_healthInsuranceD9Name",
        sql.Char,
        req.body.healthInsuranceD9Name ? req.body.healthInsuranceD9Name : null
      )
      .input(
        "input_healthInsuranceD9DOB",
        sql.DateTime2,
        req.body.healthInsuranceD9DOB ? req.body.healthInsuranceD9DOB : null
      )
      .input("input_updatedBy", sql.Char, req.body.updatedBy)

      .input("input_employeeId", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Upload the Photo1 to the database.
exports.updatePhoto1 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_EmployeesImages SET
    Image = @input_picture
    WHERE (EmployeeId = @input_parameter)
      IF @@ROWCOUNT=0
        INSERT INTO CCPD_EmployeesImages (EmployeeId, Image) VALUES (@input_parameter, @input_picture)`;

  try {
    const img = req.body.image.replace(/^data:image\/png;base64,/, "");
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.body.id)
      .input(
        "input_picture",
        sql.VarChar(sql.MAX),
        Buffer.from(img, "base64").toString("binary")
      )
      .query(accessQuery);

    return res.status(200).json({ status: "uploaded" });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Upload the Photo2 to the database.
exports.updatePhoto2 = async function (req, res) {
  var accessQuery = `UPDATE CCPD_EmployeesImages2 SET
    Image = @input_picture
    WHERE (EmployeeId = @input_parameter)
      IF @@ROWCOUNT=0
        INSERT INTO CCPD_EmployeesImages2 (EmployeeId, Image) VALUES (@input_parameter, @input_picture)`;

  try {
    const img = req.body.image.replace(/^data:image\/png;base64,/, "");
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.body.id)
      .input(
        "input_picture",
        sql.VarChar(sql.MAX),
        Buffer.from(img, "base64").toString("binary")
      )
      .query(accessQuery);

    return res.status(200).json({ status: "uploaded" });
  } catch (err) {
    res.status(500).send(err);
  }
};

//Get employees as label and value
exports.findEmployees = async function (req, res) {
  const accessQuery = `
    SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
    LEFT JOIN
        Title as tl
    ON
      tl.ID = Title2
    WHERE IsActive = 1 AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
    ORDER BY LastName ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findEmployeesByTitle = async function (req, res) {
  const { title } = req.params;
  let accessQuery = `
    SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
    LEFT JOIN
        Title as tl
    ON
      tl.ID = Title2 
    WHERE IsActive = 1 AND Status NOT IN('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED') 
    
  `;

  if (title != "null") {
    accessQuery += ` AND Title2=${title} ORDER BY LastName ASC`;
  } else {
    accessQuery += ` ORDER BY LastName ASC`;
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    console.log(result, title, accessQuery);
    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
//Get employees as label and value
exports.findEmployeesByBureauId = async function (req, res) {
  const { bureauId } = req.params.bureauId;
  const accessQuery = `
    SELECT FirstName + ' ' + LastName AS label, EmployeeId AS value, UserName FROM CCPD_Employees
    WHERE IsActive = 1 AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED') AND  Bureau = ${bureauId}
    ORDER BY FirstName ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Get employees as label and value
exports.findDivisions = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Title AS label, d.Id AS value
      FROM
        Department as d
      WHERE
        d.Level = 2 AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findDivisionsCommander = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Id AS Id,
        d.Title AS Division,
        d.ParentId,
        d.IsActive,
        di.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS d
      LEFT JOIN
        [Department Inspector] AS di
      ON
        d.Id = di.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        di.UserId = e.EmployeeId
      WHERE
        d.LEVEL = 2 AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findDivisionsCommanderById = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Id AS Id,
        d.Title AS Bureau,
        d.ParentId,
        d.IsActive,
        di.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS d
      LEFT JOIN
        [Department Inspector] AS di
      ON
        d.Id = di.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        di.UserId = e.EmployeeId
      WHERE
        d.LEVEL = 2 AND d.IsActive IN (${statusArr.join()}) AND d.Title <> '' AND d.Id = @input_id
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get Units as label and value
exports.findUnits = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Title AS label, d.Id AS value
      FROM
        Department as d
      WHERE
        d.Level = 3 AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.fetchUnitsByDivision = async function (req, res) {
  let param = "";
  if (req.params.id) {
    param += `AND ParentId = ${req.params.id}`;
  }
  try {
    const accessQuery = `
     SELECT
       d.Title AS label, d.Id AS value
     FROM
       Department as d
     WHERE
       d.Level = 3  AND d.Title <> '' AND IsActive=1 ${param}
     ORDER BY
       d.Title ASC
   `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.fetchEmployeesByUnit = async function (req, res) {
  const { unit, bureau, division } = req.params;

  var accessQuery =
    "select UserName as value, CONCAT(LastName, ', ', FirstName, ' ', MiddleInitial, ' , ',(SELECT Title FROM Title WHERE Title2 = Title.id) , ' [', BadgeNumber, ']') AS label from CCPD_Employees WHERE Status NOT IN ('TERMINATED','RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')";
  if (unit && unit !== "null") {
    accessQuery += ` AND Unit2 = ${unit}`;
  }
  if (bureau && bureau !== "null") {
    accessQuery += ` AND Bureau = ${bureau}`;
  }
  if (division && division !== "null") {
    accessQuery += ` AND Division2 = ${division}`;
  }

  accessQuery += ` ORDER BY LastName`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findUnitsWithSupervisor = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        u.Id AS Id,
        u.Title AS Unit,
        u.ParentId,
        pu.Title AS ParentTitle,
        u.IsActive,
        ui.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS u
      LEFT JOIN
        Department AS pu
      ON
        pu.Id = u.ParentId
      LEFT JOIN
        [Department Inspector] AS ui
      ON
        u.Id = ui.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        ui.UserId = e.EmployeeId
      WHERE
        u.LEVEL = 3 AND u.IsActive IN (${statusArr.join()}) AND u.Title <> ''
      ORDER BY
        u.Title ASC`;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findUnitsWithSupervisorById = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        u.Id AS Id,
        u.Title AS Unit,
        u.ParentId,
        pu.Title AS ParentTitle,
        u.IsActive,
        ui.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS u
      LEFT JOIN
        Department AS pu
      ON
        pu.Id = u.ParentId
      LEFT JOIN
        [Department Inspector] AS ui
      ON
        u.Id = ui.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        ui.UserId = e.EmployeeId
      WHERE
        u.LEVEL = 3 AND u.IsActive IN (${statusArr.join()}) AND u.Title <> '' AND u.Id = @input_id
      ORDER BY
        u.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findBureaus = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Title AS label, d.Id AS value
      FROM
        Department as d
      WHERE
        d.Level = 1 AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Id ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findBureausCommander = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        b.Id AS Id,
        b.Title AS Bureau,
        b.ParentId,
        b.IsActive,
        bi.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS b
      LEFT JOIN
        [Department Inspector] AS bi
      ON
        b.Id = bi.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        bi.UserId = e.EmployeeId
      WHERE
        b.LEVEL = 1 AND b.IsActive IN (${statusArr.join()}) AND b.Title <> ''
      ORDER BY
        b.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findBureausParentCommander = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        b.Id AS Id,
        b.Title AS Bureau,
        b.ParentId,
        b.IsActive,
        bi.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department AS b
      LEFT JOIN
        [Department Inspector] AS bi
      ON
        b.ParentId = bi.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        bi.UserId = e.EmployeeId
      WHERE
        b.LEVEL = 1 AND b.IsActive IN (${statusArr.join()}) AND b.Title <> ''
      ORDER BY
        b.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findBureausCommanderById = async function (req, res) {
  try {
    const statusArr = [1];
    if (req.params.includeInActive && req.params.includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
    SELECT
      b.Id AS Id,
      b.Title AS Bureau,
      b.ParentId,
      b.IsActive,
      bi.Id AS DepartmentInspectorId,
      e.EmployeeId AS EmployeeId,
      e.FirstName + ' ' + e.LastName AS EmployeeName
    FROM
      Department AS b
    LEFT JOIN
      [Department Inspector] AS bi
    ON
      b.Id = bi.DepartmentId
    LEFT JOIN
      CCPD_Employees AS e
    ON
      bi.UserId = e.EmployeeId
    WHERE
      b.LEVEL = 1 AND b.IsActive IN (${statusArr.join()}) AND b.Title <> '' AND b.Id = @input_id
    ORDER BY
      b.Title ASC
  `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findBureauByDivision = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const data = await fetchDepartmentByIdAndLevelRecursive(
      id,
      1,
      includeInActive
    );
    if (data && data.status && data.status === 1) {
      res.json(data);
    } else if (data && data.status && data.status === 500) {
      res
        .status(500)
        .send(data.message ? data.message : "Something went wrong!");
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// Find Divisions from selected bureau by providing bureau id in request parameter
exports.findDivisionsByBureau = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const result = await fetchAllDepartmentsByParentId(
      id,
      2,
      includeInActive,
      true,
      [],
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.fetchDivisions = async function (req, res) {
  const { id, includeInActive } = req.params;
  let parm = "";
  if (id != "null") {
    parm += `AND d.ParentId=${id}`;
  }
  const accessQuery = `
  SELECT
    d.Id,
    d.Title AS label, d.Id AS value
  FROM
    Department as d
  WHERE
     d.IsActive = 1 AND d.Level=2 AND d.Title <> '$' ${parm}
  ORDER BY
    d.Title ASC
`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findDivisionsCommanderByBureau = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const result = await fetchAllDepartmentsWithCommanderByParentId(
      id,
      2,
      includeInActive,
      true,
      [],
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findDivisionByUnit = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const data = await fetchDepartmentByIdAndLevelRecursive(
      id,
      2,
      includeInActive
    );
    if (data && data.status && data.status === 1) {
      res.json(data);
    } else if (data && data.status && data.status === 500) {
      res
        .status(500)
        .send(data.message ? data.message : "Something went wrong!");
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Find Units from selected division by providing division id in request parameter
exports.findUnitsByDivision = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const result = await fetchAllDepartmentsByParentId(
      id,
      3,
      includeInActive,
      true,
      [],
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.findUnitsWithSupervisorByDivision = async function (req, res) {
  const {
    params: { id, includeInActive },
  } = req;
  try {
    const result = await fetchAllDepartmentsWithCommanderByParentId(
      id,
      3,
      includeInActive,
      true,
      [],
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get all the branches
exports.findBranches = async function (req, res) {
  const accessQuery =
    "SELECT Branch AS label, ID AS value FROM Branch WHERE Branch != ''";

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get all the employees which are mapped with a specific bureau
exports.findEmployeesByBureau = async function (req, res) {
  const accessQuery = `
    SELECT
      DISTINCT e.EmployeeId AS value, e.FirstName + ' ' + e.LastName AS label
    FROM
      CCPD_Employees AS e
    INNER JOIN
      [Department Inspector] AS di
    ON
      e.EmployeeId = di.UserId
    WHERE
      di.DepartmentId = @input_id AND AND e.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
    ORDER BY
      label
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", req.params.id)
      .query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEmployeeCommanderByEmployeeId = async function (req, res) {
  const query = `
    SELECT
      d.Id AS BureauId,
      d.ParentId AS BureauParentId,
      di.UserId AS BureauSupervisorId
    FROM
      CCPD_Employees AS e
    LEFT JOIN
      Department AS d
    ON
      d.Id = e.Bureau AND d.Level = 1
    LEFT JOIN
      [Department Inspector] AS di
    ON
      di.DepartmentId = d.Id
    WHERE
      e.EmployeeId = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", req.params.id)
      .query(query);
    if (result.recordset && result.recordset[0]) {
      const { BureauSupervisorId, BureauParentId, BureauId } =
        result.recordset[0];
      let considerId = BureauId;
      if (parseInt(BureauSupervisorId) === parseInt(req.params.id)) {
        considerId = BureauParentId;
      }
      // else {
      //   considerId = await checkBureauChildrenSupervisors(
      //     BureauId,
      //     BureauParentId,
      //     req.params.id
      //   );
      // }
      const commander = await getSupervisorByDepartmentId(considerId);
      res.json(commander);
    } else {
      res.status(500).send("Something went wrong!");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEmployeeCommanderByEmployeeIdAndBureau = async function (req, res) {
  const query = `
    SELECT
      d.Id AS BureauId,
      d.ParentId AS BureauParentId,
      di.UserId AS BureauSupervisorId
    FROM
      Department AS d
    LEFT JOIN
      [Department Inspector] AS di
    ON
      di.DepartmentId = d.Id
    WHERE
      d.Id = @input_bureau_id AND d.Level = 1
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_bureau_id", req.params.bureauId)
      .query(query);
    if (result.recordset && result.recordset[0]) {
      const { BureauSupervisorId, BureauParentId, BureauId } =
        result.recordset[0];
      let considerId = BureauId;
      if (parseInt(BureauSupervisorId) === parseInt(req.params.id)) {
        considerId = BureauParentId;
      }
      // else {
      //   considerId = await checkBureauChildrenSupervisors(
      //     BureauId,
      //     BureauParentId,
      //     req.params.id
      //   );
      // }
      const commander = await getSupervisorByDepartmentId(considerId);
      res.json(commander);
    } else {
      res.status(500).send("Something went wrong!");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createBureau = async function (req, res) {
  const uniqueQuery = `SELECT COUNT(Id) AS cnt FROM Department AS b WHERE b.Level = 1 AND (b.Title = @input_title OR b.Title = @input_title_$)`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.Title)
      .input("input_title_$", sql.Char, `${req.body.Title}$`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (row && row.cnt <= 0) {
      const bureauResponse = await insertRecordForDepartment({
        ...req.body,
        Level: 1,
      });
      if (bureauResponse && bureauResponse.newDepartmentId) {
        const divisionResponse = await insertRecordForDepartment({
          ...req.body,
          Level: 2,
          ParentId: bureauResponse.newDepartmentId,
          Title: `${req.body.Title}$`,
        });
        if (divisionResponse && divisionResponse.newDepartmentId) {
          const unitResponse = await insertRecordForDepartment({
            ...req.body,
            Level: 3,
            ParentId: divisionResponse.newDepartmentId,
            Title: `${req.body.Title}$`,
          });
          if (unitResponse && unitResponse.newDepartmentId) {
            res.json({
              status: 1,
              message: "Inserted successfully",
            });
          } else {
            res.json({
              status: 0,
              message: "Something went wrong! Please try again later.",
            });
          }
        } else {
          res.json({
            status: 0,
            message: "Something went wrong! Please try again later.",
          });
        }
      } else {
        res.json({
          status: 0,
          message: "Something went wrong! Please try again later.",
        });
      }
    } else {
      res.json({
        status: 0,
        message: "Bureau already exists!",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateBureauById = async function (req, res) {
  const uniqueQuery = `SELECT Id FROM Department AS b WHERE b.Level = 1 AND (b.Title = @input_title OR b.Title = @input_title_$)`;
  const accessQuery = `
    UPDATE
      Department
    SET
      Title = @input_title,
      ParentId = @input_parent_id,
      IsActive = @input_is_active,
      UpdatedBy = @input_updated_by,
      UpdatedAt = GETDATE()
    WHERE
      Id = @input_id
  `;
  const accessQuery1 = `
    UPDATE
      [Department Inspector]
    SET
      UserId = @input_user_id
    WHERE
      Id = @input_id
  `;
  const accessQuery2 = `
    INSERT INTO [Department Inspector]
      (UserId, DepartmentId)
    VALUES
      (@input_user_id, @input_department_id)
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.Title)
      .input("input_title_$", sql.Char, `${req.body.Title}$`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (!row || (row && row.Id === parseInt(req.params.id))) {
      await pool
        .request()
        .input("input_title", sql.Char, req.body.Title)
        .input("input_parent_id", sql.Int, req.body.ParentId)
        .input("input_is_active", sql.Bit, req.body.IsActive)
        .input("input_updated_by", sql.Char, req.body.Username)
        .input("input_id", sql.Int, req.params.id)
        .query(accessQuery);
      if (req.body.DepartmentInspectorId) {
        await pool
          .request()
          .input("input_user_id", sql.Int, req.body.UserId)
          .input("input_id", sql.Int, req.body.DepartmentInspectorId)
          .query(accessQuery1);
      } else {
        await pool
          .request()
          .input("input_user_id", sql.Int, req.body.UserId)
          .input("input_department_id", sql.Int, req.params.id)
          .query(accessQuery2);
      }
      res.json({
        status: 1,
        message: "Updated successfully",
      });
    } else {
      res.json({
        status: 0,
        message: "Bureau already exists!",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createDivision = async function (req, res) {
  const uniqueQuery = `SELECT COUNT(ID) AS cnt FROM Department AS d WHERE d.Level = 2 AND (d.Title = @input_title OR d.Title = @input_title_$)`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.Title)
      .input("input_title_$", sql.Char, `${req.body.Title}`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (row && row.cnt <= 0) {
      const divisionResponse = await insertRecordForDepartment({
        ...req.body,
        Level: 2,
      });
      if (divisionResponse && divisionResponse.newDepartmentId) {
        const unitResponse = await insertRecordForDepartment({
          ...req.body,
          Level: 3,
          ParentId: divisionResponse.newDepartmentId,
          Title: `${req.body.Title}$`,
        });
        if (unitResponse && unitResponse.newDepartmentId) {
          res.json({
            status: 1,
            message: "Inserted successfully",
          });
        } else {
          res.json({
            status: 0,
            message: "Something went wrong! Please try again later.",
          });
        }
      } else {
        res.json({
          status: 0,
          message: "Something went wrong! Please try again later.",
        });
      }
    } else {
      res.json({
        status: 0,
        message: "Division already exists!",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateDivisionById = async function (req, res) {
  const uniqueQuery = `SELECT Id FROM Department AS d WHERE d.Level = 2 AND (d.Title = @input_title OR d.Title = @input_title_$)`;
  const accessQuery = `
    UPDATE
      Department
    SET
      Title = @input_title,
      ParentId = @input_parent_id,
      IsActive = @input_is_active,
      UpdatedBy = @input_updated_by,
      UpdatedAt = GETDATE()
    WHERE
      Id = @input_id
  `;
  const accessQuery1 = `
    UPDATE
      [Department Inspector]
    SET
      UserId = @input_user_id
    WHERE
      Id = @input_id
  `;
  const accessQuery2 = `
    INSERT INTO [Department Inspector]
      (UserId, DepartmentId)
    VALUES
      (@input_user_id, @input_department_id)
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.Title)
      .input("input_title_$", sql.Char, `${req.body.Title}$`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (!row || (row && row.Id === parseInt(req.params.id))) {
      await pool
        .request()
        .input("input_title", sql.Char, req.body.Title)
        .input("input_parent_id", sql.Int, req.body.ParentId)
        .input("input_is_active", sql.Bit, req.body.IsActive)
        .input("input_updated_by", sql.Char, req.body.Username)
        .input("input_id", sql.Int, req.params.id)
        .query(accessQuery);
      if (req.body.DepartmentInspectorId) {
        await pool
          .request()
          .input("input_user_id", sql.Int, req.body.UserId)
          .input("input_id", sql.Int, req.body.DepartmentInspectorId)
          .query(accessQuery1);
      } else {
        await pool
          .request()
          .input("input_user_id", sql.Int, req.body.UserId)
          .input("input_department_id", sql.Int, req.params.id)
          .query(accessQuery2);
      }
      res.json({
        status: 1,
        message: "Updated successfully",
      });
    } else {
      res.json({
        status: 0,
        message: "Division already exists!",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createUnit = async function (req, res) {
  try {
    const unitResponse = await insertRecordForDepartment({
      ...req.body,
      Level: 3,
    });
    if (unitResponse && unitResponse.newDepartmentId) {
      res.json({
        status: 1,
        message: "Inserted successfully",
      });
    } else {
      res.json({
        status: 0,
        message: "Something went wrong! Please try again later.",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUnitById = async function (req, res) {
  const accessQuery = `
    UPDATE
      Department
    SET
      Title = @input_title,
      ParentId = @input_parent_id,
      IsActive = @input_is_active,
      UpdatedBy = @input_updated_by,
      UpdatedAt = GETDATE()
    WHERE
      Id = @input_id
  `;
  const accessQuery1 = `
    UPDATE
      [Department Inspector]
    SET
      UserId = @input_user_id
    WHERE
      Id = @input_id
  `;
  const accessQuery2 = `
    INSERT INTO [Department Inspector]
      (UserId, DepartmentId)
    VALUES
      (@input_user_id, @input_department_id)
  `;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_title", sql.Char, req.body.Title)
      .input("input_parent_id", sql.Int, req.body.ParentId)
      .input("input_is_active", sql.Bit, req.body.IsActive)
      .input("input_updated_by", sql.Char, req.body.Username)
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);
    if (req.body.DepartmentInspectorId) {
      await pool
        .request()
        .input("input_user_id", sql.Int, req.body.UserId)
        .input("input_id", sql.Int, req.body.DepartmentInspectorId)
        .query(accessQuery1);

      const resultOfEmployees = await pool.request()
        .query(` select EmployeeLeaves.* from [Department Inspector]  as di
  inner join CCPD_employees on CCPD_employees.Unit2  = DepartmentId 
  inner join EmployeeLeaves on EmployeeLeaves.Username  = CCPD_employees.UserName 
  where di.Id = ${req.body.DepartmentInspectorId} and EmployeeLeaves.LeaveStatus = 'Requested'`);

      resultOfEmployees.recordset.forEach(async (o, i) => {
        await pool
          .request()
          .query(
            `update EmployeeLeaves set Supervisor = ${req.body.UserId} where ID = ${o.ID}`
          );
      });
    } else {
      await pool
        .request()
        .input("input_user_id", sql.Int, req.body.UserId)
        .input("input_department_id", sql.Int, req.params.id)
        .query(accessQuery2);

      const resultOfEmployees = await pool.request()
        .query(` select EmployeeLeaves.* from [Department Inspector]  as di
  inner join CCPD_employees on CCPD_employees.Unit2  = DepartmentId 
  inner join EmployeeLeaves on EmployeeLeaves.Username  = CCPD_employees.UserName 
  where di.DepartmentId = ${req.params.id} and EmployeeLeaves.LeaveStatus = 'Requested'`);

      resultOfEmployees.recordset.forEach(async (o, i) => {
        await pool
          .request()
          .query(
            `update EmployeeLeaves set Supervisor = ${req.body.UserId} where ID = ${o.ID}`
          );
      });
    }

    res.json({
      status: 1,
      message: "Updated successfully",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.organizationalLayoutExport = async (req, res) => {
  const accessQuery = `
    SELECT
      REPLACE(d.Title, '$', '') AS Department,
      CASE
			  WHEN d.Level = 1 THEN 'Bureau'
			  WHEN d.Level = 2 THEN 'Division'
			  WHEN d.Level = 3 THEN 'Unit'
		  END AS Level,
      e.FirstName + ' ' + e.LastName AS [Commander Name],
      REPLACE(dp.Title, '$', '') AS [Parent Department],
      CASE
			  WHEN dp.Level = 1 THEN 'Bureau'
			  WHEN dp.Level = 2 THEN 'Division'
			  WHEN dp.Level = 3 THEN 'Unit'
		  END AS [Parent Level],
      CASE
			  WHEN d.IsActive = 1 THEN 'Active'
			  WHEN d.IsActive = 0 THEN 'Inactive'
		  END AS Status
    FROM
      Department AS d
    LEFT JOIN
      Department AS dp
    ON
      dp.Id = d.ParentId
    LEFT JOIN
      [Department Inspector] AS di
    ON
      di.DepartmentId = d.Id
    LEFT JOIN
      CCPD_Employees AS e
    ON
      e.EmployeeId = di.UserId
    ORDER BY
      d.Level ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    const { type } = req.params;
    const filename = `Organization layout ${new Date().toDateString()}`;
    if (type === "csv") {
      const parser = new Parser();
      const csv = parser.parse(result.recordset);
      res.setHeader("Content-type", "text/csv");
      res.setHeader(
        "Content-disposition",
        `attachment; filename=${filename}.csv`
      );
      // res.attachment(`${filename}.csv`);
      res.send(csv);
    } else if (type === "xlsx") {
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("Layout");
      const record = result.recordset[0];
      const keys = Object.keys(record);
      const columns = keys.map((o) => ({ header: o, key: o, width: 20 }));
      worksheet.columns = [...columns];
      worksheet.addRows(result.recordset);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${filename}.xlsx`
      );
      workbook.xlsx.write(res).then(function () {
        res.end();
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEmployeeForDropdown = async function (req, res) {
  const accessQuery = `
    SELECT EmployeeId AS value, CONCAT(LastName, ', ', FirstName, ' ', MiddleInitial, ' , ', (SELECT Title FROM Title WHERE Title2 = Title.id), ' [', BadgeNumber, ']') AS label FROM CCPD_Employees ORDER BY LastName ASC
    `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEmployeeForFleet = async function (req, res) {
  const accessQuery = `
  SELECT EmployeeId AS value, CONCAT(LastName, ', ', FirstName, ' ', MiddleInitial, ' , ',
  (SELECT Title FROM Title WHERE Title2 = Title.id), ' [', BadgeNumber, ']') AS label FROM CCPD_Employees where isactive=1 and title2 not in (select id from title where group_as in ('OZITUS', 'HOLTEC'))
    `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.uniqueBureau = async function (req, res) {
  const uniqueQuery = `SELECT Id FROM Department AS b WHERE b.Level = 1 AND (b.Title = @input_title OR b.Title = @input_title_$)`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.bureau_title)
      .input("input_title_$", sql.Char, `${req.body.bureau_title}$`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (!row || (row && row.Id === parseInt(req.body.id))) {
      res.json({
        status: 1,
        message: "",
      });
    } else {
      res.json({
        status: 0,
        message: "Bureau already exists!",
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.uniqueDivision = async function (req, res) {
  const uniqueQuery = `SELECT Id FROM Department AS d WHERE d.Level = 2 AND (d.Title = @input_title OR d.Title = @input_title_$)`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, req.body.division_title)
      .input("input_title_$", sql.Char, `${req.body.division_title}$`)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = result;
    if (!row || (row && row.Id === parseInt(req.body.id))) {
      res.json({
        status: 1,
        message: "",
      });
    } else {
      res.json({
        status: 0,
        message: "Division already exists!",
      });
    }
    res.json({ ...result.recordset[0], Supervisors });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.filterDepartmentsByType = async function (req, res) {
  const { page, table, primaryKey } = req.body;
  const pId = primaryKey ? primaryKey : null;
  const payload = { ...req.body };
  const query = basicSelectFilterQueryBuilder(table, payload, false, pId);
  const queryCnt = basicSelectFilterQueryBuilder(table, payload, true, pId);
  try {
    const pool = await poolPromise;
    const resultCnt = await pool.request().query(queryCnt);
    const [{ totalCount }] = resultCnt.recordset;
    const result = await pool.request().query(query);
    const response = {
      data: result.recordset,
      page,
      totalCount,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteDepartmentInspectors = async function (req, res) {
  const { ids } = req.body;
  if (ids && ids.length) {
    const query = `
      DELETE FROM [Department Inspector] WHERE Id IN (${ids.join()});
    `;
    try {
      const pool = await poolPromise;
      await pool
        .request()
        .input("input_id", sql.Char, req.params.id)
        .query(query);
      res.json({
        status: 1,
        message: "Deleted successfully",
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(500).send(err.message);
  }
};

exports.getDepartmentById = async function (req, res) {
  const query = `
      SELECT
        d.*
      FROM
        Department AS d
      WHERE
        Id = @input_id
    `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Char, req.params.id)
      .query(query);
    if (result && result.recordset && result.recordset[0]) {
      res.json({
        status: 1,
        message: "Department fetched successfully!",
        data: result.recordset[0],
      });
    } else {
      res.json({
        status: 0,
        message: "Department not found!",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const insertRecordForDepartment = async (payload) => {
  const query1 = `
    INSERT INTO Department
      (Title, ParentId, Level, IsActive, CreatedBy, CreatedAt, UpdatedBy, UpdatedAt)
    VALUES
      (@input_title, @input_parent_id, @input_level, @input_is_active, @input_created_by, GETDATE(), @input_updated_by, GETDATE());

    SELECT
      @@IDENTITY AS 'identity'
  `;
  const query2 = `
    INSERT INTO [Department Inspector]
      (UserId, DepartmentId)
    VALUES
      (@input_user_id, @input_department_id)
  `;
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("input_title", sql.Char, payload.Title)
    .input("input_parent_id", sql.Int, payload.ParentId)
    .input("input_level", sql.Int, payload.Level)
    .input("input_is_active", sql.Bit, payload.IsActive)
    .input("input_created_by", sql.Char, payload.Username)
    .input("input_updated_by", sql.Char, payload.Username)
    .query(query1);
  const insertedId =
    result &&
    result.recordset &&
    result.recordset[0] &&
    result.recordset[0].identity
      ? result.recordset[0].identity
      : null;
  if (insertedId) {
    await pool
      .request()
      .input("input_user_id", sql.Int, payload.UserId)
      .input("input_department_id", sql.Int, insertedId)
      .query(query2);
    return { newDepartmentId: insertedId };
  } else {
    return null;
  }
};

const fetchDepartmentByIdAndLevelRecursive = async (
  id,
  level,
  includeInActive
) => {
  try {
    const statusArr = [1];
    if (includeInActive && includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT TOP(1)
        d.Id AS Id,
        d.Title AS Title,
        d.ParentId,
        d.IsActive,
        di.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName,
        d.Level
      FROM
        Department as d
      LEFT JOIN
        [Department Inspector] AS di
      ON
        d.ParentId = di.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        di.UserId = e.EmployeeId
      WHERE
        d.Id = @input_id AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", id)
      .query(accessQuery);
    if (result && result.recordset && result.recordset[0]) {
      if (result.recordset[0].Level === level) {
        return {
          status: 1,
          data: result.recordset[0],
          message: "Success",
        };
      } else {
        const { ParentId } = result.recordset[0];
        if (ParentId !== 0) {
          return await fetchDepartmentByIdAndLevelRecursive(
            ParentId,
            level,
            includeInActive
          );
        } else {
          return {
            status: 0,
            data: null,
            message: "No record found!",
          };
        }
      }
    } else {
      return {
        status: 0,
        data: null,
        message: "No record found!",
      };
    }
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

const fetchAllDepartmentsByParentId = async (
  parentId,
  level,
  includeInActive,
  isInitialCall = true,
  data = [],
  outputData = []
) => {
  try {
    const statusArr = [1];
    const parentIdArr = [];
    if (parentId && parentId >= 0 && isInitialCall) {
      parentIdArr.push(parentId);
    } else {
      const ids = data.map((o) => o.Id);
      parentIdArr.push(...ids);
    }
    if (includeInActive && includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.Id,
        d.Title AS label, d.Id AS value
      FROM
        Department as d
      WHERE
        d.ParentId IN (${parentIdArr.join()}) AND d.Level = @input_level AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_level", level)
      .query(accessQuery);
    if (result && result.recordset && result.recordset.length) {
      outputData.push(...result.recordset);
      return await fetchAllDepartmentsByParentId(
        -1,
        level,
        includeInActive,
        false,
        [...result.recordset],
        outputData
      );
    } else {
      return outputData;
    }
  } catch (err) {
    return [];
  }
};

const fetchAllDepartmentsWithCommanderByParentId = async (
  parentId,
  level,
  includeInActive,
  isInitialCall = true,
  data = [],
  outputData = []
) => {
  try {
    const statusArr = [1];
    const parentIdArr = [];
    if (parentId && parentId >= 0 && isInitialCall) {
      parentIdArr.push(parentId);
    } else {
      const ids = data.map((o) => o.Id);
      parentIdArr.push(...ids);
    }
    if (includeInActive && includeInActive === "true") {
      statusArr.push(0);
    }
    const accessQuery = `
      SELECT
        d.ID AS Id,
        d.Title AS Division,
        d.ParentId,
        d.IsActive,
        di.Id AS DepartmentInspectorId,
        e.EmployeeId AS EmployeeId,
        e.FirstName + ' ' + e.LastName AS EmployeeName
      FROM
        Department as d
      LEFT JOIN
        [Department Inspector] AS di
      ON
        d.Id = di.DepartmentId
      LEFT JOIN
        CCPD_Employees AS e
      ON
        e.EmployeeId = di.UserId
      WHERE
        d.ParentId IN (${parentIdArr.join()}) AND d.Level = @input_level AND d.IsActive IN (${statusArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_level", level)
      .query(accessQuery);
    if (result && result.recordset && result.recordset.length) {
      outputData.push(...result.recordset);
      return await fetchAllDepartmentsWithCommanderByParentId(
        -1,
        level,
        includeInActive,
        false,
        [...result.recordset],
        outputData
      );
    } else {
      return outputData;
    }
  } catch (err) {
    return [];
  }
};

const getDepartmentIdByEmployeeId = async (employeeId) => {
  const employeeDetailsQuery = `
    SELECT
      e.CellPhone as CellPhone,
      e.Bureau AS bureauId, e.Division2 AS divisionId, e.Unit2 AS unitId,
      db.Title AS bureau, dd.Title AS division, du.Title AS unit, ei.ImageName
    FROM
      CCPD_Employees AS e
    LEFT JOIN
      Department AS db
    ON
      db.Id = e.Bureau
    LEFT JOIN
      Department AS dd
    ON
      dd.Id = e.Division2
   LEFT JOIN
   CCPD_EmployeesImages as ei
    ON
      ei.EmployeeId = e.EmployeeId 
    LEFT JOIN
      Department AS du
    ON
      du.Id = e.Unit2
    WHERE
      e.EmployeeId = @input_id
  `;

  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("input_id", sql.Int, employeeId)
    .query(employeeDetailsQuery);
  if (result && result.recordset[0]) {
    return result.recordset[0];
  }
  return null;
};
const getSupervisorByDepartmentId = async (id) => {
  const query = `
        SELECT
          die.EmployeeId AS EmployeeId,
          CONCAT(die.[LastName], ', ', die.[FirstName], ' ', die.[MiddleInitial], ' , ', ti.[Title], ' [', die.[BadgeNumber], ']') AS Name,
          d.Title,
          d.Level,
          di.UserId,
          d.ParentId,
          die.UserName,
          ei.ImageName
        FROM
          Department AS d
        LEFT JOIN
          [Department Inspector] AS di
        ON
          di.DepartmentId = d.Id
        LEFT JOIN
          CCPD_Employees AS die
        ON
          die.EmployeeId = di.UserId
          LEFT JOIN
          CCPD_EmployeesImages AS ei
        ON
          ei.EmployeeId = die.EmployeeId  
        LEFT JOIN
          Title AS ti
        ON
          ti.Id = die.Title2      
        WHERE
          d.Id = @input_id
      `;

  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("input_id", sql.Int, id)
    .query(query);
  if (result && result.recordset[0]) {
    const { Level } = result.recordset[0];
    const levelNameObj = { 1: "Bureau", 2: "Division", 3: "Unit" };
    const LevelName = Level && levelNameObj[Level] ? levelNameObj[Level] : "";
    return {
      ...result.recordset[0],
      LevelName,
    };
  }
  return null;
};

const getAllDepartmentIdsFromParentIdRecursive = async (
  data = [],
  outputData = []
) => {
  try {
    const parentIdArr = data.map((o) => o.Id);
    const accessQuery = `
      SELECT
        d.Id AS Id,
        d.Level AS Level
      FROM
        Department as d
      WHERE
        d.ParentId IN (${parentIdArr.join()}) AND d.Title <> ''
      ORDER BY
        d.Title ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    if (result && result.recordset && result.recordset.length) {
      outputData.push(...result.recordset);
      return await getAllDepartmentIdsFromParentIdRecursive(
        [...result.recordset],
        outputData
      );
    } else {
      return outputData;
    }
  } catch (err) {
    return [];
  }
};

const checkBureauChildrenSupervisors = async (
  bureauId,
  parentBureauId,
  userId
) => {
  const query = `
    SELECT
      COUNT(d.Id) as count
    FROM
      Department AS d
    LEFT JOIN
      [Department inspector] AS di
    ON
      di.DepartmentId = d.Id
    WHERE
      d.ParentId = @input_id AND di.UserId = @input_user_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, bureauId)
      .input("input_user_id", sql.Int, userId)
      .query(query);
    if (
      result.recordset &&
      result.recordset[0] &&
      result.recordset[0].count > 0
    ) {
      return parentBureauId;
    }
    return bureauId;
  } catch (err) {
    return bureauId;
  }
};

const getUserIdsByDepartmentForSubordinates = async (departmentId, level) => {
  const defaultDeptQuery = `
    SELECT
      d.Id
    FROM
      Department d
    WHERE
      d.Title LIKE '%$' AND d.Level = @input_level
  `;
  const whereAnd = [];
  try {
    const pool = await poolPromise;
    switch (level) {
      case 1: {
        const defaultDivisionResult = await pool
          .request()
          .input("input_level", sql.Int, 2)
          .query(defaultDeptQuery);
        const defaultUnitResult = await pool
          .request()
          .input("input_level", sql.Int, 3)
          .query(defaultDeptQuery);
        const defaultDivisions = defaultDivisionResult.recordset
          ? defaultDivisionResult.recordset.map((o) => o.Id).join()
          : "";
        const defaultUnits = defaultUnitResult.recordset
          ? defaultUnitResult.recordset.map((o) => o.Id).join()
          : "";
        whereAnd.push(`e.Bureau = ${departmentId}`);
        if (defaultDivisions) {
          whereAnd.push(`e.Division2 IN (${defaultDivisions})`);
        }
        if (defaultUnits) {
          whereAnd.push(`e.Unit2 IN (${defaultUnits})`);
        }
        break;
      }
      case 2: {
        const defaultUnitResult = await pool
          .request()
          .input("input_level", sql.Int, 3)
          .query(defaultDeptQuery);
        const defaultUnits = defaultUnitResult.recordset
          ? defaultUnitResult.recordset.map((o) => o.Id).join()
          : "";
        whereAnd.push(`e.Division2 = ${departmentId}`);
        if (defaultUnits) {
          whereAnd.push(`e.Unit2 IN (${defaultUnits})`);
        }
        break;
      }
      case 3: {
        whereAnd.push(`e.Unit2 = ${departmentId}`);
        break;
      }
    }
    const whereAndStr = whereAnd.join(" AND ");
    if (whereAndStr) {
      const employeeIdsQry = `
        SELECT
          e.EmployeeId
        FROM
          CCPD_Employees AS e
        WHERE
          e.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
          AND ${whereAndStr}
      `;

      const employeeIdsResult = await pool.request().query(employeeIdsQry);
      if (employeeIdsResult.recordset) {
        return employeeIdsResult.recordset.map((o) => o.EmployeeId);
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (err) {
    return [];
  }
};
