const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "EmployeeTemporaryUnitShift";

exports.getEmployeeTemUnitShift = async function (req, res) {
  const query = `
      SELECT
        etus.Id,
        etus.EmployeeId,
        etus.PrevUnitId,
        etus.NextUnitId,
        etus.RevertBackStatusDate,
        etus.SelectedStatus,
        etus.RevertToStatus,
        etus.IsReverted,
        etus.CreatedAt,
        etus.CreatedBy,
        etus.UpdatedAt,
        etus.UpdatedBy
      FROM
        ${tableName} AS etus
    `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Employee Temp Unit Shift Details Fetched Successfully!",
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

exports.insertEmployeeTempUnitShift = async function (req, res) {
  const {
    EmployeeId,
    PrevUnitId,
    NextUnitId,
    RevertBackStatusDate,
    SelectedStatus,
    RevertToStatus,
    IsReverted,
    CreatedBy,
    UpdatedBy,
  } = req.body;
  try {
    const pool = await poolPromise;

    const query = `
      INSERT INTO ${tableName}
        (EmployeeId, PrevUnitId, NextUnitId, RevertBackStatusDate, SelectedStatus, RevertToStatus, IsReverted, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)
      VALUES
        (@input_employee_id, @input_prev_unit_id, @input_next_unit_id, @input_reverse_back_status_date, @input_selected_status, @input_revert_to_status, @input_is_reverted, GETDATE(), @input_created_by, GETDATE(), @input_updated_by);
    `;
    await pool
      .request()
      .input("input_employee_id", sql.Int, EmployeeId)
      .input("input_prev_unit_id", sql.Int, PrevUnitId)
      .input("input_next_unit_id", sql.Int, NextUnitId)
      .input(
        "input_reverse_back_status_date",
        sql.DateTime2,
        RevertBackStatusDate
      )
      .input("input_selected_status", sql.Char, SelectedStatus)
      .input("input_revert_to_status", sql.Char, RevertToStatus)
      .input("input_is_reverted", sql.Char, IsReverted)
      .input("input_created_by", sql.Char, CreatedBy)
      .input("input_updated_by", sql.Char, UpdatedBy)
      .query(query);

    res.status(200).json({
      status: 1,
      message: "Employee Temp Unit Shift Details Inserted Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while Employee Temp Unit Shift Details", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.getSingleEmployeeTemUnitShift = async function (req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const query = `
      SELECT
        etus.Id,
        etus.EmployeeId,
        etus.PrevUnitId,
        etus.NextUnitId,
        etus.RevertBackStatusDate,
        etus.SelectedStatus,
        etus.RevertToStatus,
        etus.IsReverted,
        etus.CreatedAt,
        etus.CreatedBy,
        etus.UpdatedAt,
        etus.UpdatedBy
      FROM
        ${tableName} AS etus
      WHERE etus.Id = @input_id
    `;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);
    if (result && result.recordset && result.recordset[0]) {
      return res.status(200).json({
        status: 1,
        data: result.recordset[0],
        message: "Employee Temp unit shift details Fetched Successfully!",
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
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.updateSingleEmployeeTemUnitShift = async function (req, res) {
  const { id } = req.params;
  const {
    PrevUnitId,
    NextUnitId,
    RevertBackStatusDate,
    SelectedStatus,
    RevertToStatus,
    IsReverted,
    CreatedBy,
    UpdatedBy,
  } = req.body;

  try {
    const pool = await poolPromise;
    const query = `
      UPDATE  ${tableName} SET
        PrevUnitId = @input_prev_unit_id, 
        NextUnitId =  @input_next_unit_id, 
        RevertBackStatusDate = @input_reverse_back_status_date, 
        SelectedStatus = @input_selected_status, 
        RevertToStatus = @input_revert_to_status, 
        IsReverted = @input_is_reverted,  
        CreatedBy = @input_created_by, 
        UpdatedAt = GETDATE(), 
        UpdatedBy = @input_updated_by
      WHERE 
        Id = @input_id
    ;
    `;
    await pool
      .request()
      .input("input_id", sql.Int, id)
      .input("input_prev_unit_id", sql.Int, PrevUnitId)
      .input("input_next_unit_id", sql.Int, NextUnitId)
      .input(
        "input_reverse_back_status_date",
        sql.DateTime2,
        RevertBackStatusDate
      )
      .input("input_selected_status", sql.Char, SelectedStatus)
      .input("input_revert_to_status", sql.Char, RevertToStatus)
      .input("input_is_reverted", sql.Char, IsReverted)
      .input("input_created_by", sql.Char, CreatedBy)
      .input("input_updated_by", sql.Char, UpdatedBy)
      .query(query);

    res.status(200).json({
      status: 1,
      message: "Employee Temp unit shift details Updated Successfully!",
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
