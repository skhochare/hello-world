// Configuring the database
const { sql, poolPromise } = require('../../config/mssql_mp.config.js');

// Retrieve and return all missing persons from the database.
exports.findAll = async function (req, res) {
  var accessQuery = "select * from [72hours] where Found IS NULL order by MissingHours";
  //var accessQuery = "select * from [72hours] where MissingHours < 72 order by MissingHours";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(accessQuery)
    res.json(result.recordsets)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};


// Retrieve and return the missing person from the database.
exports.findOne = async function (req, res) {
  var accessQuery = "select * from VWMissingPersonDetails where Casenumber = @input_parameter";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_parameter', sql.Int, req.params.id)
      .query(accessQuery)

    res.json(result.recordsets)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }

};

// Update the missing person is found.
exports.updateFound = async function (req, res) {

  var accessQuery = "update MissingPersonFound set Found = 'T' where (Casenumber = @input_parameter and DOB = @input_dob) IF @@ROWCOUNT=0 insert into MissingPersonFound (Casenumber, DOB, Found) values (@input_parameter, @input_dob, 'T')";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_parameter', sql.Int, req.body.id)
      .input('input_dob', sql.Char, req.body.dob)
      .query(accessQuery)

    res.json(result.recordsets);
  } catch (err) {
    res.status(500).send(err);
  }

};

// Upload the missing person photo to the database.
exports.updateOnePhoto = async function (req, res) {

  var accessQuery = "update MissingPersonImage set Picture = @input_picture where (Casenumber = @input_parameter and DOB = @input_dob) IF @@ROWCOUNT=0 insert into MissingPersonImage (Casenumber, Picture, DOB) values (@input_parameter, @input_picture, @input_dob)";

  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_parameter', sql.Int, req.body.id)
      .input('input_dob', sql.Char, req.body.dob)
      .input('input_picture', sql.Char, req.body.data.saveAs)
      .query(accessQuery)

    res.json(result.recordsets);
  } catch (err) {
    res.status(500).send(err);
  }

};


