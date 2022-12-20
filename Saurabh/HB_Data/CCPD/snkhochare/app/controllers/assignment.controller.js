const { sql, poolPromise } = require("../../config/mssql_fleet.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const TABLE_NAME = "Depts";
const SELECTALL = `SELECT *, [Dept] AS value,[Dept] AS label FROM ${TABLE_NAME}`;
const SELECT_QUERY = `SELECT *, [Dept Desc] AS Descr FROM ${TABLE_NAME} AS h WHERE h.DeptID = @input_id`;
const INSERT_QUERY = `INSERT INTO ${TABLE_NAME} (Dept, [Dept Desc], GroupID) VALUES (@Dept, @Descr,@GroupID)`;
const UPDATE_QUERY = `UPDATE ${TABLE_NAME} SET Dept = @Dept, [Dept Desc] = @Descr WHERE DeptID = @input_id`;

exports.fetch = async function (req, res) {
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

exports.getDepts = async function (req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(SELECTALL);
    if (result && result.recordset && result.recordset[0]) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "assignment Fetched Successfully!",
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

exports.get = async function (req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(SELECT_QUERY);
    if (result && result.recordset && result.recordset[0]) {
      return res.status(200).json({
        status: 1,
        data: result.recordset[0],
        message: "assignment Fetched Successfully!",
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

exports.add = async function (req, res) {
  const { Dept, Descr, GroupID } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("Dept", sql.Char, Dept)
      .input("Descr", sql.Char, Descr)
      .input("GroupID", sql.Int, GroupID)
      .query(INSERT_QUERY);

    res.status(200).json({
      status: 1,
      message: "Assignment Inserted Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding vehicle_location", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.update = async function (req, res) {
  const { id } = req.params;
  const { Dept, Descr, GroupID } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("Dept", sql.Char, Dept)
      .input("Descr", sql.Char, Descr)
      .input("GroupID", sql.Int, GroupID)
      .input("input_id", sql.Int, id)
      .query(UPDATE_QUERY);

    res.status(200).json({
      status: 1,
      message: "Assignment Updated Successfully!",
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
