const { sql, poolPromise } = require("../../config/mssql_hr.config");
const tableName = "Emp_Unit_Schedule";
const tblEmployees = "CCPD_Employees";
const EmployeeLeaves = "EmployeeLeaves";
const Emp_Unit_Schedule = "Emp_Unit_Schedule";
const employeeLeaveReasonsTable = "EmployeeLeaveReasons";
const employeeLeaveAccuralsTable = "EmployeeLeave_Accruals";
var moment = require("moment");

exports.getScheduleByTypeAndTypeId = async function (req, res) {
  const { type, typeId } = req.params;
  const columns = [
    "tbl.ID AS ID",
    "tbl.Type AS Type",
    "tbl.Starttime AS Starttime",
    "tbl.Endtime AS Endtime",
    "tbl.ShiftMins AS ShiftMins",
    "tbl.Day AS Day",
    "tbl.IsOffDay AS IsOffDay",
  ];
  const whereArr = ["tbl.Type = @input_type"];
  switch (type) {
    case "E":
      columns.push("tbl.EmpId AS TypeId");
      whereArr.push("tbl.EmpId = @input_type_id");
      break;
    case "U":
      columns.push("tbl.UnitId AS TypeId");
      whereArr.push("tbl.UnitId = @input_type_id");
      break;
  }
  const query = `
    SELECT
      ${columns.join(",")}
    FROM
      ${tableName} AS tbl
    WHERE
      ${whereArr.join(" AND ")}
    ORDER BY Day ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_type", sql.Char, type)
      .input("input_type_id", sql.Int, typeId)
      .query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Schedule Fetched Successfully!",
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

exports.addSchedule = async function (req, res) {
  const { schedules } = req.body;
  const [first] = schedules;
  try {
    let _schedules = [];
    if (first && first.Type && first.Type === "E") {
      const unitSchedules = await getUnitScheduleByEmployeeId(first.EmpId);
      if (unitSchedules && unitSchedules.length) {
        _schedules = schedules.map((s, i) => {
          const obj = { ...s };
          if (!s.Starttime && !s.Endtime && !s.IsOffDay) {
            if (
              unitSchedules.length > i &&
              unitSchedules[i] &&
              unitSchedules[i].Starttime &&
              unitSchedules[i].Endtime
            ) {
              obj.IsOffDay = unitSchedules[i].IsOffDay ? 1 : 0;
              obj.Starttime = unitSchedules[i].Starttime;
              obj.Endtime = unitSchedules[i].Endtime;
              obj.ShiftMins = unitSchedules[i].ShiftMins;
            } else {
              obj.IsOffDay = 1;
              obj.Starttime = null;
              obj.Endtime = null;
              obj.ShiftMins = null;
            }
          }
          return obj;
        });
      } else {
        _schedules = schedules.map((s) => {
          const obj = { ...s };
          if (!s.Starttime && !s.Endtime) {
            obj.IsOffDay = 1;
            obj.Starttime = null;
            obj.Endtime = null;
            obj.ShiftMins = null;
          }
          return obj;
        });
      }
    } else if (first && first.Type && first.Type === "U") {
      _schedules = schedules.map((s) => {
        const obj = { ...s };
        if (!s.Starttime && !s.Endtime) {
          obj.IsOffDay = 1;
          obj.Starttime = null;
          obj.Endtime = null;
          obj.ShiftMins = null;
        }
        return obj;
      });
    }
    const insertQueries = [];
    _schedules.forEach((o, i) => {
      insertQueries.push(`
        INSERT INTO ${tableName}
          (UnitId, EmpId, Type, Starttime, Endtime, ShiftMins, Createdby, Createddate, Day, IsOffDay)
        VALUES
          (
            ${o.UnitId},
            ${o.EmpId},
            '${o.Type}',
            ${o.Starttime ? "'" + o.Starttime + "'" : null},
            ${o.Endtime ? "'" + o.Endtime + "'" : null},
            ${o.ShiftMins},
            ${o.Createdby ? "'" + o.Createdby + "'" : null},
            GETDATE(),
            ${i},
            ${o.IsOffDay}
          )
      `);
    });
    const insertQuery = insertQueries.join(";");
    const pool = await poolPromise;
    await pool.request().query(insertQuery);
    return res.status(200).json({ status: 1 });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};

exports.updateSchedule = async function (req, res) {
  const { schedules, Username } = req.body;
  const [first] = schedules;
  const queryReasons = `
    SELECT
      ReasonCode,
      RequestedHours
    FROM
      ${employeeLeaveReasonsTable}
    WHERE
      EmployeeLeaveId = @input_id
  `;
  try {
    let _schedules = [];
    if (first && first.Type && first.Type === "E") {
      const unitSchedules = await getUnitScheduleByEmployeeId(first.EmpId);
      if (unitSchedules && unitSchedules.length) {
        _schedules = schedules.map((s, i) => {
          const obj = { ...s };
          if (!s.Starttime && !s.Endtime && !s.IsOffDay) {
            if (
              unitSchedules.length > i &&
              unitSchedules[i] &&
              unitSchedules[i].Starttime &&
              unitSchedules[i].Endtime
            ) {
              obj.IsOffDay = unitSchedules[i].IsOffDay ? 1 : 0;
              obj.Starttime = unitSchedules[i].Starttime;
              obj.Endtime = unitSchedules[i].Endtime;
              obj.ShiftMins = unitSchedules[i].ShiftMins;
            } else {
              obj.IsOffDay = 1;
              obj.Starttime = null;
              obj.Endtime = null;
              obj.ShiftMins = null;
            }
          }
          return obj;
        });
      } else {
        _schedules = schedules.map((s) => {
          const obj = { ...s };
          if (!s.Starttime && !s.Endtime) {
            obj.IsOffDay = 1;
            obj.Starttime = null;
            obj.Endtime = null;
            obj.ShiftMins = null;
          }
          return obj;
        });
      }
    } else if (first && first.Type && first.Type === "U") {
      _schedules = schedules.map((s) => {
        const obj = { ...s };
        if (!s.Starttime && !s.Endtime) {
          obj.IsOffDay = 1;
          obj.Starttime = null;
          obj.Endtime = null;
          obj.ShiftMins = null;
        }
        return obj;
      });
    }
    const updateQueries = [];
    _schedules.forEach((o, i) => {
      updateQueries.push(`
        UPDATE ${tableName} SET
          Starttime = ${o.Starttime ? "'" + o.Starttime + "'" : null},
          Endtime = ${o.Endtime ? "'" + o.Endtime + "'" : null},
          ShiftMins = ${o.ShiftMins},
          IsOffDay = ${o.IsOffDay},
          Updatedby = ${o.Createdby ? "'" + o.Createdby + "'" : null},
          Updateddate = GETDATE()
        WHERE
          ID = ${o.Id}
      `);
    });
    const updateQuery = updateQueries.join(";");
    const pool = await poolPromise;
    await pool.request().query(updateQuery);

    const typeOfData = schedules[0].Type;
    if (typeOfData == "U") {
      const querye = `SELECT EmployeeId
  FROM [Units] inner join CCPD_Employees on CCPD_Employees.Unit2  = Units.ID
  where ID = ${schedules[0].UnitId}`;
      const allemp = await pool.request().query(querye);
      const list0 = allemp.recordset;
      list0.map(async (e) => {
        const checkpersonalSchedule = `select * from ${Emp_Unit_Schedule} where EmpId = ${e.EmployeeId}`;
        const checkpersonalScheduledata = await pool
          .request()
          .query(checkpersonalSchedule);
        const checkpersonalScheduledatalist =
          checkpersonalScheduledata.recordset;

        if (checkpersonalScheduledatalist.length > 0) {
          console.log("user have personal schedule");
          return false;
        }

        const leavequery = `SELECT el.*,EmployeeId
          FROM ${EmployeeLeaves} as el
          inner join CCPD_Employees as e2 on e2.Username = el.UserName
          where e2.EmployeeId = ${e.EmployeeId} and StartDate >= GETDATE() `;
        const allLeaves = await pool.request().query(leavequery);
        const list = allLeaves.recordset;
        list.map(async (s) => {
          if (
            s.LeaveStatus.trim() == "Requested" ||
            s.LeaveStatus.trim() == "Approved"
          ) {
            if (schedules[new Date(s.StartDate).getDay()].IsOffDay == 1) {
              let data1 = moment(s.StartDate).format("YYYY-MM-DD");
              let data2 = moment(s.EndDate).format("YYYY-MM-DD");

              if (moment(data1).isSame(moment(data2))) {
                if (
                  s.LeaveStatus.trim() === "Requested" ||
                  s.LeaveStatus.trim() === "Approved"
                ) {
                  const reasonsResult = await pool
                    .request()
                    .input("input_id", sql.Int, s.ID)
                    .query(queryReasons);

                  if (reasonsResult && reasonsResult.recordset) {
                    for (let i = 0; i < reasonsResult.recordset.length; i++) {
                      const code = reasonsResult.recordset[i].ReasonCode
                        ? reasonsResult.recordset[i].ReasonCode.trim()
                        : "";
                      let accuralType = getAccType(code);
                      if (accuralType && s.LeaveStatus.trim() != "Rejected") {
                        await pool.request().query(`
UPDATE
${employeeLeaveAccuralsTable}
SET
[AccuralRequested] = [AccuralRequested] - ${reasonsResult.recordset[i].RequestedHours},
[AccuralBalance] = [AccuralBalance] + ${reasonsResult.recordset[i].RequestedHours}
WHERE
[Accrual Type] = '${accuralType}' AND employeeid = ${e.EmployeeId}
`);
                      }
                    }
                  }
                }
                const query = `
          UPDATE ${EmployeeLeaves}
          SET
          LeaveStatus = 'Canceled',
          UpdatedAt = GETDATE()
          WHERE
          ID = ${s.ID}
          `;
                await pool.request().query(query);
                await pool
                  .request()
                  .input("EmployeeLeaveId", sql.Int, s.ID)
                  .input("status", sql.Char, "Cancel")
                  .input("UpdatedBy", sql.Char, Username)
                  .execute(`[uspSupervisorUpdateLeaveAlert]`);
              } else {
                //leave not same date

                var enumerateDaysBetweenDates = function (startDate, endDate) {
                  var now = startDate,
                    dates = [];

                  while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format("YYYY-MM-DD"));
                    now.add(1, "days");
                  }
                  // dates.push(now.format("YYYY-MM-DD"));
                  return dates;
                };

                var fromDate = moment(s.StartDate);
                var toDate = moment(s.EndDate);
                var results = enumerateDaysBetweenDates(fromDate, toDate);

                //console.log(results);

                for (let i = 0; i < results.length; i++) {
                  //  console.log(new Date(results[i]).getDay())

                  if (
                    schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                    i == 0
                  ) {
                    //console.log("0");

                    var dt1 = new Date(s.StartDate);
                    var dt2 = new Date(
                      `${
                        dt1.getFullYear() +
                        "-" +
                        (dt1.getMonth() + 1) +
                        "-" +
                        dt1.getDate()
                      }, ${schedules[new Date(results[i]).getDay()].Endtime}`
                    );

                    //console.log(dt1, dt2);
                    //console.log(dt1, s.ID);

                    var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                    await accuralOperation(
                      s,
                      pool,
                      hours,
                      e.EmployeeId,
                      queryReasons
                    );
                  } else if (
                    schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                    i + 1 != results.length
                  ) {
                    ////console.log("11110");
                    //console.log("results[i]", results[i]);
                    var dt1 = new Date(
                      `${results[i]}, ${
                        schedules[new Date(results[i]).getDay()].Starttime
                      }`
                    );
                    var dt2 = new Date(
                      `${results[i]}, ${
                        schedules[new Date(results[i]).getDay()].Endtime
                      }`
                    );
                    //console.log(dt1, dt2);
                    //console.log(dt1, s.ID);
                    var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                    await accuralOperation(
                      s,
                      pool,
                      hours,
                      e.EmployeeId,
                      queryReasons
                    );
                  }
                  if (
                    schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                    i + 1 == results.length
                  ) {
                    //console.log("011111");
                    var dt1 = new Date(
                      `${
                        new Date(s.EndDate).getFullYear() +
                        "-" +
                        (new Date(s.EndDate).getMonth() + 1) +
                        "-" +
                        new Date(s.EndDate).getDate()
                      }, ${schedules[new Date(results[i]).getDay()].Starttime}`
                    );
                    var dt2 = new Date(s.EndDate);
                    //console.log(dt1, dt2);
                    var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                    if (!isNaN(hours)) {
                      await accuralOperation(
                        s,
                        pool,
                        hours,
                        e.EmployeeId,
                        queryReasons
                      );
                    }
                  }
                }
                const query = `
          UPDATE ${EmployeeLeaves}
          SET
          LeaveStatus = 'Canceled',
          UpdatedAt = GETDATE()
          WHERE
          ID = ${s.ID}
          `;
                await pool.request().query(query);
                await pool
                  .request()
                  .input("EmployeeLeaveId", sql.Int, s.ID)
                  .input("status", sql.Char, "Cancel")
                  .input("UpdatedBy", sql.Char, Username)
                  .execute(`[uspSupervisorUpdateLeaveAlert]`);
              }
            }
          }
        });
      });
    } else {
      //get all leaves from today
      const leavequery = `SELECT el.*,EmployeeId
          FROM ${EmployeeLeaves} as el
          inner join CCPD_Employees as e2 on e2.Username = el.UserName
          where e2.EmployeeId = ${schedules[0].EmpId} and StartDate >= GETDATE() `;
      const allLeaves = await pool.request().query(leavequery);
      const list = allLeaves.recordset;
      list.map(async (s) => {
        if (
          s.LeaveStatus.trim() == "Requested" ||
          s.LeaveStatus.trim() == "Approved"
        ) {
          if (schedules[new Date(s.StartDate).getDay()].IsOffDay == 1) {
            let data1 = moment(s.StartDate).format("YYYY-MM-DD");
            let data2 = moment(s.EndDate).format("YYYY-MM-DD");

            if (moment(data1).isSame(moment(data2))) {
              if (
                s.LeaveStatus.trim() === "Requested" ||
                s.LeaveStatus.trim() === "Approved"
              ) {
                const reasonsResult = await pool
                  .request()
                  .input("input_id", sql.Int, s.ID)
                  .query(queryReasons);

                if (reasonsResult && reasonsResult.recordset) {
                  for (let i = 0; i < reasonsResult.recordset.length; i++) {
                    const code = reasonsResult.recordset[i].ReasonCode
                      ? reasonsResult.recordset[i].ReasonCode.trim()
                      : "";
                    let accuralType = getAccType(code);
                    if (accuralType && s.LeaveStatus.trim() != "Rejected") {
                      await pool.request().query(`
UPDATE
${employeeLeaveAccuralsTable}
SET
[AccuralRequested] = [AccuralRequested] - ${reasonsResult.recordset[i].RequestedHours},
[AccuralBalance] = [AccuralBalance] + ${reasonsResult.recordset[i].RequestedHours}
WHERE
[Accrual Type] = '${accuralType}' AND employeeid = ${schedules[0].EmpId}
`);
                    }
                  }
                }
              }
              const query = `
          UPDATE ${EmployeeLeaves}
          SET
          LeaveStatus = 'Canceled',
          UpdatedAt = GETDATE()
          WHERE
          ID = ${s.ID}
          `;
              await pool.request().query(query);
              // console.log(s.Supervisor);
              // console.log(s.ID);
              // console.log(Username);
              await pool
                .request()
                .input("EmployeeLeaveId", sql.Int, s.ID)
                .input("status", sql.Char, "Cancel")
                .input("UpdatedBy", sql.Char, Username)
                .execute(`[uspSupervisorUpdateLeaveAlert]`);
            } else {
              //leave not same date

              var enumerateDaysBetweenDates = function (startDate, endDate) {
                var now = startDate,
                  dates = [];

                while (now.isSameOrBefore(endDate)) {
                  dates.push(now.format("YYYY-MM-DD"));
                  now.add(1, "days");
                }
                // dates.push(now.format("YYYY-MM-DD"));
                return dates;
              };

              var fromDate = moment(s.StartDate);
              var toDate = moment(s.EndDate);
              var results = enumerateDaysBetweenDates(fromDate, toDate);

              //console.log(results);

              for (let i = 0; i < results.length; i++) {
                //  console.log(new Date(results[i]).getDay())

                if (
                  schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                  i == 0
                ) {
                  //console.log("0");

                  var dt1 = new Date(s.StartDate);
                  var dt2 = new Date(
                    `${
                      dt1.getFullYear() +
                      "-" +
                      (dt1.getMonth() + 1) +
                      "-" +
                      dt1.getDate()
                    }, ${schedules[new Date(results[i]).getDay()].Endtime}`
                  );

                  //console.log(dt1, dt2);
                  //console.log(dt1, s.ID);

                  var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                  await accuralOperation(
                    s,
                    pool,
                    hours,
                    schedules[0].EmpId,
                    queryReasons
                  );
                } else if (
                  schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                  i + 1 != results.length
                ) {
                  ////console.log("11110");
                  //console.log("results[i]", results[i]);
                  var dt1 = new Date(
                    `${results[i]}, ${
                      schedules[new Date(results[i]).getDay()].Starttime
                    }`
                  );
                  var dt2 = new Date(
                    `${results[i]}, ${
                      schedules[new Date(results[i]).getDay()].Endtime
                    }`
                  );
                  //console.log(dt1, dt2);
                  //console.log(dt1, s.ID);
                  var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                  await accuralOperation(
                    s,
                    pool,
                    hours,
                    schedules[0].EmpId,
                    queryReasons
                  );
                }
                if (
                  schedules[new Date(results[i]).getDay()].IsOffDay == 1 &&
                  i + 1 == results.length
                ) {
                  //console.log("011111");
                  var dt1 = new Date(
                    `${
                      new Date(s.EndDate).getFullYear() +
                      "-" +
                      (new Date(s.EndDate).getMonth() + 1) +
                      "-" +
                      new Date(s.EndDate).getDate()
                    }, ${schedules[new Date(results[i]).getDay()].Starttime}`
                  );
                  var dt2 = new Date(s.EndDate);
                  //console.log(dt1, dt2);
                  var hours = parseFloat(diff_minutes(dt1, dt2) / 60);

                  if (!isNaN(hours)) {
                    await accuralOperation(
                      s,
                      pool,
                      hours,
                      schedules[0].EmpId,
                      queryReasons
                    );
                  }
                }
              }
              const query = `
          UPDATE ${EmployeeLeaves}
          SET
          LeaveStatus = 'Canceled',
          UpdatedAt = GETDATE()
          WHERE
          ID = ${s.ID}
          `;
              await pool.request().query(query);
              await pool
                .request()
                .input("EmployeeLeaveId", sql.Int, s.ID)
                .input("status", sql.Char, "Cancel")
                .input("UpdatedBy", sql.Char, Username)
                .execute(`[uspSupervisorUpdateLeaveAlert]`);
            }
          }
        }
      });
    }

    return res.status(200).json({ status: 1 });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};
function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function getAccType(code) {
  let accuralType = null;
  switch (code) {
    case "COMP-TIME":
      accuralType = "COMP TIME REGULAR";
      break;
    case "SICK":
      accuralType = "SICK TIME";
      break;
    case "PER":
      accuralType = "PERSONAL TIME";
      break;
    case "HOL":
      accuralType = "FLOATING HOLIDAY";
      break;
    case "VAC":
      accuralType = "VACATION TIME";
      break;
  }
  return accuralType;
}
async function accuralOperation(s, pool, hours, EmpId, queryReasons) {
  //console.log("hours", hours);

  const reasonsResult = await pool
    .request()
    .input("input_id", sql.Int, s.ID)
    .query(queryReasons);

  if (reasonsResult && reasonsResult.recordset) {
    for (let i = 0; i < reasonsResult.recordset.length; i++) {
      const code = reasonsResult.recordset[i].ReasonCode
        ? reasonsResult.recordset[i].ReasonCode.trim()
        : "";
      let accuralType = getAccType(code);
      if (accuralType && s.LeaveStatus.trim() != "Rejected") {
        await pool.request().query(`
            UPDATE
              ${employeeLeaveAccuralsTable}
            SET
              [AccuralRequested] = [AccuralRequested] - ${hours},
              [AccuralBalance] = [AccuralBalance] + ${hours}
            WHERE
              [Accrual Type] = '${accuralType}' AND employeeid = ${EmpId}
          `);
      }
    }
  }
}

exports.deleteScheduleByTypeAndTypeId = async function (req, res) {
  const { type, typeId } = req.params;
  const whereArr = ["Type = @input_type"];
  try {
    if (type === "E") {
      whereArr.push("EmpId = @input_typeId");
    } else if (type === "U") {
      whereArr.push("UnitId = @input_typeId");
    }
    const query = `
      DELETE FROM ${tableName}
      WHERE ${whereArr.join(" AND ")}
    `;
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_type", sql.Char, type)
      .input("input_typeId", sql.Int, typeId)
      .query(query);
    return res.status(200).json({ status: 1 });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "",
      error: error,
    });
  }
};

getUnitScheduleByEmployeeId = async function (employeeId) {
  const empQuery = `
    SELECT Unit2 FROM ${tblEmployees} WHERE EmployeeId = @input_id
  `;
  const schQuery = `
    SELECT
      tbl.ID AS ID,
      tbl.UnitId AS TypeId,
      tbl.Type AS Type,
      tbl.Starttime AS Starttime,
      tbl.Endtime AS Endtime,
      tbl.ShiftMins AS ShiftMins,
      tbl.Day AS Day,
      tbl.IsOffDay AS IsOffDay
    FROM
      ${tableName} AS tbl
    WHERE
      tbl.UnitId = @input_id AND tbl.Type = @input_type
    ORDER BY
      tbl.Day ASC
  `;
  try {
    const pool = await poolPromise;
    const employeeResult = await pool
      .request()
      .input("input_id", employeeId)
      .query(empQuery);
    if (
      employeeResult &&
      employeeResult.recordset &&
      employeeResult.recordset[0] &&
      employeeResult.recordset[0].Unit2
    ) {
      const unitId = employeeResult.recordset[0].Unit2;
      const result = await pool
        .request()
        .input("input_id", unitId)
        .input("input_type", "U")
        .query(schQuery);
      if (result && result.recordset && result.recordset.length) {
        return result.recordset;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
