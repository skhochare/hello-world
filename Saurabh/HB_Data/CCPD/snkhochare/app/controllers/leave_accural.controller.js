const { sql, poolPromise } = require("../../config/mssql_hr.config");
const tableName = "EmployeeLeave_Accruals";
const employeeUnitSchedule = "Emp_Unit_Schedule";
const employeeTable = "CCPD_Employees";

exports.getBalanceByEmployeeId = async function (req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      *
    FROM
      ${tableName}
    WHERE
      [employeeid] = @input_employee_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_employee_id", sql.Int, id)
      .query(query);
    if (result && result.recordset) {
      res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Leave accural fetched successfully!",
        error: "",
      });
    } else {
      res.status(200).json({
        status: 1,
        data: [],
        message: "Leave accural fetched successfully!",
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

exports.getUnitShiftTimeByEmployeeId = async function (req, res) {
  const { id } = req.params;
  const employeeQuery = `
    SELECT
      tbl.Unit2
    FROM
      ${employeeTable} as tbl
    WHERE
      tbl.EmployeeId = @input_id
  `;
  const query = `
    SELECT
      tbl.Starttime,
      tbl.Endtime,
      tbl.ShiftMins,
      tbl.Day,
      tbl.IsOffDay
    FROM
      ${employeeUnitSchedule} AS tbl
    WHERE
      tbl.UnitId = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(employeeQuery);
    if (result && result.recordset && result.recordset[0]) {
      const { Unit2 } = result.recordset[0];
      if (Unit2) {
        const result = await pool
          .request()
          .input("input_id", sql.Int, Unit2)
          .query(query);
        return res.status(200).json({
          status: 1,
          data: result.recordset,
          message: "Employee shift for unit fetched successfully!",
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

exports.getLeaveAccuralsByEmployeeId = async function (req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      tbl.[Accrual Type] AS AccrualType,
      ROUND(tbl.[Previous Balance], 2) AS PreviousBalance,
      ROUND(tbl.[Current Balance], 2) AS CurrentBalance,
      ROUND(tbl.[AccuralTotal], 2) AS AccuralTotal,
      tbl.[AccuralRequested] AS AccuralRequested,
      ROUND(tbl.[AccuralBalance], 2) AS AccuralBalance,
      tbl.[Pay_Date] AS Pay_Date
    FROM
      ${tableName} as tbl
    WHERE
      tbl.employeeid = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Employee accruals fetched successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: null,
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

exports.getEmployeeShiftTimeByEmployeeId = async function (req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      tbl.Starttime,
      tbl.Endtime,
      tbl.ShiftMins,
      tbl.Day,
      tbl.IsOffDay
    FROM
      ${employeeUnitSchedule} AS tbl
    WHERE
      tbl.EmpId = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);
    return res.status(200).json({
      status: 1,
      data: result.recordset,
      message: "Employee shift for unit fetched successfully!",
      error: "",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getPaydate = async function (req, res) {
  try {
    const query = `SELECT distinct Pay_Date FROM EmployeeLeave_Accruals ORDER BY Pay_Date DESC`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};
