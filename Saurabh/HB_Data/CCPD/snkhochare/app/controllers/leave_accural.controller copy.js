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
      EmployeeId = @input_id
  `;
  const query = `
    SELECT
      tbl.Starttime,
      tbl.Endtime,
      tbl.ShiftMins
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
          data: result.recordset[0] ? result.recordset[0] : null,
          message: "Employee shift for unit fetched successfully!",
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
      tbl.ShiftMins
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
    if (result && result.recordset && result.recordset[0]) {
      return res.status(200).json({
        status: 1,
        data: result.recordset[0],
        message: "Employee shift for unit fetched successfully!",
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
