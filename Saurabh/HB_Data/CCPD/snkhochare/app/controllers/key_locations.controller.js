const { sql, poolPromise } = require("../../config/mssql_fleet.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const TABLE_NAME = "KeyLocation";
const SELECT_QUERY = `SELECT h.Id, h.Code, h.Description FROM ${TABLE_NAME} AS h WHERE h.Id = @input_id`;
const INSERT_QUERY = `INSERT INTO ${TABLE_NAME} (Code, Description) VALUES (@input_code, @input_description)`;
const UPDATE_QUERY = `UPDATE ${TABLE_NAME} SET Code = @input_code, Description = @input_description WHERE Id = @input_id`;

const SELECTALL = `SELECT * from  ${"Keys"} `;

const SELECTALL_S = `SELECT * from  ${"Keys"} where ID = @id`;

const INSERT_QUERY_KEYS = `INSERT INTO ${"Keys"} (TagNumber,PrimaryKeyIssueDate
      ,PrimaryKeyYN
      ,GasKeyIssueDate
      ,GasKeyYN
      ,SpareKeyIssueDate
      ,SpareKeyYN
      ,Assignment
      ,Comments,CreateDate,CreatedBy) VALUES (@TagNumber,@PrimaryKeyIssueDate
      ,@PrimaryKeyYN
      ,@GasKeyIssueDate
      ,@GasKeyYN
      ,@SpareKeyIssueDate
      ,@SpareKeyYN
      ,@Assignment
      ,@Comments,GETDATE(),@CreateBy)`;

const UPDATE_QUERY_KEYS = `UPDATE ${"Keys"} SET
TagNumber = @TagNumber,
  PrimaryKeyIssueDate = @PrimaryKeyIssueDate
      ,PrimaryKeyYN = @PrimaryKeyYN
      ,GasKeyIssueDate = 
      @GasKeyIssueDate
      ,GasKeyYN = 
      @GasKeyYN
      ,SpareKeyIssueDate = 
      @SpareKeyIssueDate
      ,SpareKeyYN = 
      @SpareKeyYN
      ,Assignment = 
      @Assignment
      ,Comments = 
      @Comments
     
      WHERE ID = @id`;

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
        message: "KeyLocation Fetched Successfully!",
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
  const { Code, Description } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("input_code", sql.Char, Code)
      .input("input_description", sql.Char, Description)
      .query(INSERT_QUERY);

    res.status(200).json({
      status: 1,
      message: "KeyLocation Inserted Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding vehicle_location", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.addKeys = async function (req, res) {
  const {
    TagNumber,
    PrimaryKeyIssueDate,
    PrimaryKeyYN,
    GasKeyIssueDate,
    GasKeyYN,
    SpareKeyIssueDate,
    SpareKeyYN,
    Assignment,
    Comments,
    CreateBy,
  } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("TagNumber", sql.Char, TagNumber)
      .input("PrimaryKeyIssueDate", sql.Char, PrimaryKeyIssueDate)
      .input("PrimaryKeyYN", sql.Char, PrimaryKeyYN)
      .input("GasKeyIssueDate", sql.Char, GasKeyIssueDate)
      .input("GasKeyYN", sql.Char, GasKeyYN)
      .input("SpareKeyIssueDate", sql.Char, SpareKeyIssueDate)
      .input("SpareKeyYN", sql.Char, SpareKeyYN)
      .input("Assignment", sql.Char, Assignment)
      .input("Comments", sql.Char, Comments)
      .input("CreateBy", sql.Char, CreateBy)

      .query(INSERT_QUERY_KEYS);

    res.status(200).json({
      status: 1,
      message: "Key Inserted Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding Keys", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.getAll = async function (req, res) {
  try {
    const pool = await poolPromise;

    await pool
      .request()

      .query(SELECTALL);

    res.status(200).json({
      status: 1,
      message: "Fetch  Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding Keys", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};
exports.getsingle = async function (req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(SELECTALL_S);

    return res.status(200).json({
      status: 1,
      data: result.recordset[0],
      message: "Key Fetched Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding Keys", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.updateKeys = async function (req, res) {
  const { id } = req.params;
  const {
    TagNumber,
    PrimaryKeyIssueDate,
    PrimaryKeyYN,
    GasKeyIssueDate,
    GasKeyYN,
    SpareKeyIssueDate,
    SpareKeyYN,
    Assignment,
    Comments,
    UpdateBy,
  } = req.body;
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("TagNumber", sql.Char, TagNumber)
      .input("PrimaryKeyIssueDate", sql.Char, PrimaryKeyIssueDate)
      .input("PrimaryKeyYN", sql.Char, PrimaryKeyYN)
      .input("GasKeyIssueDate", sql.Char, GasKeyIssueDate)
      .input("GasKeyYN", sql.Char, GasKeyYN)
      .input("SpareKeyIssueDate", sql.Char, SpareKeyIssueDate)
      .input("SpareKeyYN", sql.Char, SpareKeyYN)
      .input("Assignment", sql.Char, Assignment)
      .input("Comments", sql.Char, Comments)
      .input("UpdateBy", sql.Char, UpdateBy)
      .input("id", sql.Int, id)

      .query(UPDATE_QUERY_KEYS);

    res.status(200).json({
      status: 1,
      message: "Key Updated1 Successfully!",
      error: "",
    });
  } catch (error) {
    console.error("error while adding Keys", error);
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
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
      message: "KeyLocation Updated Successfully!",
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
