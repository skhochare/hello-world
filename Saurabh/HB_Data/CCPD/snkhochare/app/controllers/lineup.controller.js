// Configuring the database
const { sql, poolPromise } = require('../../config/mssql_lineup.config.js');

var moment = require('moment');

// Retrieve and return alll lineup from the database.
exports.findAll = async function (req, res) {
  var accessQuery = "select * from POSSLineup";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return the lineup except IT from the database.
exports.findOne = async function (req, res) {
  var accessQuery = "select * from POSSLineupView where startDate = @input_startDate and Deleted = '0' order by OfficerTitleNameBadge, Sc_ID DESC";
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_startDate', sql.VarChar, req.params.startDate)
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return the lineup only IT from the database.
exports.findOneIT = async function (req, res) {
  var accessQuery = "select * from POSSLineupITView where startDate = @input_startDate and Deleted = '0' order by OfficerTitleNameBadge, Sc_ID DESC";
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_startDate', sql.VarChar, req.params.startDate)
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return the lineup Platoon id from the database.
exports.findOneOff = async function (req, res) {
  var accessQuery = "select * from POSSLineupView where startDate = @input_startDate and OfficerTitleNameBadge Like @input_off order by OfficerTitleNameBadge, Sc_ID DESC";
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_startDate', sql.VarChar, req.params.startDate)
      .input('input_off', sql.VarChar, "%" + req.params.off + "%")
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return the lineup group detail except IT from the database.
exports.findGroup = async function (req, res) {
  var accessQuery = "select * from POSSLineupView where Sc_ID in (select max(Sc_ID) from POSSLineupView where Deleted = '0' and startDate = @input_startDate group by OfficerTitleNameBadge)";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_startDate', sql.VarChar, req.params.startDate)
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Retrieve and return the lineup group detail only IT from the database.
exports.findGroupIT = async function (req, res) {
  var accessQuery = "select * from POSSLineupITView where Sc_ID in (select max(Sc_ID) from POSSLineupITView where Deleted = '0' and startDate = @input_startDate group by OfficerTitleNameBadge)";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_startDate', sql.VarChar, req.params.startDate)
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return all OFF from the database.
exports.findOFF = async function (req, res) {
  var accessQuery = "select *, OfficerTitleNameBadge as value, OfficerTitleNameBadge as label from CCPDEmployeesView order by OfficerTitleNameBadge";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return all Tags from the database.
exports.findTag = async function (req, res) {
  var accessQuery = "select *, Tag as value, Tag as label from CCPDTagView order by Tag";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Retrieve and return all Units from the database.
exports.findUnit = async function (req, res) {
  var accessQuery = "select *, Unit as value, Units_Desc as label from Units order by Units_Desc";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Retrieve and return all Equipment from the database.
exports.findEquipment = async function (req, res) {
  var accessQuery = "select Equipment_Code as value, Equipment_Desc as label, Color as color from Equipment order by Equipment_Desc";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return all Leave from the database.
exports.findLeave = async function (req, res) {
  var accessQuery = "select Leave_Code as value, Leave_Desc as label from Leave order by Leave_Desc";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return all Platoon from the database.
exports.findPlatoon = async function (req, res) {
  var accessQuery = "select Platoon_ID as value, Platoon_Desc as label from Platoon";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return all Priority from the database.
exports.findPriority = async function (req, res) {
  var accessQuery = "select Priority_Code as value, Priority_Desc as label from Priority";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Retrieve and return all AOR from the database.
exports.findAOR = async function (req, res) {
  var accessQuery = "select AreaDescription as value, AreaDescription as label from AreaOfResponsibilty order by Priority, AreaDescription";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Create new record for the database.
exports.createOne = async function (req, res) {
  var accessQuery = "insert into POSSLineup (OfficerTitleNameBadge, Unit, OfficerUnit, Phone, UTC_StartDateTime, UTC_EndDateTime, Sc_StartDateTime, Sc_EndDateTime, VehicleTag, Priority_Code, Equipment_Code, Platoon_ID, Tour_ID, AreaOfResponsibility, Notes, Leave_Code, Leave_Filter, UpdatedBy, AOR2, AORStartTime2, AOREndTime2, AOR3, AORStartTime3, AOREndTime3, AOR4, AORStartTime4, AOREndTime4) values (@input_off, @input_unit, @input_offUnit, @input_phone, @input_startDateTimeUTC, @input_endDateTimeUTC, @input_startDateTime, @input_endDateTime, @input_tag, @input_priority, @input_equipment, @input_platoon, @input_tour, @input_aor, @input_notes, @input_leave, @input_leaveFilter, @input_updatedBy, @input_aor2, @input_aorStartTime2, @input_aorEndTime2, @input_aor3, @input_aorStartTime3, @input_aorEndTime3, @input_aor4, @input_aorStartTime4, @input_aorEndTime4);";
  //console.log(req.body)

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_off', sql.Char, req.body.off)
      .input('input_unit', sql.Char, req.body.unit)
      .input('input_offUnit', sql.Char, req.body.offUnit)
      .input('input_phone', sql.Char, req.body.phone)
      .input('input_startDateTimeUTC', sql.Char, req.body.startDateTime)
      .input('input_endDateTimeUTC', sql.Char, req.body.endDateTime)
      .input('input_startDateTime', sql.Char, moment.utc(req.body.startDateTime).local().format("YYYY-MM-DD HH:mm:ss"))
      .input('input_endDateTime', sql.Char, moment.utc(req.body.endDateTime).local().format("YYYY-MM-DD HH:mm:ss"))
      .input('input_tag', sql.Char, req.body.tag)
      .input('input_priority', sql.Char, req.body.priority)
      .input('input_equipment', sql.Char, req.body.equipment)
      .input('input_platoon', sql.Int, req.body.platoon)
      .input('input_tour', sql.Int, req.body.tour)
      .input('input_aor', sql.Char, req.body.aor)
      .input('input_notes', sql.Char, req.body.notes)
      .input('input_leave', sql.Char, req.body.leave)
      .input('input_leaveFilter', sql.Char, req.body.leaveFilter)
      .input('input_updatedBy', sql.Char, req.body.updatedBy)
      .input('input_aor2', sql.Char, req.body.aor2)
      .input('input_aorStartTime2', sql.Char, req.body.aorStartTime2)
      .input('input_aorEndTime2', sql.Char, req.body.aorEndTime2)
      .input('input_aor3', sql.Char, req.body.aor3)
      .input('input_aorStartTime3', sql.Char, req.body.aorStartTime3)
      .input('input_aorEndTime3', sql.Char, req.body.aorEndTime3)
      .input('input_aor4', sql.Char, req.body.aor4)
      .input('input_aorStartTime4', sql.Char, req.body.aorStartTime4)
      .input('input_aorEndTime4', sql.Char, req.body.aorEndTime4)
      .query(accessQuery)

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Delete record for the database.
exports.deleteOne = async function (req, res) {
  //var accessQuery = "delete from POSSLineup where Sc_ID = @input_Sc_ID";
  var accessQuery = "update POSSLineup set Deleted = '1', UpdatedBy = @input_updatedBy, UpdateDate = GETDATE() where Sc_ID = @input_Sc_ID";
  //console.log(req.params);

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_Sc_ID', sql.Int, req.params.id)
      .input('input_updatedBy', sql.Char, req.params.updatedBy)
      .query(accessQuery)

    res.status(200).send('Record has been deleted!');
    //res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Copy records to database.
exports.copyAll = async function (req, res) {
  var valuesR = req.body;

  var accessQuery = `INSERT INTO POSSLineup (OfficerTitleNameBadge, Unit, OfficerUnit, Phone, UTC_StartDateTime, UTC_EndDateTime, Sc_StartDateTime, Sc_EndDateTime, Priority_Code, Equipment_Code, Platoon_ID, Tour_ID, Notes, Leave_Code, Leave_Filter, UpdatedBy) VALUES ${valuesR}`;


  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery);


    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

//  // Create new record for the database.
// exports.test = async function(req, res) {

//   var date = '2019-11-27T20:09:13Z';
//   var local = moment.utc(date).local().format();

//   console.log(local)

//  };


