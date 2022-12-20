const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "EmployeeHandgunLog";
const ccpdEmpTableName = "CCPD_Employees";

exports.fetchGunEmployeeLogs = async function (req, res) {
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

exports.addLog = async function (req, res) {
  const {
    EmployeeId,
    HandgunId,
    Action,
    AuthByUsername,
    Reason_Surrendered,
    Username,
    EquipmentType_id,
  } = req.body;
  const insertQuery = `
    INSERT INTO ${tableName}
      (EmployeeId, HandgunId, Action, ActionTime, ReturnId, AuthByUsername, Reason_Surrendered, CreatedBy, CreatedDate, CreatedById,EquipmentType_id)
    VALUES
      (@input_employee_id, @input_handgun_id, @input_action, GETDATE(), 0, @input_auth_by, @input_reason, @input_created_by, GETDATE(), @input_created_by_id,@EquipmentType_id);

    SELECT
      @@IDENTITY AS 'identity'
  `;
  const selectEmployeeCheckoutRecord = `
    SELECT
      he.Id
    FROM
      ${tableName} AS he
    WHERE
      he.Action = 0 AND he.ReturnId = 0 AND he.EmployeeId = @input_id
  `;
  const updateEmployeeCheckoutRecord = `
    UPDATE
      ${tableName}
    SET
      ReturnId = @input_return_id
    WHERE
      Id = @input_id
  `;

  const getUserIdByNameQuery = `
    SELECT
      EmployeeId
    FROM
      ${ccpdEmpTableName}
    WHERE
      UserName = @input_username
  `;

  try {
    const pool = await poolPromise;
    const userResult = await pool
      .request()
      .input("input_username", sql.Char, Username)
      .query(getUserIdByNameQuery);
    const UserId =
      userResult.recordset &&
      userResult.recordset[0] &&
      userResult.recordset[0].EmployeeId
        ? userResult.recordset[0].EmployeeId
        : null;
    const result = await pool
      .request()
      .input("input_employee_id", sql.Int, EmployeeId)
      .input("input_handgun_id", sql.Int, HandgunId)
      .input("input_action", sql.Int, Action)
      .input("input_auth_by", sql.Char, AuthByUsername)
      .input("input_reason", sql.Char, Reason_Surrendered)
      .input("input_created_by", sql.Char, Username)
      .input("input_created_by_id", sql.Int, UserId)
      .input("EquipmentType_id", sql.Int, EquipmentType_id)
      .query(insertQuery);
    const insertedId =
      result &&
      result.recordset &&
      result.recordset[0] &&
      result.recordset[0].identity
        ? result.recordset[0].identity
        : null;
    if (insertedId) {
      if (Action === 1) {
        const selectResult = await pool
          .request()
          .input("input_id", sql.Int, EmployeeId)
          .query(selectEmployeeCheckoutRecord);
        if (
          selectResult &&
          selectResult.recordset &&
          selectResult.recordset.length > 0
        ) {
          const { Id } = selectResult.recordset[0];
          await pool
            .request()
            .input("input_return_id", sql.Int, insertedId)
            .input("input_id", sql.Int, Id)
            .query(updateEmployeeCheckoutRecord);
          res.status(200).json({
            status: 1,
            message: "Handgun check-in successfully!",
            error: "",
          });
        } else {
          res.status(200).json({
            status: 0,
            message: "",
            error: "Handgun check-in process interrupted!",
          });
        }
      } else {
        res.status(200).json({
          status: 1,
          message: "Handgun check-out successfully!",
          error: "",
        });
      }
    } else {
      res.status(200).json({
        status: 0,
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later." + error,
    });
  }
};
