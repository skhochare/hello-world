const { sql, poolPromise } = require("../../config/mssql_hr.config.js");

const getIdsByParentId = async (parentId, level) => {
  try {
    const query = `SELECT ParentId,
        Ids = STUFF((SELECT ', ' + CAST(Id AS VARCHAR(10)) [text()]
        FROM Department b
        WHERE b.ParentId = Department.ParentId AND b.IsActive = 1 AND b.Level = ${level}
        FOR XML PATH(''), TYPE).value('.','NVARCHAR(MAX)'), 1, 2, '')
    FROM Department WHERE IsActive = 1 AND Level = ${level} AND ParentId = ${parentId} GROUP BY ParentId`;

    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset && result.recordset[0]) {
      return {
        ...result.recordset[0],
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

// exports.divisionsByBureau = async (req, res) => {
//   const { bureauId } = req.params;
//   try {
//     const query = `
//       SELECT
//         d.Id,
//         d.Title AS label, d.Id AS value
//       FROM
//         Department as d
//       WHERE
//         d.ParentId IN ('${bureauId}') AND d.Level = 2 AND d.IsActive = 1
//       ORDER BY
//         d.Title ASC
//     `;
//     const pool = await poolPromise;
//     const result = await pool.request().query(query);
//     res.json(result.recordset);
//   } catch (err) {
//     return {
//       status: 500,
//       data: null,
//       message: err.message,
//     };
//   }
// };

exports.unitsByBureau = async (req, res) => {
  const { bureauId } = req.params;
  try {
    const { Ids } = await getIdsByParentId(bureauId, 2);
    const query1 = `
      SELECT
        d.Id,
        d.Title AS label, d.Id AS value
      FROM
        Department as d
      WHERE
        d.ParentId IN (${Ids}) AND d.Level = 3 AND d.IsActive = 1
      ORDER BY
        d.Title ASC
    `;

    const pool = await poolPromise;
    const result = await pool.request().query(query1);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.employeesByDepartment = async function (req, res) {
  const { bureauId, divisionId, unitId } = req.body;
  let whereArr = [];
  let query = `
      SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
        LEFT JOIN
            Title as tl
        ON
          tl.ID = Title2
        WHERE IsActive = 1 AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED') `;

  if (bureauId) {
    whereArr.push({
      column: "Bureau",
      value: bureauId,
    });
  }

  if (divisionId) {
    whereArr.push({
      column: "Division2",
      value: divisionId,
    });
  }

  if (unitId) {
    whereArr.push({ column: "Unit2", value: unitId });
  }

  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  query += ` ORDER BY LastName`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.employeesByBureau = async (req, res) => {
  const { bureauId } = req.params;
  try {
    const query1 = `
    SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
      LEFT JOIN
          Title as tl
      ON
        tl.ID = Title2
      WHERE IsActive = 1 AND Bureau = ${bureauId} AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
      ORDER BY LastName ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(query1);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.employeesByDivision = async (req, res) => {
  const { divisionId } = req.params;
  try {
    const query1 = `
    SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
      LEFT JOIN
          Title as tl
      ON
        tl.ID = Title2
      WHERE IsActive = 1 AND Division2 = ${divisionId} AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
      ORDER BY LastName ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(query1);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};

exports.employeesByUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const query1 = `
    SELECT CONCAT(LastName, ', ', FirstName, ', ', tl.Title, ' [', BadgeNumber, ']') AS label, EmployeeId AS value, UserName FROM CCPD_Employees
      LEFT JOIN
          Title as tl
      ON
        tl.ID = Title2
      WHERE IsActive = 1 AND Unit2 = ${unitId} AND Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')
      ORDER BY LastName ASC
    `;
    const pool = await poolPromise;
    const result = await pool.request().query(query1);
    res.json(result.recordset);
  } catch (err) {
    return {
      status: 500,
      data: null,
      message: err.message,
    };
  }
};
