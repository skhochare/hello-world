const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");

const TABLE_NAME = "LeaveDelegates";
const TABLE_NAME2 = "CCPD_Employees";

exports.fetchData = async function (req, res) {
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

exports.add = async function (req, res) {
  const { delegates } = req.body;
  try {
    const insertQueries = delegates.map((o) => {
      const qry = `
            INSERT INTO ${TABLE_NAME}
                (Supervisor, DelegateTo, CreatedBy, CreateDate)
            VALUES
                (${o.Supervisor}, ${o.DelegateTo}, '${o.Username}', GETDATE())
        `;
      return qry;
    });

    const query = insertQueries.join(";");
    const pool = await poolPromise;
    await pool.request().query(query);
    return res.status(200).json({
      status: 1,
      data: null,
      message: "Delegates added successfully!",
      error: "",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.update = async function (req, res) {
  const { delegates } = req.body;
  try {
    const updateQueries = delegates.map((o) => {
      const qry = `
            UPDATE ${TABLE_NAME} SET
                Supervisor = ${o.Supervisor},
                DelegateTo = ${o.DelegateTo},
                UpdatedBy = ${o.Username},
                UpdateDate = GETDATE()
              WHERE
                ID = ${ID}
        `;
      return qry;
    });
    const query = updateQueries.join(";");
    const pool = await poolPromise;
    await pool.request().query(query);
    return res.status(200).json({
      status: 1,
      data: null,
      message: "Delegates updated successfully!",
      error: "",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.deleteAll = async function (req, res) {
  const { ids } = req.body;
  try {
    if (ids && ids.length) {
      const query = `DELETE FROM ${TABLE_NAME} WHERE ID IN (${ids.join()})`;
      const pool = await poolPromise;
      await pool.request().query(query);
      return res.status(200).json({
        status: 1,
        data: null,
        message: "Delegates deleted successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: null,
        message: "",
        error: "No record selected to delete.",
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

exports.delete = async function (req, res) {
  const { id } = req.params;
  try {
    const query = `DELETE FROM ${TABLE_NAME} WHERE ID = ${id}`;

    const pool = await poolPromise;
    await pool.request().query(query);
    return res.status(200).json({
      status: 1,
      data: null,
      message: "Delegates deleted successfully!",
      error: "",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.getEmployeeList = async function (req, res) {
  const empId = req.params.empId;
  const levelType = req.params.levelType;
  const qry = `
    SELECT
      CONCAT(emp.FirstName,' ',emp.LastName) as label,
      emp.EmployeeId as value,
      emp.UserName as UserName
    FROM
      ${TABLE_NAME2} emp
    WHERE
      emp.EmployeeId
        NOT IN (
          SELECT
            ld.DelegateTo
          FROM
            ${TABLE_NAME} ld
          WHERE
            ld.Supervisor=@empId
        )
    ORDER BY
      label`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("empId", sql.Int, empId)
      .input("levelType", sql.Int, levelType)
      .query(qry);
    if (result.recordsets[0]) {
      return res.status(200).json({
        status: 1,
        data: result.recordsets[0],
        message: "Success",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
        data: null,
        message: "No Records Found",
        error: "",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};

exports.getSupervisorsDelegates = async function (req, res) {
  const { id } = req.params;
  try {
    const query = `
      SELECT
        t.DelegateTo
      FROM
        ${TABLE_NAME} as t
      WHERE
        t.Supervisor = @input_id
    `;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);
    if (result && result.recordset && result.recordset.length) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Delegates fetched successfully!",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 1,
        data: [],
        message: "No delegates found!",
        error: "",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: [],
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};
