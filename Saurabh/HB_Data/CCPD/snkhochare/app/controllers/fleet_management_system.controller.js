const {
  sql,
  poolPromise,
} = require("../../config/mssql_fleet_management_system.config");
const { basicSelectFilterQueryBuilder } = require("../helper/datatable-fetch");
const { decrypt } = require("../../config/crypto");
exports.fetchVehiclesInspection = async function (req, res) {
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

exports.insertVehiclesInspection = async function (req, res) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input(
        "TagNumber",
        sql.Char,
        req.body.TagNumber ? req.body.TagNumber : null
      )
      .input("Odometer", sql.Char, req.body.Odometer ? req.body.Odometer : null)
      .input(
        "CurrentHours",
        sql.Char,
        req.body.CurrentHours ? req.body.CurrentHours : null
      )
      .input(
        "InspectionDueDate",
        sql.DateTime2,
        req.body.InspectionDueDate ? req.body.InspectionDueDate : null
      )
      .input(
        "SchOilChangeMileage",
        sql.Char,
        req.body.SchOilChangeMileage ? req.body.SchOilChangeMileage : null
      )
      .input(
        "PhoneLocationSettingOn",
        sql.Char,
        req.body.PhoneLocationSettingOn ? req.body.PhoneLocationSettingOn : null
      )
      .input(
        "AVLClientMonitorActive",
        sql.Char,
        req.body.AVLClientMonitorActive ? req.body.AVLClientMonitorActive : null
      )
      .input(
        "EngOffFirstAidKits",
        sql.Char,
        req.body.EngOffFirstAidKits ? req.body.EngOffFirstAidKits : null
      )
      .input(
        "DescribeFirstAidKits",
        sql.Char,
        req.body.DescribeFirstAidKits ? req.body.DescribeFirstAidKits : null
      )
      .input(
        "EngOffPPE",
        sql.Char,
        req.body.EngOffPPE ? req.body.EngOffPPE : null
      )
      .input(
        "DescribePPE",
        sql.Char,
        req.body.DescribePPE ? req.body.DescribePPE : null
      )
      .input(
        "EngOffLysol",
        sql.Char,
        req.body.EngOffLysol ? req.body.EngOffLysol : null
      )
      .input(
        "DescribeLysol",
        sql.Char,
        req.body.DescribeLysol ? req.body.DescribeLysol : null
      )
      .input(
        "EngOffWipers",
        sql.Char,
        req.body.EngOffWipers ? req.body.EngOffWipers : null
      )
      .input(
        "DescribeWipers",
        sql.Char,
        req.body.DescribeWipers ? req.body.DescribeWipers : null
      )
      .input(
        "EngOffSeatBelts",
        sql.Char,
        req.body.EngOffSeatBelts ? req.body.EngOffSeatBelts : null
      )
      .input(
        "DescribeSeatBelts",
        sql.Char,
        req.body.DescribeSeatBelts ? req.body.DescribeSeatBelts : null
      )
      .input(
        "EngOffTireInflation",
        sql.Char,
        req.body.EngOffTireInflation ? req.body.EngOffTireInflation : null
      )
      .input(
        "DescribeTireInflation",
        sql.Char,
        req.body.DescribeTireInflation ? req.body.DescribeTireInflation : null
      )
      .input(
        "EngOffTireTreads",
        sql.Char,
        req.body.EngOffTireTreads ? req.body.EngOffTireTreads : null
      )
      .input(
        "DescribeTireTreads",
        sql.Char,
        req.body.DescribeTireTreads ? req.body.DescribeTireTreads : null
      )
      .input(
        "EngOffStretcher",
        sql.Char,
        req.body.EngOffStretcher ? req.body.EngOffStretcher : null
      )
      .input(
        "DescribeStretcher",
        sql.Char,
        req.body.DescribeStretcher ? req.body.DescribeStretcher : null
      )
      .input(
        "EngOffTourniquet",
        sql.Char,
        req.body.EngOffTourniquet ? req.body.EngOffTourniquet : null
      )
      .input(
        "DescribeTourniquet",
        sql.Char,
        req.body.DescribeTourniquet ? req.body.DescribeTourniquet : null
      )
      .input(
        "EngOffCrimeSceneTape",
        sql.Char,
        req.body.EngOffCrimeSceneTape ? req.body.EngOffCrimeSceneTape : null
      )
      .input(
        "DescribeCrimeSceneTape",
        sql.Char,
        req.body.DescribeCrimeSceneTape ? req.body.DescribeCrimeSceneTape : null
      )
      .input(
        "EngOffFlares",
        sql.Char,
        req.body.EngOffFlares ? req.body.EngOffFlares : null
      )
      .input(
        "DescribeFlares",
        sql.Char,
        req.body.DescribeFlares ? req.body.DescribeFlares : null
      )
      .input(
        "EngOffContraband",
        sql.Char,
        req.body.EngOffContraband ? req.body.EngOffContraband : null
      )
      .input(
        "DescribeContraband",
        sql.Char,
        req.body.DescribeContraband ? req.body.DescribeContraband : null
      )
      .input(
        "EngOnHeadlights",
        sql.Char,
        req.body.EngOnHeadlights ? req.body.EngOnHeadlights : null
      )
      .input(
        "DescribeHeadlights",
        sql.Char,
        req.body.DescribeHeadlights ? req.body.DescribeHeadlights : null
      )
      .input(
        "EngOnSignalsLights",
        sql.Char,
        req.body.EngOnSignalsLights ? req.body.EngOnSignalsLights : null
      )
      .input(
        "DescribeSignalLights",
        sql.Char,
        req.body.DescribeSignalLights ? req.body.DescribeSignalLights : null
      )
      .input(
        "EngOnBrakesLights",
        sql.Char,
        req.body.EngOnBrakesLights ? req.body.EngOnBrakesLights : null
      )
      .input(
        "DescribeBrakesLights",
        sql.Char,
        req.body.DescribeBrakesLights ? req.body.DescribeBrakesLights : null
      )
      .input(
        "EngOnReverseLights",
        sql.Char,
        req.body.EngOnReverseLights ? req.body.EngOnReverseLights : null
      )
      .input(
        "DescribeReverseLights",
        sql.Char,
        req.body.DescribeReverseLights ? req.body.DescribeReverseLights : null
      )
      .input(
        "EngOnFluidLeaks",
        sql.Char,
        req.body.EngOnFluidLeaks ? req.body.EngOnFluidLeaks : null
      )
      .input(
        "DescribeFluidLeaks",
        sql.Char,
        req.body.DescribeFluidLeaks ? req.body.DescribeFluidLeaks : null
      )
      .input(
        "EngOnHornSounds",
        sql.Char,
        req.body.EngOnHornSounds ? req.body.EngOnHornSounds : null
      )
      .input(
        "DescribeHornSounds",
        sql.Char,
        req.body.DescribeHornSounds ? req.body.DescribeHornSounds : null
      )
      .input(
        "EngOnMirrorsFunction",
        sql.Char,
        req.body.EngOnMirrorsFunction ? req.body.EngOnMirrorsFunction : null
      )
      .input(
        "DescribeMirrorsFunction",
        sql.Char,
        req.body.DescribeMirrorsFunction
          ? req.body.DescribeMirrorsFunction
          : null
      )
      .input(
        "EngOnEmergencyLights",
        sql.Char,
        req.body.EngOnEmergencyLights ? req.body.EngOnEmergencyLights : null
      )
      .input(
        "DescribeEmergencyLights",
        sql.Char,
        req.body.DescribeEmergencyLights
          ? req.body.DescribeEmergencyLights
          : null
      )
      .input(
        "EngOnSiren",
        sql.Char,
        req.body.EngOnSiren ? req.body.EngOnSiren : null
      )
      .input(
        "DescribeSiren",
        sql.Char,
        req.body.DescribeSiren ? req.body.DescribeSiren : null
      )
      .input(
        "EngOnPriorDamage",
        sql.Char,
        req.body.EngOnPriorDamage ? req.body.EngOnPriorDamage : null
      )
      .input(
        "DescribePriorDamage",
        sql.Char,
        req.body.DescribePriorDamage ? req.body.DescribePriorDamage : null
      )
      .input(
        "EngOnMDTFunctional",
        sql.Char,
        req.body.EngOnMDTFunctional ? req.body.EngOnMDTFunctional : null
      )
      .input(
        "DescribeMDTFunctional",
        sql.Char,
        req.body.DescribeMDTFunctional ? req.body.DescribeMDTFunctional : null
      )
      .input(
        "EngOnLPRLogin",
        sql.Char,
        req.body.EngOnLPRLogin ? req.body.EngOnLPRLogin : null
      )
      .input(
        "DescribeLPRLogin",
        sql.Char,
        req.body.DescribeLPRLogin ? req.body.DescribeLPRLogin : null
      )
      .input(
        "EngOnCamera",
        sql.Char,
        req.body.EngOnCamera ? req.body.EngOnCamera : null
      )
      .input(
        "DescribeCamera",
        sql.Char,
        req.body.DescribeCamera ? req.body.DescribeCamera : null
      )
      .input(
        "EngOnDatabaseUpdate",
        sql.Char,
        req.body.EngOnDatabaseUpdate ? req.body.EngOnDatabaseUpdate : null
      )
      .input(
        "DescribeDatabaseUpdate",
        sql.Char,
        req.body.DescribeDatabaseUpdate ? req.body.DescribeDatabaseUpdate : null
      )
      .input(
        "EngOnRadio",
        sql.Char,
        req.body.EngOnRadio ? req.body.EngOnRadio : null
      )
      .input(
        "DescribeRadio",
        sql.Char,
        req.body.DescribeRadio ? req.body.DescribeRadio : null
      )
      .input("Problems", sql.Char, req.body.Problems ? req.body.Problems : null)
      .input("Comments", sql.Char, req.body.Comments ? req.body.Comments : null)
      .input(
        "Supervisor",
        sql.Char,
        req.body.Supervisor ? req.body.Supervisor : null
      )
      .input(
        "CreatedBy",
        sql.Char,
        req.body.Username ? req.body.Username : null
      )
      .output("ID", sql.Int)
      .execute(`usp_VehicleInspection_Insert`);
    res.json({
      status: 1,
      message: "Inserted successfully",
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getVehicleInspectionReportById = async function (req, res) {
  const { id } = req.params;
  const query = `
    SELECT
      vi.*, cd.CarID, cd.Make, cd.Year, cd.Model
    FROM
      VehicleInspection AS vi
    INNER JOIN
      [${decrypt(process.env.DB_NAME_FLEET)}].[dbo].[vwCarDetails] AS cd
    ON
      vi.TagNumber = cd.[CG TAG]
    WHERE
      vi.ID = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(query);
    res.status(200).json(result.recordset && result.recordset[0]);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
