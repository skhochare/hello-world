const {
  connectLDAP,
  searchLDAP,
  disconnectLDAP,
} = require("../../config/ldap_connection");
const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const { decrypt } = require("../../config/crypto");

const tableName = "EmployeeLeaves";
const employeeLeaveReasonsTable = "EmployeeLeaveReasons";
const leaveReasonsTableName = "LeaveReasons";
const LeaveDelegates = "LeaveDelegates";
const sickReasonsTableName = "SickReasons";
const seeingPhysicianTableName = "SeeingPhysician";
const natureOfIllnessTableName = "NatureOfIllness";
const workPartDayTableName = "WorkPartDay";
const employeeTable = "CCPD_Employees";
const departmentTable = "Department";
const employeeLeaveAccuralsTable = "EmployeeLeave_Accruals";
const EmployeeSickLeavesDocuments = "EmployeeSickLeavesDocuments";

exports.getLeaveReasons = async function (req, res) {
  const query = `
    SELECT
      lr.ID,
      lr.ReasonCode,
      lr.ReasonDescription
    FROM
      ${leaveReasonsTableName} AS lr
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Leave Reasons Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getReasonforDropdown = async (req, res) => {
  const query = `
  SELECT
    lr.ReasonDescription as label,
    lr.ID as value
  FROM
    ${leaveReasonsTableName} AS lr
`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json(result.recordset);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(500).json([]);
  }
};

exports.getDelegates = async function (req, res) {
  const query = `
        SELECT
    Distinct
      Supervisor
    FROM
      LeaveDelegates
	  where DelegateTo IN (select EmployeeId from CCPD_Employees where UserName = '${req.params.id}')
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Delegates Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getLeaveById = async function (req, res) {
  const { id } = req.params;

  const leaveQuery = `
    SELECT
      el.*,
      CONCAT(e.LastName, ', ', e.FirstName, ', ', e.Title, ' [', e.BadgeNumber, ']') AS EmployeeName,
      e.EmployeeId,
      e.Unit2
    FROM
      ${tableName} as el
    INNER JOIN
      ${employeeTable} as e
    ON
      e.UserName = el.UserName 
	  WHERE
      el.ID = @id
  `;

  const leaveReasonsQuery = `
    SELECT
      LTRIM(RTRIM(ReasonDescription)) AS label,
      ReasonId as value,
      LTRIM(RTRIM(ReasonCode)) as code,
      RequestedHours
    FROM
      ${employeeLeaveReasonsTable}
    WHERE
      EmployeeLeaveId = @id
  `;

  try {
    const pool = await poolPromise;
    const leaveResult = await pool
      .request()
      .input("id", sql.Int, id)
      .query(leaveQuery);

    const leaveResonsResult = await pool
      .request()
      .input("id", sql.Int, id)
      .query(leaveReasonsQuery);

    if (leaveResult && leaveResult.recordset && leaveResult.recordset[0]) {
      const response = {
        ...leaveResult.recordset[0],
        leaveReasons:
          leaveResonsResult && leaveResonsResult.recordset
            ? leaveResonsResult.recordset
            : [],
      };
      return res.status(200).json({
        status: 1,
        data: response,
        message: "Fetched Successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: null,
        message: "No leave found!",
        error: "",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getLeaveByEmpId = async function (req, res) {
  const { empId } = req.params;
  const leaveQuery = `
  SELECT
    el.*,
    CONCAT(e.LastName, ', ', e.FirstName, ', ', e.Title, ' [', e.BadgeNumber, ']') AS EmployeeName,
    e.EmployeeId,
    e.Unit2
  FROM
    ${tableName} as el
  INNER JOIN
    ${employeeTable} as e
  ON
  el.UserName = e.UserName 
  WHERE
    e.EmployeeId = @id
  Order By el.ID desc 
  OFFSET 0 ROWS FETCH NEXT 6 ROWS ONLY
`;

  try {
    const pool = await poolPromise;
    const leaveResult = await pool
      .request()
      .input("id", sql.Int, empId)
      .query(leaveQuery);
    //console.log(leaveResult.recordset);
    if (leaveResult && leaveResult.recordset)
      res.status(200).json(leaveResult.recordset);
  } catch (error) {
    console.log(error);
  }
};
// Done by sunil which is totally messy
// exports.getLeaveById = async function (req, res) {
//   const { id } = req.params;
//   const query = `
//     SELECT
//      ReasonCode
//     FROM
//       EmployeeLeaves where ID= @id
//   `;
//   const queryReasons = `
//     SELECT
//       LTRIM(RTRIM(ReasonDescription)) AS label,ReasonId as value,LTRIM(RTRIM(ReasonCode)) as code,RequestedHours
//     FROM
//       ${employeeLeaveReasonsTable}
//     WHERE
//       EmployeeLeaveId = @id
//   `;

//   try {
//     const pool = await poolPromise;
//     const result1 = await pool.request().input("id", sql.Int, id).query(query);

//     var accuralType = result1.recordset[0].ReasonCode;

//     switch (accuralType) {
//       case "COMP-TIME":
//         accuralType = "COMP TIME REGULAR";
//         break;
//       case "SICK":
//         accuralType = "SICK TIME";
//         break;
//       case "PER":
//         accuralType = "PERSONAL TIME";
//         break;
//       case "HOL":
//         accuralType = "FLOATING HOLIDAY";
//         break;
//       case "VAC":
//         accuralType = "VACATION TIME";
//         break;
//       case "SUS":
//         accuralType = "Suspended";
//         break;
//       case "TRNG":
//         accuralType = "Training";
//         break;
//     }

//     // console.log(accuralType);

//     const query1 = `
//      SELECT
//     EmployeeLeaves. *,EmployeeLeave_Accruals.AccuralBalance,LeaveReasons.ID as RID,
// 	CONCAT(CCPD_Employees.[LastName], ', ', CCPD_Employees.[FirstName], ', ', CCPD_Employees.[Title], ' [', CCPD_Employees.[BadgeNumber], ']') AS EmployeeName
//                 ,CCPD_Employees.EmployeeId as eid,CCPD_Employees.Unit2 as unit
//     FROM
//       EmployeeLeaves
// 	  inner join CCPD_Employees on CCPD_Employees.UserName = EmployeeLeaves.UserName
// 	  inner join EmployeeLeave_Accruals on EmployeeLeave_Accruals.employeeid = CCPD_Employees.EmployeeId
//     	  inner join LeaveReasons on LeaveReasons.ReasonCode = EmployeeLeaves.ReasonCode
// 	  where EmployeeLeaves.ID=@id AND EmployeeLeave_Accruals.[Accrual Type] = @accuralType
//   `;

//     const result = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .input("accuralType", sql.Char, accuralType)
//       .query(query1);

//     const resultArray = await pool
//       .request()
//       .input("id", sql.Int, id)
//       .query(queryReasons);

//     // console.log(resultArray.recordset)

//     const response = {
//       data: result.recordset,
//       leavereason: resultArray.recordset,
//     };

//     if (result && result.recordset) {
//       // result.recordset["leaveReason"] = resultArray.recordset;
//       return res.status(200).json({
//         status: 1,
//         data: response,
//         message: "Fetched Successfully!",
//         error: "",
//       });
//     } else {
//       return res.status(200).json({
//         status: 0,
//         data: [],
//         message: "",
//         error: "Something went wrong! Please try again later.",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: "",
//       error: "Something went wrong! Please try again later.",
//     });
//   }
// };

exports.uploadDoc = async function (req, res) {
  try {
    let uploadFile = req.files.file;
    const name = uploadFile.name;
    const md5 = uploadFile.md5;
    const saveAs = `${md5}_${name}`;
    uploadFile.mv(`${__dirname}/public/files/${saveAs}`, function (err) {
      if (err) {
        return res.status(500).send(err);
      } else {
        const query = `
    INSERT INTO ${EmployeeSickLeavesDocuments}
      (EmployeeSickLeaveId, DocumentName)
    VALUES
      (@EmployeeSickLeaveId, @DocumentName)
  `;

        insertDataIn(query, req.body.EmployeeSickLeaveId, name);
      }

      return res.status(200).json({ status: "uploaded", name, saveAs });
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

async function insertDataIn(query, EmployeeSickLeaveId, DocumentName) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("EmployeeSickLeaveId", sql.Int, EmployeeSickLeaveId)
    .input("DocumentName", sql.Char, DocumentName)
    .query(query);
  if (result && result.recordset) {
    return res.status(200).json({
      status: 1,
      data: result.recordset,
      message: "Document Uploaded Successfully!",
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
}

exports.getSickLeaveReasons = async function (req, res) {
  const query = `
    SELECT
      sr.ID,
      sr.ReasonCode,
      sr.ReasonDescription
    FROM
      ${sickReasonsTableName} AS sr
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Sick Reasons Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getSeeingPhysician = async function (req, res) {
  const query = `
    SELECT
      sp.ID,
      sp.Code
    FROM
      ${seeingPhysicianTableName} AS sp
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Seeing Physician Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getNatureOfIllness = async function (req, res) {
  const query = `
    SELECT
      ill.ID,
      ill.Code
    FROM
      ${natureOfIllnessTableName} AS ill
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Nature of Illness Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getWorkPartDay = async function (req, res) {
  const query = `
    SELECT
      wpd.ID,
      wpd.Code
    FROM
      ${workPartDayTableName} AS wpd
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Work Part Day Fetched Successfully!",
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
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getLeavesByDateRange = async function (req, res) {
  const { StartDate, EndDate, Unit, Employee, LeaveStatus, AccessLevel } =
    req.body;

  const whereArr = [];
  const whereLikeArr = [];
  let query = `
    SELECT
      el.*,
      e.FirstName,
      e.LastName,
      CONCAT(e.LastName, ', ', e.FirstName, ', ', tl.Title, ' [', e.BadgeNumber, ']') AS FullNameWithBadge,
      CONCAT(action.LastName, ', ', action.FirstName, ', ', action.Title, ' [', action.BadgeNumber, ']') AS actiontakenby,
      e.HireDate,
      e.EmployeeId,
      d.Title as DepartmentName
    FROM
      ${tableName} as el
    LEFT JOIN
      ${employeeTable} as e
    ON
      e.UserName = el.UserName
    LEFT JOIN
      ${departmentTable} as d
    ON
      d.Id = e.Unit2
      LEFT JOIN
      ${employeeTable} as action
    ON
      el.ActionTakenBy = action.EmployeeId
    LEFT JOIN
      Title as tl
    ON
    e.Title2 = tl.ID
  `;

  if (Unit) {
    whereArr.push({ column: "d.Id", value: Unit });
  }

  if (Employee) {
    whereArr.push({ column: "e.EmployeeId", value: Employee });
  }

  if (LeaveStatus) {
    whereLikeArr.push({ column: "el.LeaveStatus", value: `%${LeaveStatus}%` });
  }

  query += ` WHERE ((el.StartDate >= @input_start_date AND el.StartDate <= @input_end_date) OR (el.EndDate >= @input_start_date)) AND LeaveStatus != 'Canceled'`;

  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} LIKE '${o.value}' `;
  });

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(query);

    if (result && result.recordset) {
      if (result.recordset.length) {
        if (AccessLevel === 1) {
          return res.status(200).json({
            status: 1,
            data: result.recordset,
            message: "Records Fetched Successfully!",
            error: "",
          });
        } else {
          const ldapSearchFilterArr = [];
          result.recordset.forEach((o) => {
            const lowercaseUsername = o.UserName.toLowerCase();
            if (ldapSearchFilterArr.indexOf(lowercaseUsername) < 0) {
              ldapSearchFilterArr.push(lowercaseUsername);
            }
          });
          const ldapSearchFilterStr = `(|${ldapSearchFilterArr
            .map((o) => `(sAMAccountName=${o})`)
            .join("")})`;
          const ldapRes = await getUsersLDAPData(ldapSearchFilterStr);
          if (ldapRes && ldapRes.status) {
            const ignoreRanks = [];
            if (AccessLevel === 2) {
              ignoreRanks.push("Chiefs");
              ignoreRanks.push("Captains");
            } else if (AccessLevel === 3) {
              ignoreRanks.push("Lieutenants");
            } else if (AccessLevel === 4) {
              ignoreRanks.push("Sergeants");
            }
            if (ignoreRanks.length) {
              const filteredLDAPUsers = [];
              ldapRes.data.forEach((o) => {
                const regexIgnoreRanks = new RegExp(
                  ignoreRanks.join("|"),
                  "ig"
                );
                if (o && o.memberOf) {
                  let memberOfCSV = o.memberOf;
                  if (typeof o.memberOf !== "string") {
                    memberOfCSV = o.memberOf.join();
                  }
                  const flag = !regexIgnoreRanks.test(memberOfCSV);
                  if (flag) {
                    filteredLDAPUsers.push(o.sAMAccountName.toLowerCase());
                  }
                }
              });
              const filteredRecords = result.recordset.filter((o) => {
                const usernameLowerCase = o.UserName
                  ? o.UserName.toLowerCase()
                  : null;
                if (usernameLowerCase) {
                  if (filteredLDAPUsers.indexOf(usernameLowerCase) >= 0) {
                    return true;
                  }
                }
                return false;
              });

              return res.status(200).json({
                status: 1,
                data: filteredRecords,
                message: "Records Fetched Successfully!",
                error: "",
              });
            } else {
              return res.status(200).json({
                status: 1,
                data: [],
                message: "Records Fetched Successfully!",
                error: "",
              });
            }
          } else {
            return res.status(200).json({
              status: 1,
              data: [],
              message: "Records Fetched Successfully!",
              error: "",
            });
          }
        }
      } else {
        return res.status(200).json({
          status: 1,
          data: [],
          message: "Records Fetched Successfully!",
          error: "",
        });
      }
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
      data: [],
      message: "",
      error,
    });
  }
};

exports.LeaveAccrualsFilterWise = async function (req, res) {
  const {
    Bureau,
    Division,
    Unit,
    Employee,
    PayDate,
    page,
    rowperpage,
    orderDirection,
    orderBy,
  } = req.body;
  const whereArr = [];
  const whereLikeArr = [];

  const whereArr1 = [];
  const whereLikeArr1 = [];

  let query1 = `
    SELECT COUNT(Distinct tbl_employees.EmployeeId) AS totalCount
    FROM CCPD_Employees AS tbl_employees
    LEFT JOIN EmployeeLeave_Accruals AS Accruals
    ON Accruals.employeeid = tbl_employees.EmployeeId`;

  if (Bureau) {
    whereArr1.push({
      column: "tbl_employees.Bureau",
      value: Bureau,
    });
  }

  if (Division) {
    whereArr1.push({
      column: "tbl_employees.Division2",
      value: Division,
    });
  }

  if (Unit) {
    whereArr1.push({ column: "tbl_employees.Unit2", value: Unit });
  }

  if (Employee) {
    whereArr1.push({
      column: "tbl_employees.EmployeeId",
      value: Employee,
    });
  }
  if (PayDate) {
    whereArr1.push({
      column: "Accruals.Pay_Date",
      value: `'${PayDate}'`,
    });
  }
  query1 += ` WHERE tbl_employees.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;
  whereArr1.forEach((o) => {
    query1 += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr1.forEach((o) => {
    query1 += ` AND ${o.column} LIKE '${o.value}' `;
  });

  let query = `SELECT
  tbl_employees.EmployeeId AS EmployeeId,
  tbl_employees.Bureau AS BureauId,
  tbl_bureau.Title AS BureauName,
  tbl_employees.Division2 AS DivisionId,
  tbl_divisions.Title AS DivisionName,
  tbl_employees.Unit2 AS UnitId,
  tbl_units.Title AS UnitName,
  tbl_employees.UserName AS EmployeeUserName,
  CONCAT(tbl_employees.[LastName], ', ', tbl_employees.[FirstName], ', ',tbl_titles.[Title], ' [', tbl_employees.[BadgeNumber], ']') AS EmployeeName,
  tbl_titles.Title AS TitleName,
  ROUND((SELECT SUM(AccuralTotal) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS Total,
  ROUND((SELECT SUM(AccuralRequested) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS Requested,
  ROUND((SELECT SUM(AccuralBalance) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS NetBalance,
  (SELECT Distinct Pay_Date FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId) AS Pay_Date
  FROM CCPD_Employees AS tbl_employees
  LEFT JOIN Department AS tbl_bureau
  ON tbl_employees.Bureau = tbl_bureau.Id AND tbl_bureau.Level = 1
  LEFT JOIN Department AS tbl_divisions
  ON tbl_employees.Division2 = tbl_divisions.Id AND tbl_divisions.Level = 2
  LEFT JOIN Department AS tbl_units
  ON tbl_employees.Unit2 = tbl_units.Id AND tbl_units.Level = 3
  LEFT JOIN Title AS tbl_titles
  ON tbl_employees.Title2 = tbl_titles.ID
  `;

  if (Bureau) {
    whereArr.push({
      column: "tbl_employees.Bureau",
      value: Bureau,
    });
  }

  if (Division) {
    whereArr.push({
      column: "tbl_employees.Division2",
      value: Division,
    });
  }

  if (Unit) {
    whereArr.push({ column: "tbl_employees.Unit2", value: Unit });
  }

  if (Employee) {
    whereArr.push({
      column: "tbl_employees.EmployeeId",
      value: Employee,
    });
  }

  if (PayDate) {
    whereArr.push({
      column:
        "(SELECT Distinct Pay_Date FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId)",
      value: `'${PayDate}'`,
    });
  }
  query += ` WHERE tbl_employees.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;
  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} LIKE '${o.value}' `;
  });

  var colname = "";
  if (orderBy == 0) {
    colname = "tbl_employees.Bureau";
  } else if (orderBy == 1) {
    colname = "tbl_employees.Division2";
  } else if (orderBy == 2) {
    colname = "tbl_employees.Unit2";
  } else if (orderBy == 3) {
    colname = "tbl_employees.LastName";
  } else if (orderBy == 4) {
    colname = "Total";
  } else if (orderBy == 5) {
    colname = "Requested";
  } else if (orderBy == 6) {
    colname = "NetBalance";
  }
  const offset = parseInt(page * rowperpage);
  query += ` ORDER BY ${colname} ${orderDirection}
     OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const result1 = await pool.request().query(query1);

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

exports.getAccrualBalance = async function (req, res) {
  const { employeeId, leaveId } = req.body;
  let query = `
  SELECT EmployeeLeaveReasons.*, EA.[Accrual Type] as AccrualType, EA.AccuralBalance AS AccuralBalance
  FROM EmployeeLeaveReasons
  LEFT JOIN LeaveReasons AS LR On LR.ID = EmployeeLeaveReasons.ReasonId
  LEFT JOIN EmployeeLeave_Accruals AS EA ON EA.employeeid = ${employeeId} AND EA.[Accrual Type] = LR.AccrualType
  WHERE EmployeeLeaveReasons.EmployeeLeaveId= ${leaveId} AND EA.[Accrual Type] is not null
    `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      res.status(200).json(result.recordset);
    } else {
      res.status(200).json({
        status: 0,
        data: null,
        message: "Leave Acruals balance fetched successfully!",
        error: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getAccrualBalanceDepartmentWise = async function (req, res) {
  const { Bureau, Division, Unit } = req.body;
  const whereArr = [];
  const whereLikeArr = [];
  let query = `SELECT
  CONCAT(tbl_employees.[LastName], ', ', tbl_employees.[FirstName], ', ',tbl_titles.[Title], ' [', tbl_employees.[BadgeNumber], ']') AS EmployeeName,
  tbl_titles.Title AS TitleName,
  ROUND((SELECT SUM(AccuralTotal) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS Total,
  ROUND((SELECT SUM(AccuralRequested) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS Requested,
  ROUND((SELECT SUM(AccuralBalance) FROM EmployeeLeave_Accruals WHERE employeeid = tbl_employees.EmployeeId GROUP BY employeeid),2) AS NetBalance
  FROM CCPD_Employees AS tbl_employees
  LEFT JOIN Department AS tbl_bureau
  ON tbl_employees.Bureau = tbl_bureau.Id AND tbl_bureau.Level = 1
  LEFT JOIN Department AS tbl_divisions
  ON tbl_employees.Division2 = tbl_divisions.Id AND tbl_divisions.Level = 2
  LEFT JOIN Department AS tbl_units
  ON tbl_employees.Unit2 = tbl_units.Id AND tbl_units.Level = 3
  LEFT JOIN Title AS tbl_titles
  ON tbl_employees.Title2 = tbl_titles.ID
    `;

  if (Bureau) {
    whereArr.push({
      column: "tbl_employees.Bureau",
      value: Bureau,
    });
  }

  if (Division) {
    whereArr.push({
      column: "tbl_employees.Division2",
      value: Division,
    });
  }

  if (Unit) {
    whereArr.push({ column: "tbl_employees.Unit2", value: Unit });
  }

  query += ` WHERE tbl_employees.IsActive = 1 AND tbl_employees.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;
  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} LIKE '${o.value}' `;
  });

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      res.status(200).json(result.recordset);
    } else {
      res.status(200).json({
        status: 0,
        data: null,
        message: "Leave Acruals balance fetched successfully!",
        error: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.LeaveAccrualsDepartmentWise = async function (req, res) {
  const {
    Bureau,
    Division,
    Unit,
    Employee,
    page,
    rowperpage,
    orderDirection,
    orderBy,
  } = req.body;

  const whereArr = [];
  const whereLikeArr = [];

  let selectQuery = `,Employees.Bureau, (SELECT Title FROM Department WHERE Id = Employees.Bureau) AS BureauName`;
  let groupByQuery = `GROUP BY Employees.Bureau`;

  if (Division) {
    selectQuery += `,Employees.Division2, (SELECT Title FROM Department WHERE Id = Employees.Division2) AS DivisionName`;
    groupByQuery += ",Employees.Division2";
  }

  if (Unit) {
    if (!Division || Division === undefined) {
      selectQuery += `,Employees.Division2, (SELECT Title FROM Department WHERE Id = Employees.Division2) AS DivisionName`;
      groupByQuery += ",Employees.Division2";
    }

    selectQuery += `,Employees.Unit2, (SELECT Title FROM Department WHERE Id = Employees.Unit2) AS UnitName`;
    groupByQuery += ",Employees.Unit2";
  }

  let query = `SELECT
  ROUND(SUM(AccuralTotal),2) AS AccuralTotal,
  ROUND(SUM(AccuralRequested),2) AS AccuralRequested,
  ROUND(SUM(AccuralBalance),2) AS AccuralBalance
  ${selectQuery}
  FROM EmployeeLeave_Accruals AS EA
  INNER JOIN CCPD_Employees AS Employees ON Employees.EmployeeId = EA.employeeid`;

  if (Bureau) {
    whereArr.push({
      column: "Employees.Bureau",
      value: Bureau,
    });
  }

  if (Division) {
    whereArr.push({
      column: "Employees.Division2",
      value: Division,
    });
  }

  if (Unit) {
    whereArr.push({ column: "Employees.Unit2", value: Unit });
  }
  query += ` WHERE EA.employeeid IS NOT NULL AND Employees.IsActive = 1 AND Employees.Status NOT IN ('TERMINATED', 'RETIRED', 'RESIGNED', 'CONTRACT EXPIRED', 'DECEASED')`;
  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} LIKE '${o.value}' `;
  });
  var colname = "";
  if (orderBy == 0) {
    colname = "Employees.Bureau";
  } else if (orderBy == 1) {
    colname = "Employees.Division2";
  } else if (orderBy == 2) {
    colname = "Employees.Unit2";
  } else if (orderBy == 3) {
    colname = "AccuralTotal";
  } else if (orderBy == 4) {
    colname = "AccuralRequested";
  } else if (orderBy == 5) {
    colname = "AccuralBalance";
  }
  const offset = parseInt(page * rowperpage);
  query += ` ${groupByQuery} ORDER BY ${colname} ${orderDirection}
  OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        total: parseInt(result.recordset.length),
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

exports.ReportFilterWise = async function (req, res) {
  const {
    StartDate,
    EndDate,
    DivisionId,
    BureauId,
    Unit,
    Employee,
    Reason,
    LeaveStatus,
    page,
    rowperpage,
    orderDirection,
    orderBy,
  } = req.body;
  const whereArr = [];
  const whereLikeArr = [];

  const whereArr1 = [];
  const whereLikeArr1 = [];

  let query1 = `
    SELECT COUNT(*) AS totalCount
    FROM
      ${tableName} as el
      INNER JOIN CCPD_Employees ON el.Username = CCPD_Employees.UserName
  `;

  if (Unit) {
    whereArr1.push({ column: "CCPD_Employees.Unit2", value: Unit });
  }

  if (Employee) {
    whereArr1.push({ column: "el.Username", value: "'" + Employee + "'" });
  }
  if (DivisionId) {
    whereArr1.push({ column: "CCPD_Employees.Division2", value: DivisionId });
  }
  if (BureauId) {
    whereArr1.push({ column: "CCPD_Employees.Bureau", value: BureauId });
  }
  if (LeaveStatus) {
    whereLikeArr1.push({ column: "LeaveStatus", value: `%${LeaveStatus}%` });
  }
  if (Reason) {
    whereLikeArr1.push({ column: "ReasonDescription", value: `%${Reason}%` });
  }
  query1 += ` WHERE StartDate >= @input_start_date AND EndDate <= @input_end_date `;

  whereArr1.forEach((o) => {
    query1 += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr1.forEach((o) => {
    query1 += ` AND ${o.column} LIKE '${o.value}' `;
  });

  //

  // SELECT
  //     el.*,CCPD_Employees.FirstName,CCPD_Employees.MiddleInitial,CCPD_Employees.LastName,e2.FirstName as sfn,e2.MiddleInitial as smn,e2.LastName as sln
  //     FROM
  //       EmployeeLeaves as el
  //       INNER JOIN CCPD_Employees as CCPD_Employees ON el.Username = CCPD_Employees.UserName
  // 	  LEFT JOIN CCPD_Employees as e2 ON el.Supervisor = e2.EmployeeId

  let query = `
    SELECT
    el.*,CCPD_Employees.FirstName,CCPD_Employees.Badgenumber,CCPD_Employees.LastName,
    e2.FirstName as sfn,e2.MiddleInitial as smn,e2.LastName as sln,e2.Title as st,e2.Badgenumber as sbn,
    e3.FirstName as atsfn,e3.MiddleInitial as atsmn,e3.LastName as atsln, Title_2.Title as atst,e3.Badgenumber as atsbn
    FROM
      ${tableName} as el
      INNER JOIN CCPD_Employees ON el.Username = CCPD_Employees.UserName
       LEFT JOIN CCPD_Employees as e2 ON el.Supervisor = e2.EmployeeId
         LEFT JOIN CCPD_Employees as e3 ON el.ActionTakenBy = e3.EmployeeId
         LEFT JOIN Title AS Title_2 ON e2.Title2 = Title_2.ID`;

  if (Unit) {
    whereArr.push({ column: "CCPD_Employees.Unit2", value: Unit });
  }

  if (Employee) {
    whereArr.push({ column: "el.Username", value: "'" + Employee + "'" });
  }

  if (LeaveStatus) {
    whereLikeArr.push({ column: "LeaveStatus", value: `%${LeaveStatus}%` });
  }
  if (DivisionId) {
    whereArr.push({ column: "CCPD_Employees.Division2", value: DivisionId });
  }
  if (BureauId) {
    whereArr.push({ column: "CCPD_Employees.Bureau", value: BureauId });
  }
  if (Reason) {
    whereLikeArr.push({ column: "ReasonDescription", value: `%${Reason}%` });
  }
  query += ` WHERE StartDate >= @input_start_date AND EndDate <= @input_end_date `;

  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} LIKE '${o.value}' `;
  });

  var colname = "";
  if (orderBy == 0) {
    colname = "FirstName";
  } else if (orderBy == 1) {
    colname = "Supervisor1";
  } else if (orderBy == 2) {
    colname = "Assignment";
  } else if (orderBy == 3) {
    colname = "StartDate";
  } else if (orderBy == 4) {
    colname = "EndDate";
  } else if (orderBy == 5) {
    colname = "LeaveStatus";
  } else {
  }
  const offset = page * rowperpage;
  query += ` ORDER BY ${colname} ${orderDirection} OFFSET ${offset} ROWS FETCH NEXT ${rowperpage} ROWS ONLY`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(query);
    const result1 = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(query1);

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

exports.saveLeave = async function (req, res) {
  const {
    Username,
    Description,
    StartDate,
    StartTime,
    EndDate,
    EndTime,
    TotalHours,
    LeaveReasons,
    LeaveAccurals,
    Assignment,
    Supervisor,
    Supervisor2,
    Commander,
    PendingRequestListURL,
  } = req.body;

  const query = `
    INSERT INTO ${tableName}
      (UserName, Description, ReasonCode, ReasonDescription, StartDate, StartTime, EndDate, EndTime, TotalHours, CreatedAt, UpdatedAt, Assignment, Supervisor, Supervisor2, Commander)
    VALUES
      (@input_username, @input_description, @input_reason_code, @input_reason_description, @input_start_date, @input_start_time, @input_end_date, @input_end_time, @input_total_hours, GETDATE(), GETDATE(), @input_assignment, @input_supervisor, @input_Supervisor2, @input_commander);

    SELECT
      @@IDENTITY AS 'identity'
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_username", sql.Char, Username)
      .input("input_description", sql.Char, Description)
      .input(
        "input_reason_code",
        sql.Char,
        LeaveReasons && LeaveReasons[0] && LeaveReasons[0].ReasonCode
          ? LeaveReasons.map((o) => o.ReasonCode).join(",")
          : null
      )
      .input(
        "input_reason_description",
        sql.Char,
        LeaveReasons && LeaveReasons[0] && LeaveReasons[0].ReasonDescription
          ? LeaveReasons.map((o) => o.ReasonDescription).join(",")
          : null
      )
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("input_start_time", sql.DateTime2, StartTime)
      .input("input_end_time", sql.DateTime2, EndTime)
      .input("input_total_hours", sql.Float, TotalHours)
      .input("input_assignment", sql.Char, Assignment)
      .input("input_supervisor", sql.Int, Supervisor)
      .input("input_Supervisor2", sql.Char, Supervisor2)
      .input("input_commander", sql.Int, Commander)
      .query(query);
    const insertedId =
      result &&
      result.recordset &&
      result.recordset[0] &&
      result.recordset[0].identity
        ? result.recordset[0].identity
        : null;
    if (insertedId) {
      const tbl = new sql.Table(employeeLeaveReasonsTable);
      tbl.columns.add("EmployeeLeaveId", sql.Int);
      tbl.columns.add("ReasonId", sql.Int);
      tbl.columns.add("ReasonCode", sql.Char);
      tbl.columns.add("ReasonDescription", sql.Char);
      tbl.columns.add("RequestedHours", sql.Float);
      LeaveReasons.forEach((o) => {
        tbl.rows.add(
          insertedId,
          o.ReasonId,
          o.ReasonCode,
          o.ReasonDescription,
          o.RequestedHours
        );
      });
      const request = new sql.Request(pool);
      await request.bulk(tbl);
      const updateQuery = getUpdateQueryForAccruals(LeaveAccurals);
      const SP = Supervisor2
        ? Supervisor2.concat(`,${Supervisor}`)
        : `${Supervisor}`;
      const st = StartTime === null ? StartDate : StartTime;
      const et = EndTime === null ? EndDate : EndTime;
      await pool
        .request()
        .input("username", sql.Char, Username)
        .input("supervisor", sql.Char, SP)
        //.input("Commander", sql.Int, Commander)
        .input("StartDate", sql.DateTime2, st)
        .input("EndDate", sql.DateTime2, et)
        // .input("StartTime", sql.DateTime2, StartTime)
        // .input("EndTime", sql.DateTime2, EndTime)
        .input("ReasonDescription", sql.Char, Description)
        .input("PendingRequestListURL", sql.Char, PendingRequestListURL)
        .execute(`[uspSendEmailOfLeave2]`);
      await pool.request().query(updateQuery);
      res.status(200).json({
        status: 1,
        message: "Leave applied successfully!",
        error: "",
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "",
        error: "Error while adding leave! Please try again later",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.shuffleEventDateById = async function (req, res) {
  const { StartDate, EndDate } = req.body;
  const { id } = req.params;
  const query = `
    UPDATE ${tableName} SET
      StartDate = @input_start_date,
      EndDate = @input_end_date,
      UpdatedAt = GETDATE()
    WHERE
      ID = @input_id
  `;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("input_id", sql.Int, id)
      .query(query);
    res.status(200).json({
      status: 1,
      message: "Leave updated successfully!",
      error: "",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.updateLeave = async function (req, res) {
  const {
    StartDate,
    StartTime,
    EndDate,
    EndTime,
    TotalHours,
    LeaveReasons,
    Supervisor,
    Commander,
    Description,
    Username,
  } = req.body;
  const { id } = req.params;
  const query = `
    UPDATE ${tableName} SET
      StartDate = @input_start_date,
      StartTime = @input_start_time,
      EndDate = @input_end_date,
      EndTime =  @input_end_time,
      Commander = @input_commander,
      UpdatedAt = GETDATE(),
      TotalHours = @TotalHours,
      ReasonCode = @ReasonCode,
      ReasonDescription = @ReasonDescription,
      Description = @Description
    WHERE
      ID = @input_id
  `;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("input_start_time", sql.DateTime2, StartTime)
      .input("input_end_time", sql.DateTime2, EndTime)
      .input("TotalHours", sql.Float, TotalHours)
      .input("input_commander", sql.Int, Commander)
      .input(
        "ReasonCode",
        sql.Char,
        LeaveReasons && LeaveReasons[0] && LeaveReasons[0].ReasonCode
          ? LeaveReasons[0].ReasonCode
          : null
      )
      .input(
        "ReasonDescription",
        sql.Char,
        LeaveReasons && LeaveReasons[0] && LeaveReasons[0].ReasonDescription
          ? LeaveReasons[0].ReasonDescription
          : null
      )
      .input("Description", sql.Char, Description)
      .input("input_id", sql.Int, id)
      .query(query);

    //

    await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(
        ` delete from ${employeeLeaveReasonsTable} where EmployeeLeaveId = @input_id`
      );
    const tbl = new sql.Table(employeeLeaveReasonsTable);
    tbl.columns.add("EmployeeLeaveId", sql.Int);
    tbl.columns.add("ReasonId", sql.Int);
    tbl.columns.add("ReasonCode", sql.Char);
    tbl.columns.add("ReasonDescription", sql.Char);
    tbl.columns.add("RequestedHours", sql.Float);
    LeaveReasons.forEach((o) => {
      tbl.rows.add(
        id,
        o.ReasonId,
        o.ReasonCode,
        o.ReasonDescription,
        o.RequestedHours
      );
    });
    const request = new sql.Request(pool);
    await request.bulk(tbl);

    await pool
      .request()
      .input("EmployeeLeaveId", sql.Int, id)
      .input("supervisor", sql.Int, Supervisor)
      .input("status", sql.Char, "Update")
      .input("UpdatedBy", sql.Char, Username)
      .execute(`[uspEmployeeUpdateLeaveAlert]`);

    //uspSupervisorUpdateLeaveAlert

    await pool
      .request()
      .input("EmployeeLeaveId", sql.Int, id)
      .input("status", sql.Char, "Update")
      .input("UpdatedBy", sql.Char, Username)
      .execute(`[uspSupervisorUpdateLeaveAlert]`);

    res.status(200).json({
      status: 1,
      message: "Leave updated successfully!",
      error: "",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.getRequestedLeaves = async function (req, res) {
  //select ID from EmployeeLeaves where Supervisor  = 1313 or ID IN
  // (select ID from EmployeeLeaves where Supervisor IN (select Supervisor from [LeaveDelegates] where delegateTo = 1313))

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
    res.status(500);
    res.send(err.message);
  }
};

exports.getRequestedCount = async function (req, res) {
  const { id, LeaveStatus } = req.body;
  let query = `
      SELECT
        COUNT(ID) AS PendingLeaveRequest
      FROM
        ${tableName}
      WHERE
        LeaveStatus = '${LeaveStatus}' AND 
        (Supervisor IN (@input_id) OR Supervisor2 LIKE '${id},%'
        OR Supervisor2 LIKE '%,${id}'
        OR Supervisor2 LIKE '%,${id},%'
        OR Supervisor2 = '${id}')
    `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);

    if (result && result.recordset && result.recordset[0]) {
      res.status(200).json({
        status: 1,
        data: result.recordset[0],
        message: "Leave fetched successfully!",
        error: "",
      });
    } else {
      res.status(200).json({
        status: 0,
        data: null,
        message: "Leave fetched successfully!",
        error: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.updateLeaveStatus = async function (req, res) {
  const {
    EmployeeId,
    LeaveStatus,
    Supervisor,
    Commander,
    ScheduleCalendarURL,
    DeniedReason,
    ActionTakenDate,
    ActionTakenBy,
    prevRejected,
    EmployeeLeavesUserName,
  } = req.body;
  const { id } = req.params;
  const querySelectLeave = `
    SELECT
      UserName
    FROM
      ${tableName}
    WHERE
      ID = @input_id
  `;
  const querySelectEmployee = `
    SELECT
      EmployeeId
    FROM
      ${employeeTable}
    WHERE
      UserName = @input_username
  `;
  const queryReasons = `
    SELECT
      ReasonCode,
      RequestedHours
    FROM
      ${employeeLeaveReasonsTable}
    WHERE
      EmployeeLeaveId = @input_id
  `;
  const query = `
    UPDATE ${tableName}
    SET
      LeaveStatus = @input_status,
      DeniedReason = @input_reason,
      ActionTakenDate = @input_action_taken_date,
      ActionTakenBy = @input_action_taken_by,
      UpdatedAt = GETDATE()
    WHERE
      ID = @input_id
  `;
  try {
    const pool = await poolPromise;
    let updateQuery = "";
    if ((LeaveStatus && LeaveStatus === "Rejected") || prevRejected) {
      const leaveResult = await pool
        .request()
        .input("input_id", sql.Int, id)
        .query(querySelectLeave);
      const username =
        leaveResult &&
        leaveResult.recordset &&
        leaveResult.recordset[0] &&
        leaveResult.recordset[0].UserName
          ? leaveResult.recordset[0].UserName
          : null;
      if (username) {
        const employeeResult = await pool
          .request()
          .input("input_username", sql.Char, username)
          .query(querySelectEmployee);
        const EmployeeId =
          employeeResult &&
          employeeResult.recordset &&
          employeeResult.recordset[0] &&
          employeeResult.recordset[0].EmployeeId
            ? employeeResult.recordset[0].EmployeeId
            : null;
        if (EmployeeId) {
          const reasonsResult = await pool
            .request()
            .input("input_id", sql.Int, id)
            .query(queryReasons);
          if (reasonsResult && reasonsResult.recordset) {
            updateQuery = reasonsResult.recordset.map((o) => {
              let accuralType = "";
              const code = o.ReasonCode ? o.ReasonCode.trim() : "";
              switch (code) {
                case "COMP-TIME":
                  accuralType = "COMP TIME REGULAR";
                  break;
                case "SICK":
                  accuralType = "SICK TIME";
                  break;
                case "PER":
                  accuralType = "PERSONAL TIME";
                  break;
                case "HOL":
                  accuralType = "FLOATING HOLIDAY";
                  break;
                case "VAC":
                  accuralType = "VACATION TIME";
                  break;
              }
              if (accuralType) {
                if (prevRejected) {
                  return `
                    UPDATE
                      ${employeeLeaveAccuralsTable}
                    SET
                      [AccuralRequested] = [AccuralRequested] + ${o.RequestedHours},
                      [AccuralBalance] = [AccuralBalance] - ${o.RequestedHours}
                    WHERE
                      [Accrual Type] = '${accuralType}' AND employeeid = ${EmployeeId}
                  `;
                } else {
                  return `
                    UPDATE
                      ${employeeLeaveAccuralsTable}
                    SET
                      [AccuralRequested] = [AccuralRequested] - ${o.RequestedHours},
                      [AccuralBalance] = [AccuralBalance] + ${o.RequestedHours}
                    WHERE
                      [Accrual Type] = '${accuralType}' AND employeeid = ${EmployeeId}
                  `;
                }
              }
              return "";
            });
          }
        }
      }
    }
    await pool
      .request()
      .input("input_status", sql.Char, LeaveStatus)
      .input("input_reason", sql.Char, DeniedReason ? DeniedReason : null)
      .input(
        "input_action_taken_date",
        sql.Char,
        ActionTakenDate ? ActionTakenDate : null
      )
      .input(
        "input_action_taken_by",
        sql.Char,
        ActionTakenBy ? ActionTakenBy : null
      )
      .input("input_id", sql.Int, id)
      .input("supervisor", sql.Char, Supervisor)
      .input("commander", sql.Char, Commander)
      .input("DeniedReason", sql.Char, req.body.DeniedReason)
      .input("EmployeeId", sql.Int, req.body.EmployeeId)
      .query(query);
    if (updateQuery) {
      await pool.request().query(updateQuery.join(";"));
    }
    await pool
      .request()
      .input("EmployeeLeaveId", sql.Int, id)
      .input("supervisor", sql.Char, Supervisor)
      .input("commander", sql.Char, Commander)
      .input("status", sql.Char, LeaveStatus)
      .input("ScheduleCalendarURL", sql.Char, ScheduleCalendarURL)
      .input("EmployeeLeavesUserName", sql.Char, EmployeeLeavesUserName)
      .execute(`[usp_sendemail_when_leave_request_Actioned]`);
    res.status(200).json({
      status: 1,
      message: "Leave updated successfully!",
      error: "",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.cancelScheduleLeave = async function (req, res) {
  const { id } = req.params;
  const {
    EmployeeId,
    LeaveStatus,
    ActionTakenDate,
    ActionTakenBy,
    Supervisor,
    Username,
  } = req.body;
  const queryReasons = `
    SELECT
      ReasonCode,
      RequestedHours
    FROM
      ${employeeLeaveReasonsTable}
    WHERE
      EmployeeLeaveId = @input_id
  `;
  const query = `
    UPDATE ${tableName}
    SET
      LeaveStatus = @LeaveStatus,
      ActionTakenDate = @ActionTakenDate,
      UpdatedAt = GETDATE(),
      ActionTakenBy = @ActionTakenBy
    WHERE
      ID = @input_id
  `;

  try {
    const pool = await poolPromise;
    const reasonsResult = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(queryReasons);
    let updateQuery = "";
    if (reasonsResult && reasonsResult.recordset) {
      updateQuery = reasonsResult.recordset.map((o) => {
        let accuralType = "";
        const code = o.ReasonCode ? o.ReasonCode.trim() : "";
        switch (code) {
          case "COMP-TIME":
            accuralType = "COMP TIME REGULAR";
            break;
          case "SICK":
            accuralType = "SICK TIME";
            break;
          case "PER":
            accuralType = "PERSONAL TIME";
            break;
          case "HOL":
            accuralType = "FLOATING HOLIDAY";
            break;
          case "VAC":
            accuralType = "VACATION TIME";
            break;
        }
        if (accuralType && LeaveStatus != "Rejected") {
          return `
            UPDATE
              ${employeeLeaveAccuralsTable}
            SET
              [AccuralRequested] = [AccuralRequested] - ${o.RequestedHours},
              [AccuralBalance] = [AccuralBalance] + ${o.RequestedHours}
            WHERE
              [Accrual Type] = '${accuralType}' AND employeeid = ${EmployeeId}
          `;
        }
        return "";
      });
    }

    await pool
      .request()
      .input("input_id", sql.Int, id)
      .input("LeaveStatus", sql.Char, LeaveStatus)
      .input("ActionTakenDate", sql.DateTime2, ActionTakenDate)
      .input("ActionTakenBy", sql.Int, ActionTakenBy)
      .query(query);

    if (updateQuery) {
      await pool.request().query(updateQuery.join(";"));
    }

    await pool
      .request()
      .input("EmployeeLeaveId", sql.Int, id)
      .input("supervisor", sql.Int, Supervisor)
      .input("status", sql.Char, "Cancel")
      .input("UpdatedBy", sql.Char, Username)
      .execute(`[uspEmployeeUpdateLeaveAlert]`);

    //uspSupervisorUpdateLeaveAlert

    await pool
      .request()
      .input("EmployeeLeaveId", sql.Int, id)
      .input("status", sql.Char, "Cancel")
      .input("UpdatedBy", sql.Char, Username)
      .execute(`[uspSupervisorUpdateLeaveAlert]`);

    res.status(200).json({
      status: 1,
      message: "Leave canceled successfully!",
      error: "",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

const getUpdateQueryForAccruals = function (data) {
  const updateQueries = data.map(
    (o) =>
      `UPDATE ${employeeLeaveAccuralsTable} SET [AccuralBalance] = ${o["AccuralBalance"]}, [AccuralRequested] = ${o["AccuralRequested"]} WHERE employeeid = ${o["employeeid"]} AND [Accrual Type] LIKE '%${o["Accrual Type"]}%'`
  );

  return updateQueries.join(";");
};

const getUsersLDAPData = (filter) => {
  const promise = new Promise((resolve, reject) => {
    try {
      connectLDAP(
        process.env.LDAP_URL,
        process.env.LDAP_USER,
        decrypt(process.env.LDAP_PASSWORD),
        () => {
          const searchOptions = {
            filter,
            scope: "sub",
            attributes: ["sAMAccountName", "memberOf"],
          };
          searchLDAP("DC=camdenpd,DC=com", searchOptions)
            .then((data) => {
              disconnectLDAP(() => {
                resolve({ status: 1, data, error: null });
              });
            })
            .catch((err) => {
              disconnectLDAP(() => {
                reject({ status: 0, data: [], error: err });
              });
            });
        },
        (err) => {
          disconnectLDAP(() => {
            reject({ status: 0, data: [], error: err });
          });
        }
      );
    } catch (error) {
      disconnectLDAP(() => {
        reject({ status: 0, data: [], error: error });
      });
    }
  });
  return promise;
};
