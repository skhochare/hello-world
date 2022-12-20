const { sql, poolPromise } = require("../../config/mssql_hr.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const tableName = "Handgun";
const Equipment_Table = "Equipment_types";
const tableNameHandgunEmployee = "EmployeeHandgunLog";

exports.fetchGuns = async function (req, res) {
  const { page, table, primaryKey } = req.body;
  const pId = primaryKey ? primaryKey : null;
  const payload = { ...req.body };
  //   const query = `SELECT  [Handgun].[Id]
  //   ,[SerialNumber]
  //   ,[Availabilty_Status]
  //   ,[Handgun].[Flag]
  //   ,[created_date]
  //   ,[created_by]
  //   ,[updated_date]
  //   ,[updated_by]
  //   ,[Equipment_type_id],[Equipment_types].[Name]
  // FROM [CCPDEmployeesDev].[dbo].[Handgun]
  // LEFT JOIN [Equipment_types] ON [Equipment_types].[Id] = Equipment_type_id`;
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

exports.getGun = async function (req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      *
    FROM
      ${tableName} AS h
    WHERE
      h.Id = @input_id
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
        message: "Handgun Fetched Successfully!",
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

exports.getList = async function (req, res) {
  const { includeNotAvailable, includeDeleted } = req.params;
  const whereArr = [`Flag = 0`, `Availabilty_Status = 'Available'`];
  if (includeNotAvailable && includeNotAvailable === "true") {
    whereArr.push(`Availabilty_Status = 'Not-Available'`);
  }
  if (includeDeleted && includeDeleted === "true") {
    whereArr.push(`Flag = 1`);
  }
  const query = `
    SELECT
      h.SerialNumber AS label,
      h.Id AS value
    FROM
      ${tableName} AS h
    WHERE
      ${whereArr.join(" AND ")}
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Success",
        error: "",
      });
    } else {
      return res.status(200).json({
        status: 0,
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

exports.addGun = async function (req, res) {
  const { SerialNumber, Availabilty_Status, Username, Equipment_type_id } =
    req.body;
  const uniqueQuery = `SELECT COUNT(Id) AS cnt FROM ${tableName} AS h WHERE h.SerialNumber = @input_serial_number`;
  const query = `
    INSERT INTO ${tableName}
      (SerialNumber, Availabilty_Status, Flag, created_date, created_by, updated_date, updated_by,Equipment_type_id)
    VALUES
      (@input_serial_number, @input_availability_status, 0, GETDATE(), @input_created_by, GETDATE(), @input_updated_by,@Equipment_type_id)
  `;
  try {
    const pool = await poolPromise;
    const uniqueResult = await pool
      .request()
      .input("input_serial_number", sql.Char, SerialNumber)

      .query(uniqueQuery);
    const {
      recordset: [row],
    } = uniqueResult;
    if (row && row.cnt <= 0) {
      await pool
        .request()
        .input("input_serial_number", sql.Char, SerialNumber)
        .input("input_availability_status", sql.Char, Availabilty_Status)
        .input("input_created_by", sql.Char, Username)
        .input("input_updated_by", sql.Char, Username)
        .input("Equipment_type_id", sql.Int, Equipment_type_id)
        .query(query);
      res.status(200).json({
        status: 1,
        message: "Handgun Inserted Successfully!",
        error: "",
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "",
        error: "Serial number already exists!",
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

exports.updateGun = async function (req, res) {
  const { id } = req.params;
  const { SerialNumber, Availabilty_Status, Username, Equipment_type_id } =
    req.body;
  const uniqueQuery = `SELECT Id FROM ${tableName} AS h WHERE h.SerialNumber = @input_serial_number`;
  const query = `
    UPDATE
      ${tableName}
    SET
      SerialNumber = @input_serial_number,
      Availabilty_Status = @input_availability_status,
      updated_date = GETDATE(),
      updated_by = @input_updated_by,
      Equipment_type_id = @Equipment_type_id
    WHERE
      Id = @input_id
  `;
  try {
    const pool = await poolPromise;
    const uniqueResult = await pool
      .request()
      .input("input_serial_number", sql.Char, SerialNumber)
      .query(uniqueQuery);
    const {
      recordset: [row],
    } = uniqueResult;
    if (!row || (row && row.Id === parseInt(req.params.id))) {
      await pool
        .request()
        .input("input_serial_number", sql.Char, SerialNumber)
        .input("input_availability_status", sql.Char, Availabilty_Status)
        .input("input_updated_by", sql.Char, Username)
        .input("input_id", sql.Int, id)
        .input("Equipment_type_id", sql.Int, Equipment_type_id)

        .query(query);
      res.status(200).json({
        status: 1,
        message: "Handgun Updated Successfully!",
        error: "",
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "",
        error: "Serial number already exists!",
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

exports.softDeleteGun = async function (req, res) {
  const { id } = req.params;
  const { Username } = req.body;
  const query = `
    UPDATE
      ${tableName}
    SET
      Flag = 1,
      updated_date = GETDATE(),
      updated_by = @input_updated_by
    WHERE
      Id = @input_id
  `;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_updated_by", sql.Char, Username)
      .input("input_id", sql.Int, id)
      .query(query);
    res.status(200).json({
      status: 1,
      message: "Handgun Deleted Successfully",
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

exports.revertDeleteGun = async function (req, res) {
  const { id } = req.params;
  const { Username } = req.body;
  const query = `
    UPDATE
      ${tableName}
    SET
      Flag = 0,
      updated_date = GETDATE(),
      updated_by = @input_updated_by
    WHERE
      Id = @input_id
  `;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_updated_by", sql.Char, Username)
      .input("input_id", sql.Int, id)
      .query(query);
    res.status(200).json({
      status: 1,
      message: "Handgun Reverted Successfully",
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

exports.revertEquipmentType = async function (req, res) {
  const { id } = req.params;
  const { Username } = req.body;
  const query = `
    UPDATE
      ${Equipment_Table}
    SET
      Flag = 0
    WHERE
      Id = @input_id
  `;
  try {
    const pool = await poolPromise;
    await pool.request().input("input_id", sql.Int, id).query(query);
    res.status(200).json({
      status: 1,
      message: "Equipment Type Reverted Successfully",
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

exports.serialNumberUnique = async function (req, res) {
  const { Id, SerialNumber } = req.body;
  const query = `
    SELECT
      Id
    FROM
      ${tableName} AS h
    WHERE
      h.SerialNumber = @input_serial_number`;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_serial_number", sql.Char, SerialNumber)
      .query(query);
    const {
      recordset: [row],
    } = result;
    if (!row || (row && row.Id === parseInt(Id))) {
      res.json({
        status: 1,
        message: "It is unique serial number",
        error: "",
      });
    } else {
      res.json({
        status: 0,
        message: "",
        error: "Serial number already exists!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 0,
      message: "",
      error: "Something went wrong! Please try again later.",
    });
  }
};

exports.getListByEmployee = async function (req, res) {
  const { id } = req.params;
  const employeeGunQuery = `
    SELECT
      h.SerialNumber AS label,
      h.Id AS value,
      h.Equipment_type_id AS EquipmentTypeId,
	    et.Name AS EquipmentName
    FROM
      ${tableName} AS h
    LEFT JOIN
      ${Equipment_Table} AS et
    ON
      et.Id = h.Equipment_type_id
    WHERE
      h.Id IN (
        SELECT
          he.HandgunId
        FROM
          ${tableNameHandgunEmployee} AS he
        WHERE
          he.Action = 0 AND he.ReturnId = 0 AND he.EmployeeId = @input_id
      )
  `;
  const query = `
    SELECT
      h.SerialNumber AS label,
      h.Id AS value,
      h.Equipment_type_id AS EquipmentTypeId,
	    et.Name AS EquipmentName
    FROM
      ${tableName} AS h
    LEFT JOIN
      ${Equipment_Table} AS et
    ON
      et.Id = h.Equipment_type_id
    WHERE
      h.Id NOT IN (
        SELECT
          he.HandgunId
        FROM
          ${tableNameHandgunEmployee} AS he
        WHERE
          he.Action = 0 AND he.ReturnId = 0
      ) AND h.Availabilty_Status = 'Available' AND h.Flag = 0
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(employeeGunQuery);
    if (result && result.recordset) {
      if (result.recordset.length <= 0) {
        const result1 = await pool.request().query(query);
        if (result1 && result1.recordset) {
          return res.status(200).json({
            status: 1,
            data: result1.recordset,
            action: 0,
            message: "Success",
            error: "",
          });
        } else {
          return res.status(200).json({
            status: 0,
            message: "",
            error: "Something went wrong! Please try again later.",
          });
        }
      } else {
        return res.status(200).json({
          status: 1,
          data: result.recordset,
          action: 1,
          message: "Success",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 0,
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

exports.getListByEmployeeAndEquipementType = async function (req, res) {
  const { id, equipmenttypeid } = req.params;
  const employeeGunQuery = `
    SELECT
      h.SerialNumber AS label,
      h.Id AS value
    FROM
      ${tableName} AS h
    WHERE
      h.Id IN (
        SELECT
          he.HandgunId
        FROM
          ${tableNameHandgunEmployee} AS he
        WHERE
          he.Action = 0 AND he.ReturnId = 0 AND he.EmployeeId = @input_id AND he.EquipmentType_id = ${equipmenttypeid}
      )
  `;
  const query = `
    SELECT
      h.SerialNumber AS label,
      h.Id AS value
    FROM
      ${tableName} AS h
    WHERE
      h.Id NOT IN (
        SELECT
          he.HandgunId
        FROM
          ${tableNameHandgunEmployee} AS he
        WHERE
          he.Action = 0 AND he.ReturnId = 0 AND he.EquipmentType_id = ${equipmenttypeid}
      ) AND h.Availabilty_Status = 'Available' AND Flag = 0
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(employeeGunQuery);
    if (result && result.recordset) {
      if (result.recordset.length <= 0) {
        const result1 = await pool.request().query(query);
        if (result1 && result1.recordset) {
          return res.status(200).json({
            status: 1,
            data: result1.recordset,
            action: 0,
            message: "Success",
            error: "",
          });
        } else {
          return res.status(200).json({
            status: 0,
            message: "",
            error: "Something went wrong! Please try again later.",
          });
        }
      } else {
        return res.status(200).json({
          status: 1,
          data: result.recordset,
          action: 1,
          message: "Success",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 0,
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

exports.addEquipment = async function (req, res) {
  const accessQuery = `
    INSERT INTO [Equipment_types](Name, Status,Flag)
    VALUES (@Name, @Status,@Flag)
  `;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Name", sql.VarChar, req.body.Name)
      .input("Status", sql.Int, req.body.Status)
      .input("Flag", sql.Int, req.body.Flag)
      .query(accessQuery);

    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.updateEquipment = async function (req, res) {
  const accessQuery = `
  UPDATE [Equipment_types] SET [Name] =@Name,  [Status]=@Status, [Flag]=@Flag WHERE 
  [Id] = @Id`;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Name", sql.VarChar, req.body.Name)
      .input("Status", sql.Int, req.body.Status)
      .input("Flag", sql.Int, req.body.Flag)
      .input("Id", sql.Int, req.body.Id)
      .query(accessQuery);

    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.eqpdelete = async function (req, res) {
  const accessQuery = `
  UPDATE [Equipment_types] SET  [Flag]= 1 WHERE 
  [Id] = @Id`;

  try {
    const pool = await poolPromise;
    await pool.request().input("Id", sql.Int, req.body.Id).query(accessQuery);

    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getEquipmentDetail = async function (req, res) {
  const { id } = req.params;
  const list = `
    SELECT
      *
    FROM
      ${Equipment_Table} WHERE Id = @input_id And Flag !=  @input_flag`

  try {
    const pool = await poolPromise;
    const result = await pool.request().input('input_id', sql.Int, id).input('input_flag', sql.Int, 1).query(list);
    if (result && result.recordset) {
      if (result.recordset.length > 0) {
        return res.status(200).json({
          status: 1,
          data: result.recordset[0],
          message: "Handgun Fetch Successfully",
          error: "",
        });       
      } else {
        return res.status(200).json({
          status: 1,
          data: null,
          message: "No Record Found",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 0,
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};

exports.getAllEquipmentDetail = async function (req, res) {
  const query = `SELECT Name AS label,Id AS value FROM  ${Equipment_Table} where status = 0`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      if (result.recordset.length <= 0) {
        const result1 = await pool.request().query(query);
        if (result1 && result1.recordset) {
          return res.status(200).json({
            status: 1,
            data: result1.recordset,
            action: 0,
            message: "Success",
            error: "",
          });
        } else {
          return res.status(200).json({
            status: 0,
            message: "",
            error: "Something went wrong! Please try again later.",
          });
        }
      } else {
        return res.status(200).json({
          status: 1,
          data: result.recordset,
          action: 1,
          message: "Success",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 0,
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};

exports.getAllEquipmentDetailAll = async function (req, res) {
  const query = `SELECT Name AS label,Id AS value FROM  ${Equipment_Table}`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      if (result.recordset.length <= 0) {
        const result1 = await pool.request().query(query);
        if (result1 && result1.recordset) {
          return res.status(200).json({
            status: 1,
            data: result1.recordset,
            action: 0,
            message: "Success",
            error: "",
          });
        } else {
          return res.status(200).json({
            status: 0,
            message: "",
            error: "Something went wrong! Please try again later.",
          });
        }
      } else {
        return res.status(200).json({
          status: 1,
          data: result.recordset,
          action: 1,
          message: "Success",
          error: "",
        });
      }
    } else {
      return res.status(200).json({
        status: 0,
        message: "",
        error: "Something went wrong! Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};
