const { sql, poolPromise } = require("../../config/mssql_fleet.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const TABLE_NAME = "ServiceType";
const SELECT_QUERY = `SELECT h.Id, h.Code, h.Description FROM ${TABLE_NAME} AS h WHERE h.Id = @input_id`;
const INSERT_QUERY = `INSERT INTO ${TABLE_NAME} (Code, Description) VALUES (@input_code, @input_description)`;
const UPDATE_QUERY = `UPDATE ${TABLE_NAME} SET Code = @input_code, Description = @input_description WHERE Id = @input_id`;

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
        message: "ServiceType Fetched Successfully!",
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

exports.add = async function (req, res) {
  const { Code, Description, Username } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("input_code", sql.Char, Code)
      .input("input_description", sql.Char, Description)
      .query(INSERT_QUERY);

    res.status(200).json({
      status: 1,
      message: "ServiceType Inserted Successfully!",
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

exports.update = async function (req, res) {
  const { id } = req.params;
  const { Code, Description, Username } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("input_code", sql.Char, Code)
      .input("input_description", sql.Char, Description)
      .input("input_id", sql.Int, id)
      .query(UPDATE_QUERY);

    res.status(200).json({
      status: 1,
      message: "ServiceType Updated Successfully!",
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
