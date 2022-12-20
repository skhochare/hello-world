const { poolPromise, sql } = require("../../config/mssql_hr.config");

exports.getModules = async (req, res) => {
  const query = `
    SELECT
      *
    FROM
    Modules
    WHERE IsActive = 1 
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result && result.recordset) {
      return res.json(result.recordset);
    }
    return res.json("Something went wrong");
  } catch (error) {
    console.log(error);
    return null;
  }
};
exports.addTitleModules = async (req, res) => {
  const {
    Title,
    EmployeeId,
    Modules,
    EModules,
    AccessRight,
    UserName,
    IsNotRole,
  } = req.body;

  //console.log(Modules, EModules);
  let deleteQuery = "";
  const pool = await poolPromise;
  try {
    const selectQuery = `SELECT AccessRight FROM  TitlesModules Where TitleId=${Title} AND EmployeeId IS NULL`;
    const selResp =  await pool.request().query(selectQuery);
    console.log(selResp.recordset[0],"....................")
    if (EmployeeId && Title && EModules) {
      deleteQuery = `DELETE from TitlesModules WHERE EmployeeId=${EmployeeId} AND TitleId=${Title}`;
      await pool.request().query(deleteQuery);
    }
    if (EmployeeId && Title && Modules && !IsNotRole) {
      deleteQuery = `DELETE from TitlesModules WHERE TitleId=${Title} AND EmployeeId IS NULL `;
      await pool.request().query(deleteQuery);
    }
    if (!EmployeeId && Title && Modules){
      deleteQuery = `DELETE from TitlesModules WHERE TitleId=${Title} AND EmployeeId IS NULL `;
      await pool.request().query(deleteQuery);
    }
    let result = null;
    console.log(EModules, typeof EModules,"Hi")
    if (Modules && EModules.length == 0 ) {
      console.log("first............")
      result = this.insertModuleData(
        Title ,
        Modules,
        null,
        AccessRight,
        UserName
      );
    }
    else if(Modules && EModules.length > 0){
      console.log("second............")
      const aR = JSON.parse(selResp.recordset[0].AccessRight)
      result = this.insertModuleData(
        Title ,
        Modules,
        null,
        aR,
        UserName
      );
    }
    if (EModules) {
      console.log("third............")
      result = this.insertModuleData(
        Title,
        EModules,
        EmployeeId,
        AccessRight,
        UserName
      );
    }
    return res.json(result);
  } catch (error) {
    return res.json(error);
  }
};

exports.insertModuleData = async (
  Title,
  Modules,
  EmployeeId,
  AccessRight,
  UserName
) => {
  var query = `insert into TitlesModules (
    TitleId, ModuleId, EmployeeId, AccessRight, IsActive, UpdatedBy, CreatedAt, UpdatedAt
  ) values (
    @titleId, @moduleId, @employeeId, @accessRight, @status, @updatedby, @createdAt, @updatedAt
  );`;
  try {
    let result = null;
    const pool = await poolPromise;
    if (Modules) {
      for (let i = 0; i < Modules.length; i++) {
        result = await pool
          .request()
          .input("titleId", sql.BigInt, Title)
          .input("moduleId", sql.BigInt, Modules[i])
          .input("employeeId", sql.BigInt, EmployeeId ? EmployeeId : null)
          .input("accessRight", sql.Text, JSON.stringify(AccessRight))
          .input("status", sql.BigInt, 1)
          .input("updatedby", sql.Text, UserName)
          .input("createdAt", sql.DateTime2, new Date())
          .input("updatedAt", sql.DateTime2, new Date())
          .query(query);
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.fetchTitleModules = async (req, res) => {
  const { title, empId } = req.params;
  let data = [];
  let query = `
      SELECT
       tm.*,
        CONCAT('',(SELECT Title from Title WHERE ID=tm.TitleId)) as label
      FROM
      TitlesModules as tm
      Where IsActive = 1
    `;
  let query3 = query;
  if (title != "null") {
    query += ` AND TitleId=${title} AND EmployeeId IS NULL`;
  }
  if (empId != "null" && title == "null") {
    query += ` AND EmployeeId=${empId}`;
  }
  if (empId != "null" && title != "null") {
    const query2 = ` SELECT
                tm.*,
              CONCAT('',(SELECT Title from Title WHERE ID=tm.TitleId)) as label
              FROM
              TitlesModules as tm
              Where IsActive = 1 AND TitleId=${title} AND EmployeeId = ${empId} `;
    try {
      const pool = await poolPromise;
      const result2 = await pool.request().query(query2);
      if (result2 && result2.recordset) {
        data = result2.recordset;
      }
    } catch (error) {
      console.log(error);
    }
  }

  try {
    let empRecords = null;
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const query4 = `SELECT Title2, (SELECT Title from Title Where ID=CCPD_Employees.Title2) as Title FROM CCPD_Employees WHERE EmployeeId=${empId}`;
    const empRes = await pool.request().query(query4);
    empRecords = empRes.recordset[0];
    if (result && result.recordset) {
      let records = [];
      if (empId != "null" && title == "null") {
        const d = result.recordset[0];
        if (d) {
          query3 += ` AND TitleId=${d.TitleId} AND EmployeeId IS NULL`;
          const rec = await pool.request().query(query3);
          records = rec.recordset;
        }
      }
      res.json({
        TitleId: empRecords && empRecords.Title2,
        Title: empRecords && empRecords.Title,
        Module: [...result.recordset, ...data, ...records],
      });
    }
    return null;
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
