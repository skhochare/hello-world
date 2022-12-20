const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "Title";

exports.filterTitles = async function (req, res) {
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

exports.getAll = async function (req, res) {
  const query = `SELECT * FROM ${tableName} ORDER BY ID`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Title Details Fetched Successfully!",
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

exports.getSingle = async function (req, res){
  const { id } = req.params;
  const query = `SELECT * FROM ${tableName} WHERE ID = ${id}`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Title Details Fetched Successfully!",
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
}

exports.insertTitle = async function (req, res) {
  const { Title, Title_Hierarchy, Group_AS } = req.body;
  try {
    const query = `
        INSERT INTO ${tableName}
          (Title, Title_Hierarchy, Group_AS)
        VALUES
          (@input_title, @input_title_hierarchy, @input_group_as);
      `;
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_title", sql.Char, Title)
      .input("input_title_hierarchy", sql.Int, Title_Hierarchy)
      .input("input_group_as", sql.Char, Group_AS)
      .query(query);

    res.status(200).json({
      status: 1,
      message: "Title Details Inserted Successfully!",
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

exports.updateTitle = async function (req, res) {
  const { id } = req.params;
  const { Title, Title_Hierarchy, Group_AS } = req.body;

  try {
    const pool = await poolPromise;
    const query = `
        UPDATE  ${tableName} SET
            Title = @input_title, 
            Title_Hierarchy = @input_title_hierarchy,   
            Group_AS = @input_group_as
        WHERE 
            ID = ${id};
    `;
    
    await pool
      .request()
      .input("input_title", sql.Char, Title)
      .input("input_title_hierarchy", sql.Int, Title_Hierarchy)
      .input("input_group_as", sql.Char, Group_AS)
      .query(query);

    res.status(200).json({
      status: 1,
      message: "Title details Updated Successfully!",
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

exports.deleteTitle = async function (req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const query = `
        DELETE FROM ${tableName}
        WHERE ID = ${id}`;
    await pool.request().query(query);

    res.status(200).json({
      status: 1,
      message: "Title details Deleted Successfully!",
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
