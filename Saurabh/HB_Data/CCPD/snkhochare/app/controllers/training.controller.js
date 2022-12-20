const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "Training";
const childTableName = "TrainingMembers";
const employeeTable = "CCPD_Employees";

exports.filterTrainings = async function (req, res) {
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

exports.getTrainingDetails = async function (req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const query = `SELECT * FROM ${tableName} WHERE id = @input_id`;
    const query2 = `SELECT EmployeeId FROM ${childTableName} WHERE TrainingId = @input_id`;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);

    const result2 = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query2);

    if (result && result.recordset && result.recordset[0]) {
      return res.status(200).json({
        status: 1,
        data: {
          ...result.recordset[0],
          EmployeeIds: result2.recordset.map((item) => item.EmployeeId),
        },
        message: "Employee training details Fetched Successfully!",
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

exports.updateTrainingDetails = async function (req, res) {
  const { id } = req.params;
  const {
    Title,
    Description,
    StartDate,
    EndDate,
    EmployeeId,
    UserId,
    EmployeeIds,
    Location,
    TrainingHours,
  } = req.body;

  try {
    const pool = await poolPromise;
    const query = `
      UPDATE  ${tableName} SET
        Title = @input_title, 
        Description =  @input_description, 
        StartDate = @input_start_date, 
        EndDate = @input_end_date, 
        EmployeeId = @input_employee_id,   
        UpdatedBy = @input_updated_by,
        UpdatedAt = GETDATE(),
        Location = @input_location,
        TrainingHours = @input_training_hours
      WHERE 
        Id = @input_id;
    `;
    const query2 = `
      DELETE FROM ${childTableName}
      WHERE TrainingId = @input_id;
    `;

    await pool
      .request()
      .input("input_id", sql.Int, id)
      .input("input_title", sql.Char, Title)
      .input("input_description", sql.Char, Description)
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("input_employee_id", sql.Int, EmployeeId)
      .input("input_updated_by", sql.Int, UserId)
      .input("input_location", sql.Char, Location)
      .input("input_training_hours", sql.Int, TrainingHours)
      .query(query);

    await pool.request().input("input_id", sql.Int, id).query(query2);

    const tbl = new sql.Table(childTableName);
    tbl.columns.add("TrainingId", sql.Int, { nullable: false });
    tbl.columns.add("EmployeeId", sql.Int, { nullable: false });
    EmployeeIds.forEach((o) => {
      tbl.rows.add(id, o);
    });
    const request = new sql.Request(pool);
    await request.bulk(tbl);

    res.status(200).json({
      status: 1,
      message: "Employee Training details Updated Successfully!",
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

exports.deleteTrainingDetails = async function (req, res) {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const query2 = `
      DELETE FROM ${childTableName}
      WHERE TrainingId = @input_id;
    `;
    await pool.request().input("input_id", sql.Int, id).query(query2);

    const query = `
      DELETE FROM ${tableName}
      WHERE id = @input_id;
    `;
    await pool.request().input("input_id", sql.Int, id).query(query);

    res.status(200).json({
      status: 1,
      message: "Employee Training details Deleted Successfully!",
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

exports.addTraining = async function (req, res) {
  const {
    Title,
    Description,
    StartDate,
    EndDate,
    EmployeeId,
    UserId,
    EmployeeIds,
    Location,
    TrainingHours,
  } = req.body;

  try {
    const query = `
      INSERT INTO ${tableName}
        (Title, Description, StartDate, EndDate, EmployeeId, CreatedBy, CreatedAt, Location, TrainingHours)
      VALUES
        (@input_title, @input_description, @input_start_date, @input_end_date, @input_employee_id, @input_created_by, GETDATE(), @input_location, @input_training_hours);

        SELECT @@IDENTITY AS 'identity'
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_title", sql.Char, Title)
      .input("input_description", sql.Char, Description)
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .input("input_employee_id", sql.Int, EmployeeId)
      .input("input_created_by", sql.Int, UserId)
      .input("input_location", sql.Char, Location)
      .input("input_training_hours", sql.Int, TrainingHours)
      .query(query);

    const insertedId =
      result &&
      result.recordset &&
      result.recordset[0] &&
      result.recordset[0].identity
        ? result.recordset[0].identity
        : null;
    if (insertedId) {
      const tbl = new sql.Table(childTableName);
      tbl.columns.add("TrainingId", sql.Int, { nullable: false });
      tbl.columns.add("EmployeeId", sql.Int, { nullable: false });
      EmployeeIds.forEach((o) => {
        tbl.rows.add(insertedId, o);
      });
      const request = new sql.Request(pool);
      await request.bulk(tbl);

      return res.status(200).json({
        status: 1,
        data: insertedId,
        message: "Employee Training Details Inserted Successfully!",
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
    res.status(500).json({
      status: 0,
      data: null,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getTrainingByDateRange = async function (req, res) {
  const { StartDate, EndDate, loggedInUserId } = req.body;
  try {
    const query = `
      SELECT
        t.*,
        e.FirstName,
        e.LastName,
        CONCAT(e.LastName, ', ', e.FirstName, ', ', tl.Title, ' [', e.BadgeNumber, ']') AS FullNameWithBadge,
        e.HireDate
      FROM
        ${tableName} AS t
      LEFT JOIN
        ${employeeTable} as e
      ON
        t.EmployeeId = e.EmployeeId
      LEFT JOIN
        Title as tl
      ON
        tl.ID = e.Title2
      WHERE
        ((t.StartDate >= @input_start_date AND t.StartDate <= @input_end_date) OR (t.EndDate >= @input_start_date))
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(query);
    if (result && result.recordset && result.recordset.length) {
      const trainingIds = result.recordset.map((o) => o.Id).join();
      const childQuery = `
        SELECT
          tm.TrainingId,
          tm.EmployeeId
        FROM
          ${childTableName} AS tm
        WHERE
          tm.TrainingId IN (${trainingIds})
      `;
      const childResult = await pool.request().query(childQuery);
      if (
        childResult &&
        childResult.recordset &&
        childResult.recordset.length
      ) {
        const data = [];
        const filteredTrainings = childResult.recordset
          .filter((o) => o.EmployeeId === loggedInUserId)
          .map((o) => o.TrainingId);
        const remainingTrainings = result.recordset
          .filter((o) => !filteredTrainings.includes(o.Id))
          .filter((o) => o.EmployeeId === loggedInUserId)
          .map((o) => o.Id);
        const allRecords = [...filteredTrainings, ...remainingTrainings];

        result.recordset
          .filter((o) => allRecords.indexOf(o.Id) !== -1)
          .forEach((e) => {
            const obj = { ...e };
            const filteredChildren = childResult.recordset.filter(
              (o) => o.TrainingId == e.Id
            );
            if (filteredChildren && filteredChildren.length) {
              obj.members = filteredChildren;
            } else {
              obj.members = [];
            }
            data.push(obj);
          });
        return res.status(200).json({
          status: 1,
          data,
          message: "Data found",
          error: "",
        });
      } else {
        const data = result.recordset.map((o) => ({ ...o, members: [] }));
        return res.status(200).json({
          status: 1,
          data,
          message: "Data found",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 1,
        data: [],
        message: "No data found",
        error: "",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: [],
      message: "",
      error,
    });
  }
};

exports.getAllTrainingsByDateRange = async function (req, res) {
  const { StartDate, EndDate } = req.body;
  try {
    const query = `
      SELECT
        t.*,
        e.FirstName,
        e.LastName,
        CONCAT(e.LastName, ', ', e.FirstName, ', ', tl.Title, ' [', e.BadgeNumber, ']') AS FullNameWithBadge,
        e.HireDate
      FROM
        ${tableName} AS t
      LEFT JOIN
        ${employeeTable} as e
      ON
        t.EmployeeId = e.EmployeeId
      LEFT JOIN
        Title as tl
      ON
        tl.ID = e.Title2
      WHERE
        ((t.StartDate >= @input_start_date AND t.StartDate <= @input_end_date) OR (t.EndDate >= @input_start_date))
    `;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_start_date", sql.DateTime2, StartDate)
      .input("input_end_date", sql.DateTime2, EndDate)
      .query(query);
    if (result && result.recordset && result.recordset.length) {
      const trainingIds = result.recordset.map((o) => o.Id).join();
      const childQuery = `
        SELECT
          tm.TrainingId,
          tm.EmployeeId
        FROM
          ${childTableName} AS tm
        WHERE
          tm.TrainingId IN (${trainingIds})
      `;
      const childResult = await pool.request().query(childQuery);
      if (
        childResult &&
        childResult.recordset &&
        childResult.recordset.length
      ) {
        const data = [];

        result.recordset.forEach((e) => {
          const obj = { ...e };
          const filteredChildren = childResult.recordset.filter(
            (o) => o.TrainingId == e.Id
          );
          if (filteredChildren && filteredChildren.length) {
            obj.members = filteredChildren;
          } else {
            obj.members = [];
          }
          data.push(obj);
        });
        return res.status(200).json({
          status: 1,
          data,
          message: "Data found",
          error: "",
        });
      } else {
        const data = result.recordset.map((o) => ({ ...o, members: [] }));
        return res.status(200).json({
          status: 1,
          data,
          message: "Data found",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 1,
        data: [],
        message: "No data found",
        error: "",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      data: [],
      message: "",
      error,
    });
  }
};
