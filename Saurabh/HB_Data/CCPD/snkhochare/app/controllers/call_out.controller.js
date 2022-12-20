const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "EmployeeSickLeaves";
const sickReasonsTableName = "SickReasons";
const seeingPhysicianTableName = "SeeingPhysician";
const natureOfIllnessTableName = "NatureOfIllness";
const workPartDayTableName = "WorkPartDay";

exports.ReportFilterWise = async function (req, res) {
  const {
    StartDate,
    EndDate,
    Unit,
    Employee,
    LeaveStatus,
    page,
    rowperpage,
    SeekOption,
    WorkOption,
    Supervisor,
    NatureOfIllnessOption,
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
     INNER JOIN CCPD_Employees ON CCPD_Employees.Username = el.UserName
  `;

  if (Unit) {
    whereArr1.push({ column: "Assignment", value: "'" + Unit + "'" });
  }

  if (Employee) {
    whereArr1.push({
      column: "CCPD_Employees.Username",
      value: "'" + Employee + "'",
    });
  }

  if (LeaveStatus) {
    whereLikeArr1.push({ column: "LeaveStatus", value: `%${LeaveStatus}%` });
  }

  if (SeekOption) {
    whereArr1.push({
      column: "SeeingPhysician",
      value: "'" + SeekOption + "'",
    });
  }

  if (WorkOption) {
    whereArr1.push({ column: "WorkPartDay", value: "'" + WorkOption + "'" });
  }

  if (NatureOfIllnessOption) {
    whereArr1.push({
      column: "NatureOfIllness",
      value: "'" + NatureOfIllnessOption + "'",
    });
  }

  if (Supervisor) {
    whereArr1.push({ column: "Supervisor", value: "'" + Supervisor + "'" });
  }

  query1 += ` WHERE StartDate >= @input_start_date AND EndDate <= @input_end_date `;

  whereArr1.forEach((o) => {
    query1 += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr1.forEach((o) => {
    query1 += ` AND ${o.column} = '${o.value}' `;
  });

  //

  let query = `
    SELECT
    el.*,e2.FirstName as sfn,e2.MiddleInitial as smn,e2.LastName as sln, e2.BadgeNumber as sbn
    FROM
      ${tableName} as el
      INNER JOIN CCPD_Employees ON CCPD_Employees.Username = el.UserName
        LEFT JOIN CCPD_Employees as e2 ON el.Supervisor = e2.EmployeeId
  `;

  if (Unit) {
    whereArr.push({ column: "Assignment", value: "'" + Unit + "'" });
  }

  if (Employee) {
    whereArr.push({
      column: "CCPD_Employees.Username",
      value: "'" + Employee + "'",
    });
  }

  if (LeaveStatus) {
    whereLikeArr.push({ column: "LeaveStatus", value: `%${LeaveStatus}%` });
  }

  if (SeekOption) {
    whereArr.push({ column: "SeeingPhysician", value: "'" + SeekOption + "'" });
  }

  if (WorkOption) {
    whereArr.push({ column: "WorkPartDay", value: "'" + WorkOption + "'" });
  }

  if (NatureOfIllnessOption) {
    whereArr.push({
      column: "NatureOfIllness",
      value: "'" + NatureOfIllnessOption + "'",
    });
  }

  if (Supervisor) {
    whereArr.push({ column: "Supervisor", value: "'" + Supervisor + "'" });
  }

  query += ` WHERE StartDate >= @input_start_date AND EndDate <= @input_end_date `;

  whereArr.forEach((o) => {
    query += ` AND ${o.column} = ${o.value} `;
  });
  whereLikeArr.forEach((o) => {
    query += ` AND ${o.column} = '${o.value}' `;
  });

  var colname = "el.ID";
  if (orderBy == 0) {
    colname = "el.UserName";
  } else if (orderBy == 1) {
    colname = "Supervisor";
  } else if (orderBy == 2) {
    colname = "ReasonIllness";
  } else if (orderBy == 3) {
    colname = "ReasonDescription";
  } else if (orderBy == 4) {
    colname = "WorkPartDay";
  } else if (orderBy == 6) {
    colname = "NatureOfIllness";
  } else if (orderBy == 5) {
    colname = "SeeingPhysician";
  } else if (orderBy == 7) {
    colname = "Assignment";
  } else if (orderBy == 8) {
    colname = "StartDate";
  } else if (orderBy == 9) {
    colname = "EndDate";
  } else {
  }

  query += ` ORDER BY ${colname} ${orderDirection}
     OFFSET @noofrow ROWS
FETCH NEXT @no ROWS ONLY `;
  console.log(query);
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("noofrow", sql.Int, parseInt(rowperpage * page))
      .input("no", sql.Int, rowperpage)
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

exports.fetchCallOutList = async function (req, res) {
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

exports.getLeaveReasons = async function (req, res) {
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

exports.saveCallout = async function (req, res) {
  const {
    UserName,
    ReasonCode,
    ReasonDescription,
    ReasonIllness,
    NatureOfIllness,
    WorkPartDay,
    SeeingPhysician,
    StartDate,
    EndDate,
    ShiftStartDate,
    ShiftEndDate,
    LocationStartDate,
    LocationEndDate,
    ExpectedReturnDate,
    HouseNumber,
    ApartmentNumber,
    StreetName,
    City,
    State,
    Zip,
    County,
    Phone,
    Supervisor,
    Assignment,
    CallTaker,
    Createdby,
    RecoveryStartDate,
    RecoveryEndDate,
    UserNameID,
  } = req.body;
  const query = ``;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("UserName", sql.Char, UserName)
      .input("ReasonCode", sql.Char, ReasonCode)
      .input("ReasonDescription", sql.Char, ReasonDescription)
      .input("ReasonIllness", sql.Char, ReasonIllness)
      .input("NatureOfIllness", sql.Char, NatureOfIllness)
      .input("WorkPartDay", sql.Char, WorkPartDay)
      .input("SeeingPhysician", sql.Char, SeeingPhysician)
      .input("StartDate", sql.DateTime2, StartDate)
      .input("EndDate", sql.DateTime2, EndDate)
      .input("ShiftStartDate", sql.DateTime2, ShiftStartDate)
      .input("ShiftEndDate", sql.DateTime2, ShiftEndDate)
      .input("LocationStartDate", sql.DateTime2, LocationStartDate)
      .input("LocationEndDate", sql.DateTime2, LocationEndDate)
      .input("HouseNumber", sql.Char, HouseNumber)
      .input("ApartmentNumber", sql.Char, ApartmentNumber)
      .input("StreetName", sql.Char, StreetName)
      .input("City", sql.Char, City)
      .input("State", sql.Char, State)
      .input("Zip", sql.Char, Zip)
      .input("County", sql.Char, County)
      .input("Phone", sql.Char, Phone)
      .input("Assignment", sql.Char, Assignment)
      .input("Supervisor", sql.Int, Supervisor)
      .input("ExpectedReturnDate", sql.DateTime2, ExpectedReturnDate)
      .input("CreatedBy", sql.Char, Createdby)
      .input("RecoveryStartDate", sql.DateTime2, RecoveryStartDate)
      .input("RecoveryEndDate", sql.DateTime2, RecoveryEndDate)
      // .input("CallTakenDateTime", sql.DateTime2, CallTakenDateTime)
      .input("CallTaker", sql.Char, CallTaker)
      .input("CommanderNotifyTime", sql.DateTime2, CallTaker)
      .input("CommanderNotifyMethod", sql.Char, CallTaker)
      .input("UserNameID", sql.Int, UserNameID)
      .execute(`[uspSendEmailOfLeave]`);
    res.status(200).json({
      status: 1,
      message: "Leave applied successfully!",
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

// exports.saveCallout = async function (req, res) {
//   const {
//     UserName,
//     ReasonCode,
//     ReasonDescription,
//     ReasonIllness,
//     NatureOfIllness,
//     WorkPartDay,
//     SeeingPhysician,
//     StartDate,
//     EndDate,
//     ShiftStartDate,
//     ShiftEndDate,
//     LocationStartDate,
//     LocationEndDate,
//     ExpectedReturnDate,
//     HouseNumber,
//     ApartmentNumber,
//     StreetName,
//     City,
//     State,
//     Zip,
//     County,
//     Phone,
//     Supervisor,
//     Assignment,
//     CallTaker,
//     CallTakenDateTime,
//     RecoveryStartDate,
//     RecoveryEndDate,UserNameID
//   } = req.body;
//   const query = `
//     INSERT INTO ${tableName}
//       (UserName, ReasonCode, ReasonDescription, ReasonIllness, NatureOfIllness, WorkPartDay, SeeingPhysician, StartDate, EndDate, ShiftStartDate, ShiftEndDate, LocationStartDate, LocationEndDate, HouseNumber, ApartmentNumber, StreetName, City, State, Zip, County, Phone, Assignment, Supervisor, ExpectedReturnDate, UpdateDate, UpdatedBy, CreateDate, CreatedBy,CallTakenDateTime,CallTaker)
//     VALUES
//       (@input_username, @input_reason_code, @input_reason_description, @input_reason_illness, @input_nature_illness, @input_work_part_day, @input_seeing_physician, @input_start_date, @input_end_date, @input_shift_start_date, @input_shift_end_date, @input_location_start_date, @input_location_end_date, @input_house_number, @input_apartment_number, @input_street_name, @input_city, @input_state, @input_zip, @input_county, @input_phone, @input_assignment, @input_supervisor, @input_expected_return_date, GETDATE(), @input_updated_by, GETDATE(), @input_created_by,@CallTakenDateTime,@CallTaker);
//   `;
//   try {
//     const pool = await poolPromise;
//     await pool
//       .request()
//       .input("UserName", sql.Char, UserName)
//       .input("ReasonCode", sql.Char, ReasonCode)
//       .input("ReasonDescription", sql.Char, ReasonDescription)
//       .input("ReasonIllness", sql.Char, ReasonIllness)
//       .input("NatureOfIllness", sql.Char, NatureOfIllness)
//       .input("WorkPartDay", sql.Char, WorkPartDay)
//       .input("SeeingPhysician", sql.Char, SeeingPhysician)
//       .input("StartDate", sql.DateTime2, StartDate)
//       .input("EndDate", sql.DateTime2, EndDate)
//       .input("ShiftStartDate", sql.DateTime2, ShiftStartDate)
//       .input("ShiftEndDate", sql.DateTime2, ShiftEndDate)
//       .input("LocationStartDate", sql.DateTime2, LocationStartDate)
//       .input("LocationEndDate", sql.DateTime2, LocationEndDate)
//       .input("HouseNumber", sql.Char, HouseNumber)
//       .input("ApartmentNumber", sql.Char, ApartmentNumber)
//       .input("StreetName", sql.Char, StreetName)
//       .input("City", sql.Char, City)
//       .input("State", sql.Char, State)
//       .input("Zip", sql.Char, Zip)
//       .input("County", sql.Char, County)
//       .input("Phone", sql.Char, Phone)
//       .input("Assignment", sql.Char, Assignment)
//       .input("Supervisor", sql.Int, Supervisor)
//       .input("ExpectedReturnDate", sql.DateTime2, ExpectedReturnDate)
//       .input("CreatedBy", sql.Char, UserName)
//       .input("UpdatedBy", sql.Char, UserName)
//       .input("RecoveryStartDate",sql.Char,RecoveryStartDate)
//       .input("RecoveryEndDate",sql.Char,RecoveryEndDate)
//       .input("CallTakenDateTime", sql.DateTime2, CallTakenDateTime)
//       .input("CallTaker", sql.Char, CallTaker)
//       .input("UpdateDate", sql.Char, '')
//       .input("UserNameID",sql.Int, UserNameID)
//       .execute(`[uspSendEmailOfLeave]`);
//     res.status(200).json({
//       status: 1,
//       message: "Leave applied successfully!",
//       error: "",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 0,
//       message: "",
//       error: "Something went wrong! Please try again later." + error,
//     });
//   }
// };
