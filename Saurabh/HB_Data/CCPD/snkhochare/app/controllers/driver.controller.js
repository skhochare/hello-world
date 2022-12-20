const { poolPromise } = require("../../config/mssql_fleet.config");
const TBL_DRIVERS = "Drivers";

exports.getAll = async function (req, res) {
  const query = `
    SELECT * FROM ${TBL_DRIVERS}
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      return res.status(200).json({
        status: 1,
        data: result.recordset,
        message: "Drivers Fetched Successfully!",
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
