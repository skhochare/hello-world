const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "EmployeeLogHistory";

exports.getEmployeeLogHistory = async function (req, res) {
  const query = `
      SELECT
        elog.Id,
        elog.EmployeeId,
        elog.Field,
        elog.PrevValue,
        elog.NextValue,
        elog.SummaryNote,
        elog.TransferDate,
        elog.PromotionDate,
        elog.TerminateNotes,
        elog.TerminateDate,
        elog.CreatedAt,
        elog.CreatedBy
      FROM
        ${tableName} AS elog
    `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Employee Log History Details Fetched Successfully!",
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

exports.bulkEmployeeLogHistory = async function (req, res) {
  try {
    const pool = await poolPromise;
    const d = new Date().toISOString();

    const tbl = new sql.Table(`${tableName}`);
    tbl.columns.add("EmployeeId", sql.Int);
    tbl.columns.add("Field", sql.VarChar(sql.MAX));
    tbl.columns.add("PrevValue", sql.VarChar(sql.MAX));
    tbl.columns.add("NextValue", sql.VarChar(sql.MAX));
    tbl.columns.add("CreatedAt", sql.VarChar(sql.MAX));
    tbl.columns.add("CreatedBy", sql.VarChar(sql.MAX));
    tbl.columns.add("SummaryNote", sql.VarChar(sql.MAX));
    tbl.columns.add("TransferDate", sql.VarChar(sql.MAX));
    tbl.columns.add("PromotionDate", sql.VarChar(sql.MAX));
    tbl.columns.add("TerminateNotes", sql.VarChar(sql.MAX));
    tbl.columns.add("TerminateDate", sql.VarChar(sql.MAX));

    req.body.forEach((o) => {
      tbl.rows.add(
        o.EmployeeId,
        o.Field,
        o.PrevValue,
        o.NextValue,
        d,
        o.CreatedBy,
        o.SummaryNote,
        o.TransferDate,
        o.PromotionDate,
        o.TerminateNotes,
        o.TerminateDate
      );
    });

    const request = new sql.Request(pool);
    await request.bulk(tbl);
    res.status(200).json({
      status: 1,
      message: "Employee Log History Details Inserted Successfully!",
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
