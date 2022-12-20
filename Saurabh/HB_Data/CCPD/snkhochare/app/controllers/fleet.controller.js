// Configuring the database
const { sql, poolPromise } = require("../../config/mssql_fleet.config.js");
const { decrypt } = require("../../config/crypto");
const {
  basicSelectFilterQueryBuilder,
  prepareFieldsStr,
  prepareOrderByStr,
  preparePagination,
  prepareForGlobalSearch,
  prepareForFilters,
  prepareWhereStr,
  prepareAlias,
  prepareConcatFieldStr,
} = require("../helper/datatable-fetch.js");

const MobileTerminalDB = decrypt(process.env.DB_NAME_MOBILE_DATA_TERMINAL);

// Retrieve and return all cars from the database.
exports.findAll = async function (req, res) {
  // const accessQuery = `
  // SELECT
  //   "Assignments"."ID" "ID",
  //   "Assignments"."CarID" "CarID",
  //   "Car"."VIN" "CarVIN",
  //   "CarBodyType"."Body Type" "CarBodyTypeBodyType",
  //   "CarDrive"."Drive Train" "CarDriveDriveTrain",
  //   "CarEngine"."Engine" "CarEngineEngine",
  //   "CarMake"."Make" "CarMakeMake",
  //   "CarModel"."Model" "CarModelModel",
  //   "CarYear"."Year" "CarYearYear",
  //   "Assignments"."Assignment Dept" "AssignmentDept",
  //   "AssignmentDept"."Dept" "AssignmentDeptDept",
  //   "Assignments"."Driver 1" "Driver1",
  //   "Driver1"."Driver" "Driver1Driver",
  //   "Assignments"."Driver 2" "Driver2",
  //   "Driver2"."Driver" "Driver2Driver",
  //   "Assignments"."Unit" "Unit",
  //   "Unit"."Unit" "UnitUnit",
  //   "Assignments"."Condition" "Condition",
  //   "Condition"."Condition" "ConditionCondition",
  //   "Assignments"."UseType" "UseType",
  //   "UseType"."Use Type" "UseTypeUseType",
  //   "ITFunctions"."LPR" "LPR",
  //   "ITFunctions"."SWModemSerialNumber" "SWModemSerialNumber",
  //   "ITFunctions"."LPRNotes" "LPRNotes",
  //   "ITFunctions"."MDT" "MDT",
  //   "CarDetail"."Is OutService" "OOS",
  //   "Car"."CG TAG" "TAG#"
  // FROM
  //   "Assignments" "Assignments"
  //   left join "Cars" "Car" on "Assignments"."CarID" = "Car"."CarID"
  //   left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
  //   left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
  //   left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
  //   left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
  //   left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
  //   left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
  //   left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
  //   left join "Drivers" "Driver1" on "Assignments"."Driver 1" = "Driver1"."DriverID"
  //   left join "Drivers" "Driver2" on "Assignments"."Driver 2" = "Driver2"."DriverID"
  //   left join "Units" "Unit" on "Assignments"."Unit" = "Unit"."UnitID"
  //   left join "Condition" "Condition" on "Assignments"."Condition" = "Condition"."ConditionID"
  //   left join "Use Type" "UseType" on "Assignments"."UseType" = "UseType"."UseTypeID"
  //   left join "IT Functions" "ITFunctions" on "Car"."CarID" = "ITFunctions"."CarID"
  //   left join "Vw_isVehicleOOS" "CarDetail" on "Assignments"."CarID" = "CarDetail"."CarID"
  // `;

  const accessQuery = `select  "Assignments"."ID" "ID",
  "Cars"."CarID" "CarID",
  "Cars"."VIN" "CarVIN",
  "CarBodyType"."Body Type" "CarBodyTypeBodyType",
  "CarDrive"."Drive Train" "CarDriveDriveTrain",
  "CarEngine"."Engine" "CarEngineEngine",
  "CarMake"."Make" "CarMakeMake",
  "CarModel"."Model" "CarModelModel",
  "CarYear"."Year" "CarYearYear",
  "Assignments"."Assignment Dept" "AssignmentDept",
  "AssignmentDept"."Dept" "AssignmentDeptDept",
  "Assignments"."Driver 1" "Driver1",
  "Driver1"."Driver" "Driver1Driver",
  "Assignments"."Driver 2" "Driver2",
  "Driver2"."Driver" "Driver2Driver",
  "Assignments"."Unit" "Unit",
  "Unit"."Unit" "UnitUnit",
  "Assignments"."Condition" "Condition",
  "Condition"."Condition" "ConditionCondition",
  "Assignments"."UseType" "UseType",
  "UseType"."Use Type" "UseTypeUseType",
  "ITFunctions"."LPR" "LPR",
  "ITFunctions"."SWModemSerialNumber" "SWModemSerialNumber",
  "ITFunctions"."LPRNotes" "LPRNotes",
  "ITFunctions"."MDT" "MDT",
  "CarDetail"."Is OutService" "OOS",
  "Cars"."CG TAG" "TAG#" from Cars 
left join Assignments on  Assignments.CarID = Cars.CarID
left join "Body Type" "CarBodyType" on "Cars"."BodyTypeID" = "CarBodyType"."BodyTypeID"
  left join "Drive Train" "CarDrive" on "Cars"."DriveID" = "CarDrive"."DriveID"
  left join "Engine" "CarEngine" on "Cars"."EngineID" = "CarEngine"."EngineID"
  left join "Make" "CarMake" on "Cars"."MakeID" = "CarMake"."MakeID"
  left join "Model" "CarModel" on "Cars"."ModelID" = "CarModel"."ModelID"
  left join "Year" "CarYear" on "Cars"."YearID" = "CarYear"."YearID"
  left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
  left join "Drivers" "Driver1" on "Assignments"."Driver 1" = "Driver1"."DriverID"
  left join "Drivers" "Driver2" on "Assignments"."Driver 2" = "Driver2"."DriverID"
  left join "Units" "Unit" on "Assignments"."Unit" = "Unit"."UnitID"
  left join "Condition" "Condition" on "Assignments"."Condition" = "Condition"."ConditionID"
  left join "Use Type" "UseType" on "Assignments"."UseType" = "UseType"."UseTypeID"
  left join "IT Functions" "ITFunctions" on "Cars"."CarID" = "ITFunctions"."CarID"
  left join "Vw_isVehicleOOS" "CarDetail" on "Assignments"."CarID" = "CarDetail"."CarID" ORDER BY "CarYear"."Year" DESC`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.findAllTag = async function (req, res) {
  // const accessQuery = `
  // SELECT
  //   "Assignments"."ID" "ID",
  //   "Assignments"."CarID" "CarID",
  //   "Car"."VIN" "CarVIN",
  //   "CarBodyType"."Body Type" "CarBodyTypeBodyType",
  //   "CarDrive"."Drive Train" "CarDriveDriveTrain",
  //   "CarEngine"."Engine" "CarEngineEngine",
  //   "CarMake"."Make" "CarMakeMake",
  //   "CarModel"."Model" "CarModelModel",
  //   "CarYear"."Year" "CarYearYear",
  //   "Assignments"."Assignment Dept" "AssignmentDept",
  //   "AssignmentDept"."Dept" "AssignmentDeptDept",
  //   "Assignments"."Driver 1" "Driver1",
  //   "Driver1"."Driver" "Driver1Driver",
  //   "Assignments"."Driver 2" "Driver2",
  //   "Driver2"."Driver" "Driver2Driver",
  //   "Assignments"."Unit" "Unit",
  //   "Unit"."Unit" "UnitUnit",
  //   "Assignments"."Condition" "Condition",
  //   "Condition"."Condition" "ConditionCondition",
  //   "Assignments"."UseType" "UseType",
  //   "UseType"."Use Type" "UseTypeUseType",
  //   "ITFunctions"."LPR" "LPR",
  //   "ITFunctions"."SWModemSerialNumber" "SWModemSerialNumber",
  //   "ITFunctions"."LPRNotes" "LPRNotes",
  //   "ITFunctions"."MDT" "MDT",
  //   "CarDetail"."Is OutService" "OOS",
  //   "Car"."CG TAG" "TAG#"
  // FROM
  //   "Assignments" "Assignments"
  //   left join "Cars" "Car" on "Assignments"."CarID" = "Car"."CarID"
  //   left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
  //   left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
  //   left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
  //   left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
  //   left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
  //   left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
  //   left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
  //   left join "Drivers" "Driver1" on "Assignments"."Driver 1" = "Driver1"."DriverID"
  //   left join "Drivers" "Driver2" on "Assignments"."Driver 2" = "Driver2"."DriverID"
  //   left join "Units" "Unit" on "Assignments"."Unit" = "Unit"."UnitID"
  //   left join "Condition" "Condition" on "Assignments"."Condition" = "Condition"."ConditionID"
  //   left join "Use Type" "UseType" on "Assignments"."UseType" = "UseType"."UseTypeID"
  //   left join "IT Functions" "ITFunctions" on "Car"."CarID" = "ITFunctions"."CarID"
  //   left join "Vw_isVehicleOOS" "CarDetail" on "Assignments"."CarID" = "CarDetail"."CarID"
  // `;

  const accessQuery = `select  
  "Cars"."CG TAG" "label",
  "Cars"."CG TAG" "value"
   from Cars
left join Assignments on  Assignments.CarID = Cars.CarID
left join "Body Type" "CarBodyType" on "Cars"."BodyTypeID" = "CarBodyType"."BodyTypeID"
  left join "Drive Train" "CarDrive" on "Cars"."DriveID" = "CarDrive"."DriveID"
  left join "Engine" "CarEngine" on "Cars"."EngineID" = "CarEngine"."EngineID"
  left join "Make" "CarMake" on "Cars"."MakeID" = "CarMake"."MakeID"
  left join "Model" "CarModel" on "Cars"."ModelID" = "CarModel"."ModelID"
  left join "Year" "CarYear" on "Cars"."YearID" = "CarYear"."YearID"
  left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
  left join "Drivers" "Driver1" on "Assignments"."Driver 1" = "Driver1"."DriverID"
  left join "Drivers" "Driver2" on "Assignments"."Driver 2" = "Driver2"."DriverID"
  left join "Units" "Unit" on "Assignments"."Unit" = "Unit"."UnitID"
  left join "Condition" "Condition" on "Assignments"."Condition" = "Condition"."ConditionID"
  left join "Use Type" "UseType" on "Assignments"."UseType" = "UseType"."UseTypeID"
  left join "IT Functions" "ITFunctions" on "Cars"."CarID" = "ITFunctions"."CarID"
  left join "Vw_isVehicleOOS" "CarDetail" on "Assignments"."CarID" = "CarDetail"."CarID" `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
exports.findAllBikes = async function (req, res) {
  var accessQuery = `SELECT * FROM [Bikes]`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

//get count of assignedunits
exports.getCountofAssignedUnits = async function (req, res) {
  var countQuery = `Select AssignedUnit, COUNT(AssignedUnit) AS CountOfUnit from ServiceDetails where status = 'Out of service' Group by AssignedUnit`;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(countQuery);
    res.json(result.recordsets[0]);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.findOne = async function (req, res) {
  var accessQuery = ` select [vwCarDetails].[CarID]
  ,[vwCarDetails].[CG TAG]
  ,[vwCarDetails].[VIN]
  ,[Car].[MakeID]
  ,[Car].[YearID]
  ,[Car].[BodyTypeID]
  ,[Car].[ModelID]
  ,[Car].[EngineID]
  ,[Year]
  ,[Body Type]
  ,[Make]
  ,[Model]
  ,[Reason Out]
  ,[Out of Service]
  ,[Is OutService]
  ,[Back In Service]
  ,[Removed by]
  ,[Location]
  ,[Dept Desc]
  ,[DeptID]
  ,[Condition]
  ,[Next Mileage]
  ,[Current Mileage]
  ,[CurrentHours]
  ,[DueHours]
  ,[Scheduled maintanence]
  ,[Registration Expiry]
  ,[Inspection Expiry]
  ,[Inspection Failed]
  ,[Notes]
  ,[SpareTire]
  ,[ToCounty]
  ,[Use Type]
  ,"Car"."DriveID" "DriveID"
FROM [vwCarDetails]
left join [Cars] "Car" on [tblvwCarDetailsCarDetails].[CarID] = "Car"."CarID"
Where [vwCarDetails].[CarID] = @input_parameter`;

  var accessQuery = ` select [vwCarDetails].[CarID]
  ,[vwCarDetails].[CG TAG]
  ,[vwCarDetails].[VIN]
  ,[Car].[MakeID]
  ,[Car].[YearID]
  ,[Car].[BodyTypeID]
  ,[Car].[ModelID]
  ,[Car].[EngineID]
  ,[Year]
  ,[Body Type]
  ,[Make]
  ,[Model]
  ,[Reason Out]
  ,[Out of Service]
  ,[Is OutService]
  ,[Back In Service]
  ,[Removed by]
  ,[Location]
  ,[Dept Desc]
  ,[DeptID]
  ,[Condition]
  ,[Next Mileage]
  ,[Current Mileage]
  ,[CurrentHours]
  ,[DueHours]
  ,[Scheduled maintanence]
  ,[Registration Expiry]
  ,[Inspection Expiry]
  ,[Inspection Failed]
  ,[Notes]
  ,[SpareTire]
  ,[ToCounty]
  ,[Use Type]
  ,"Car"."DriveID" "DriveID"
FROM [vwCarDetails]
left join [Cars] "Car" on [vwCarDetails].[CarID] = "Car"."CarID"
Where [vwCarDetails].[CarID] = @input_parameter`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

const reconcileFilters = (filterResults) => {
  const carsObj = {};
  filterResults.forEach((res) => {
    res.result.forEach((qryArray) => {
      qryArray.forEach((obj) => {
        if (carsObj[obj.CarID] && obj.CarID) {
          carsObj[obj.CarID] = { ...carsObj[obj.CarID], ...obj };
        } else {
          carsObj[obj.CarID] = { ...obj };
        }
      });
    });
  });
  return carsObj;
};

exports.getAdditionalFilters = async function (req, res) {
  const outServiceDateQry = `
    select CarID, OutServiceDate, [Is OutService] from 
    (
    select	
      "ServiceDetails"."CarID" "CarID",
      "ServiceDetails"."Out of Service" "OutServiceDate",
      "ServiceDetails"."Is OutService",
      row_number() over (partition by "ServiceDetails"."CarID" order by "ServiceDetails"."Out of Service" desc) as rn
      
    from "Service Details" "ServiceDetails"
      join "Cars" "Car" on "ServiceDetails"."CarID" = "Car"."CarID"
    ) "ServiceDetails"
    where rn = 1
  `;

  const inspectionDateQry = `
    select CarID, [Inspection Expiry] from 
    (
    select	
      "Maintenance"."CarID" "CarID",
      "Maintenance"."Inspection Expiry",
      row_number() over (partition by "Maintenance"."CarID" order by "Maintenance"."Inspection Expiry" desc) as rn
      
    from "Maintenance" "Maintenance"
      join "Cars" "Car" on "Maintenance"."CarID" = "Car"."CarID"
    ) "Maintenance"
    where rn = 1
  `;
  const registrationExpiry = `
    select CarID, [Registration Expiry] from 
    (
    select	
      "Maintenance"."CarID" "CarID",
      "Maintenance"."Registration Expiry",
      row_number() over (partition by "Maintenance"."CarID" order by "Maintenance"."Registration Expiry" desc) as rn
      
    from "Maintenance" "Maintenance"
      join "Cars" "Car" on "Maintenance"."CarID" = "Car"."CarID"
    ) "Maintenance"
    where rn = 1
  `;

  const driveQuery = `SELECT [DriveID],[Drive Train] FROM [Drive Train]`;

  try {
    const pool = await poolPromise;
    const result = await Promise.all([
      getQueryPromise("outServiceDates", outServiceDateQry, pool),
      getQueryPromise("inspectionDates", inspectionDateQry, pool),
      getQueryPromise("registrationDates", registrationExpiry, pool),
    ]);
    // .input('input_parameter', sql.Int, req.params.id)

    res.json(reconcileFilters(result));
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.updateCarDetail = async function (req, res) {
  const carMutation = `
  UPDATE [Cars]
  SET 
    [YearID] = @input_yearid,
    [MakeID] = @input_makeid,
    [ModelID] = @input_modelid,
    [EngineID] = @input_engineid,
    [BodyTypeID] = @input_bodytypeid,
    [VIN] = @input_vin
  WHERE 
    [CarID] = @input_carID`;

  const input_yearid = req.body["YearID"] || null;
  const input_makeid = req.body["MakeID"] || null;
  const input_modelid = req.body["ModelID"] || null;
  const input_engineid = req.body["EngineID"] || null;
  const input_bodytypeid = req.body["BodyTypeID"] || null;
  const Mileage = req.body["Mileage"] || null;
  const input_vin = req.body["VIN"] || null;
  const input_carID = req.body["CarID"];

  try {
    const pool = await poolPromise;
    const result = await Promise.all([
      getQueryPromise("car", carMutation, pool, [
        ["input_carID", "Int", input_carID],
        ["input_yearid", "Int", input_yearid],
        ["input_makeid", "Int", input_makeid],
        ["input_modelid", "Int", input_modelid],
        ["input_engineid", "Int", input_engineid],
        ["input_bodytypeid", "Int", input_bodytypeid],
        ["input_vin", "NVarChar", input_vin],
      ]),
    ]);
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getFeatures = async function (req, res) {
  var accessQuery = `
  select
          "CarFeatures"."FeatureID" "FeatureID"
          ,"CarFeatures"."CarID" "CarID"
          ,"Car"."VIN" "CarVIN"
          ,"CarBodyType"."Body Type" "CarBodyTypeBodyType"
          ,"CarDrive"."Drive Train" "CarDriveDriveTrain"
          ,"CarEngine"."Engine" "CarEngineEngine"
          ,"CarMake"."Make" "CarMakeMake"
          ,"CarModel"."Model" "CarModelModel"
          ,"CarYear"."Year" "CarYearYear"
          ,"CarFeatures"."Lojack" "Lojack"
          ,"CarFeatures"."Hitch" "Hitch"
          ,"CarFeatures"."Cage" "Cage"
          ,"CarFeatures"."PushBumper" "PushBumper"
          ,"CarFeatures"."PatrolReady" "PatrolReady"
          ,"CarFeatures"."SpareTire" "SpareTire"
          ,"CarFeatures"."SpareKeys" "SpareKeys"
          ,"CarFeatures"."CompartmentBox" "CompartmentBox"
          ,"CarFeatures"."ToCounty" "ToCounty"
          from "Car Features" "CarFeatures"
          left join "Cars" "Car" on "CarFeatures"."CarID" = "Car"."CarID"
          left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
          left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
          left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
          left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
          left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
          left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
		  Where "CarFeatures"."CarID" =  @input_parameter
      ORDER BY FeatureID DESC`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getAssignments = async function (req, res) {
  var accessQuery = `
  select
	"Assignments"."ID" "ID"
	,"Assignments"."CarID" "CarID"
	,"Car"."VIN" "CarVIN"
	,"CarBodyType"."Body Type" "CarBodyTypeBodyType"
	,"CarDrive"."Drive Train" "CarDriveDriveTrain"
	,"CarEngine"."Engine" "CarEngineEngine"
	,"CarMake"."Make" "CarMakeMake"
	,"CarModel"."Model" "CarModelModel"
	,"CarYear"."Year" "CarYearYear"
	,"Assignments"."Assignment Dept" "AssignmentDept"
	,"AssignmentDept"."Dept" "AssignmentDeptDept"
	,"Assignments"."Driver 1" "Driver1"
	,"Driver1"."Driver" "Driver1Driver"
	,"Assignments"."Driver 2" "Driver2"
	,"Driver2"."Driver" "Driver2Driver"
	,"Assignments"."Unit" "Unit"
	,"Unit"."Unit Desc" "UnitUnit"
	,"Assignments"."Condition" "Condition"
	,"Condition"."Condition" "ConditionCondition"
	,"Assignments"."UseType" "UseType"
  ,"UseType"."Use Type" "UseTypeUseType"
  ,"ITFunctions"."LPR" "LPR"
  ,"ITFunctions"."SWModemSerialNumber" "SWModemSerialNumber"
  ,"ITFunctions"."LPRNotes" "LPRNotes"
from "Assignments" "Assignments"
	left join "Cars" "Car" on "Assignments"."CarID" = "Car"."CarID"
	left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
	left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
	left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
	left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
	left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
	left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
	left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
	left join "Drivers" "Driver1" on "Assignments"."Driver 1" = "Driver1"."DriverID"
	left join "Drivers" "Driver2" on "Assignments"."Driver 2" = "Driver2"."DriverID"
	left join "Units" "Unit" on "Assignments"."Unit" = "Unit"."UnitID"
	left join "Condition" "Condition" on "Assignments"."Condition" = "Condition"."ConditionID"
  left join "Use Type" "UseType" on "Assignments"."UseType" = "UseType"."UseTypeID"
  left join "IT Functions" "ITFunctions" on "Car"."CarID" = "ITFunctions"."CarID"
		  Where "Assignments"."CarID" =  @input_parameter
      ORDER BY ID DESC`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getServiceDetails = async function (req, res) {
  var accessQuery = `
  select
  "ServiceDetails"."ServiceID" "ServiceID"
	,"ServiceDetails"."CarID" "CarID"
	,"Car"."VIN" "CarVIN"
	,"CarBodyType"."Body Type" "CarBodyTypeBodyType"
	,"CarDrive"."Drive Train" "CarDriveDriveTrain"
	,"CarEngine"."Engine" "CarEngineEngine"
	,"CarMake"."Make" "CarMakeMake"
	,"CarModel"."Model" "CarModelModel"
	,"CarYear"."Year" "CarYearYear"
	,"ServiceDetails"."Is OutService" "IsOutService"
	,"ServiceDetails"."Out of Service" "OutofService"
	,"ServiceDetails"."Reason Out of Service" "ReasonOutofService"
	,"ReasonOutofService"."Reason Out" "ReasonOutofServiceReasonOut"
	,"ServiceDetails"."Removed by" "Removedby"
	,"Removedby"."Driver" "RemovedbyDriver"
	,"ServiceDetails"."Location" "Location"
	,"Location"."Location" "LocationLocation"
	,"ServiceDetails"."Back In Service" "BackInService"
	,"ServiceDetails"."Notes" "Notes"
from "Service Details" "ServiceDetails"
	left join "Cars" "Car" on "ServiceDetails"."CarID" = "Car"."CarID"
	left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
	left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
	left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
	left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
	left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
	left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
	left join "Reason Out" "ReasonOutofService" on "ServiceDetails"."Reason Out of Service" = "ReasonOutofService"."ReasonOutID"
	left join "Drivers" "Removedby" on "ServiceDetails"."Removed by" = "Removedby"."DriverID"
	left join "Location" "Location" on "ServiceDetails"."Location" = "Location"."LocationID"
	left join "vwCarDetails" "CarDetail" on "ServiceDetails"."CarID" = "CarDetail".CarID
		  Where "ServiceDetails"."CarID" =  @input_parameter
      ORDER BY ServiceID DESC`;

  // console.log(accessQuery);

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getRadioInfo = async function (req, res) {
  var accessQuery = `
  select
          "ITFunctions"."ID" "ID"
          ,"ITFunctions"."CarID" "CarID"
          ,"Car"."VIN" "CarVIN"
          ,"CarBodyType"."Body Type" "CarBodyTypeBodyType"
          ,"CarDrive"."Drive Train" "CarDriveDriveTrain"
          ,"CarEngine"."Engine" "CarEngineEngine"
          ,"CarMake"."Make" "CarMakeMake"
          ,"CarModel"."Model" "CarModelModel"
          ,"CarYear"."Year" "CarYearYear"
          ,"ITFunctions"."Modem" "Modem"
          ,"Modem"."Modem" "ModemModem"
          ,"ITFunctions"."InfoCop" "InfoCop"
          ,"ITFunctions"."LPR" "LPR"
          ,"ITFunctions"."LPRNotes" "LPRNotes"
          ,"ITFunctions"."SWModemSerialNumber" "SWModemSerialNumber"
          ,"ITFunctions"."AVL" "AVL"
          ,"ITFunctions"."MDT" "MDT"
          ,"ITFunctions"."Mobile Radio Model" "MobileRadioModel"
          ,"MobileRadioModel"."Mobil Radio" "MobileRadioModelMobilRadio"
          from "IT Functions" "ITFunctions"
          left join "Cars" "Car" on "ITFunctions"."CarID" = "Car"."CarID"
          left join "Body Type" "CarBodyType" on "Car"."BodyTypeID" = "CarBodyType"."BodyTypeID"
          left join "Drive Train" "CarDrive" on "Car"."DriveID" = "CarDrive"."DriveID"
          left join "Engine" "CarEngine" on "Car"."EngineID" = "CarEngine"."EngineID"
          left join "Make" "CarMake" on "Car"."MakeID" = "CarMake"."MakeID"
          left join "Model" "CarModel" on "Car"."ModelID" = "CarModel"."ModelID"
          left join "Year" "CarYear" on "Car"."YearID" = "CarYear"."YearID"
          left join "Modem" "Modem" on "ITFunctions"."Modem" = "Modem"."ModemID"
          left join "Mobil Radio" "MobileRadioModel" on "ITFunctions"."Mobile Radio Model" = "MobileRadioModel"."MobilRadioID"
		  Where "ITFunctions"."CarID" =  @input_parameter
      ORDER BY ID DESC`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getAdditionalRadio = async function (req, res) {
  var accessQuery = `
  SELECT [ID]
      ,[NewTagNumber]
      ,[SierraWirelessModemIPAddress]
      ,[SierraWirelessModemPhoneNumber]
      ,[JerseyNetModemIPAddress]
      ,[JerseyNetModemPhoneNumber]
      ,[InfoCopORI]
  FROM [${MobileTerminalDB}].[dbo].[MobileDataTerminal]
  Where [NewTagNumber] = @input_parameter`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Char, req.params.tagNum)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getKey = async function (req, res) {
  const { tagNum } = req.params;
  const query = `
    SELECT *
    FROM
      Keys
    WHERE
      TagNumber = @tag_number
    ORDER BY 
      ID DESC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("tag_number", sql.Char, tagNum)
      .query(query);
    if (result && result.recordset) {
      const payload = {
        status: 1,
        data: result.recordset,
        message: "Keys fetched successfully!",
        error: null,
      };
      return res.status(200).json(payload);
    } else {
      const payload = {
        status: 0,
        data: [],
        message: "Something went wrong! Please try again later.",
        error: null,
      };
      return res.status(500).json(payload);
    }
  } catch (err) {
    const payload = {
      status: 0,
      data: [],
      message: "Something went wrong! Please try again later.",
      error: null,
    };
    return res.status(500).json(payload);
  }
};

exports.getMaintenance = async function (req, res) {
  var accessQuery = `
  SELECT [MaintenanceID]
      ,[CarID]
      ,[Registration Expiry]
      ,[Inspection Expiry]
      ,[Next Maintenance]
      ,[Scheduled maintanence]
      ,[Current Mileage]
      ,[Next Mileage]
      ,[Notes]
      ,[CurrentHours]
      ,[DueHours]
  FROM [Maintenance]
  Where [CarID] = @input_parameter
  ORDER BY MaintenanceID DESC`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordsets);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

const getQueryPromise = (name, query, pool, inputArrays) => {
  return new Promise((resolve, reject) => {
    eval(
      `pool.request()${
        inputArrays
          ? inputArrays
              .map((arr) => `.input('${arr[0]}', sql.${arr[1]}, '${arr[2]}')`)
              .join("")
          : ""
      }`
    )
      .query(query)
      .then((res) => {
        resolve({ name, result: res.recordsets });
      });
  });
};

exports.getVehicleStatics = async function (req, res) {
  const engineQuery = `SELECT [EngineID],[Engine] FROM [Engine]`;

  const driveQuery = `SELECT [DriveID],[Drive Train] FROM [Drive Train]`;

  const makeQuery = `SELECT [MakeID],[Make] FROM [Make]`;

  const modelQuery = `SELECT [ModelID],[Model] FROM [Model]`;
  const yearQuery = `SELECT [YearID],[Year] FROM [Year]`;
  const bodyQuery = `SELECT [BodyTypeID],[Body Type] FROM [Body Type]`;
  const driverQuery = `SELECT [DriverID],[Driver],[Driver Name] FROM [Drivers]`;
  const unitQuery = `SELECT [UnitID],[Unit],[Unit Desc] FROM [Units]`;
  const conditionQuery = `SELECT [ConditionID],[Condition] FROM [Condition]`;
  const deptQuery = `SELECT [DeptID],[Dept],[Dept Desc],[GroupID] FROM [Depts]`;
  const serviceReasonQuery = `SELECT [ReasonOutID],[Reason Out] FROM [Reason Out]`;
  const useTypeQuery = `SELECT [UseTypeID],[Use Type] FROM [Use Type]`;
  const locationQuery = `SELECT [LocationID],[Location] FROM [Location]`;
  const modemQuery = `SELECT [ModemID],[Modem] FROM [Modem]`;
  const radioModelQuery = `SELECT [MobilRadioID],[Mobil Radio] FROM [Mobil Radio]`;

  try {
    const pool = await poolPromise;
    const result = await Promise.all([
      getQueryPromise("engines", engineQuery, pool),
      getQueryPromise("driveTrains", driveQuery, pool),
      getQueryPromise("makes", makeQuery, pool),
      getQueryPromise("models", modelQuery, pool),
      getQueryPromise("years", yearQuery, pool),
      getQueryPromise("bodyTypes", bodyQuery, pool),
      getQueryPromise("drivers", driverQuery, pool),
      getQueryPromise("units", unitQuery, pool),
      getQueryPromise("conditions", conditionQuery, pool),
      getQueryPromise("depts", deptQuery, pool),
      getQueryPromise("serviceReason", serviceReasonQuery, pool),
      getQueryPromise("useTypes", useTypeQuery, pool),
      getQueryPromise("locations", locationQuery, pool),
      getQueryPromise("modems", modemQuery, pool),
      getQueryPromise("radioModels", radioModelQuery, pool),
    ]);
    // .input('input_parameter', sql.Int, req.params.id)

    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

// exports.updateOneVehicle = async function (req, res) {
//   var accessQuery = "update Fleet set FirstName = @input_firstName, MiddleInitial = @input_middleInitial, LastName= @input_lastName, Suffix= @input_suffix, DOB= @input_dob, Race= @input_race, Gender= @input_gender, SSN= @input_ssn, StateofBirth= @input_stateofBirth, MaritalStatus= @input_maritalStatus, USCitizenStatus= @input_usCitizenStatus, VeteranStatus= @input_veteranStatus, DriverLicense= @input_driverLicense, StateId= @input_stateId, DLIssueDate= @input_dlIssueDate, DLExpirationDate= @input_dlExpirationDate, Branch= @input_branch, BranchActive= @input_branchActive, UpdatedBy = @input_updatedBy, UpdateDate = GETDATE() where EmployeeId = @input_employeeId";
//   //var accessQuery2 = "update CCPD_Employees set DLIssueDate= @input_dlIssueDate, DLExpirationDate= @input_dlExpirationDate where EmployeeId = @input_employeeId";

//   // console.log(req.body);
//   // var dlExpirationDate = req.body.dlExpirationDate? moment.utc(req.body.dlExpirationDate).local().format("YYYY-MM-DD 00:00"): null;
//   // console.log(dlExpirationDate);
//   // console.log(typeof dlExpirationDate);

//   try {
//     const pool = await poolPromise
//     const result = await pool.request()
//       .input('input_firstName', sql.Char, req.body.firstName)
//       .input('input_middleInitial', sql.Char, req.body.middleInitial ? req.body.middleInitial : null)
//       .input('input_lastName', sql.Char, req.body.lastName)
//       .input('input_suffix', sql.Char, req.body.suffix ? req.body.suffix : null)
//       .input('input_dob', sql.Char, req.body.dob ? req.body.dob : null)
//       .input('input_employeeId', sql.Int, req.params.id)
//       .input('input_updatedBy', sql.Char, req.body.updatedBy)
//       .query(accessQuery)
//     //.query(accessQuery2)

//     res.json(result.recordset)
//   } catch (err) {
//     console.log(err);
//     res.status(500)
//     res.send(err.message)
//   }

// };

exports.updateAssignmentDetail = async function (req, res) {
  var assignmentsMutation = `
  UPDATE [Assignments]
  SET 
    [Assignment Dept] = @input_assignmentdept,
    [Driver 1] = @input_driver1,
    [Driver 2] = @input_driver2,
    [Unit] = @input_unit,
    [Condition] = @input_condition,
    [UseType] = @input_usetype
  WHERE 
    [ID] = @input_assignmentID`;

  if (!req.body["AssignmentID"]) {
    assignmentsMutation = `insert into [Assignments] 
      ([Assignment Dept], [Driver 1], [Driver 2], Unit, Condition, UseType, CarID) 
      values 
      (@input_assignmentdept, @input_driver1, @input_driver2, @input_unit, @input_condition, @input_usetype, @input_carID)`;
  }

  // console.log("req", assignmentsMutation);

  // var itFunctionsMutation = `
  // UPDATE [IT Functions]
  // SET
  //   [Assignment Dept] = @input_assignment,
  //   [Driver 1] = @input_driver1,
  //   [Driver 2] = @input_driver2,
  //   [Unit] = @input_unit
  //   [Condition] = @input_condition,
  //   [UseType] = @input_usetype
  // WHERE [CarID] = 1`;
  const input_assignmentID = req.body["AssignmentID"];
  const input_assignmentdept = req.body["AssignmentDept"] || null;
  const input_driver1 = req.body["Driver1"] || null;
  const input_driver2 = req.body["Driver2"] || null;
  const input_unit = req.body["Unit"] || null;
  const input_condition = req.body["Condition"] || null;
  const input_usetype = req.body["UseType"] || null;

  const input_carID = req.body["CarID"];

  // console.log(JSON.stringify(req.body, null, 2))

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_assignmentID", sql.Int, input_assignmentID)
      .input("input_assignmentdept", sql.Int, input_assignmentdept)
      .input("input_driver1", sql.Int, input_driver1)
      .input("input_driver2", sql.Int, input_driver2)
      .input("input_unit", sql.Int, input_unit)
      .input("input_condition", sql.Int, input_condition)
      .input("input_usetype", sql.Int, input_usetype)
      .input("input_carID", sql.Int, input_carID)
      .query(assignmentsMutation);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateServiceDetail = async function (req, res) {
  var serviceDetailMutation = `
  UPDATE [Service Details]
  SET 
    [Is OutService] = @input_isoutservice,
    [Out of Service] = @input_outofservice,
    [Reason Out of Service] = @input_reasonout,
    [Removed by] = @input_removedby,
    [Location] = @input_location,
    [Back In Service] = @input_backinservice,
    [Notes] = @input_notes
  WHERE 
    [ServiceID] = @input_serviceID`;
  // console.log()

  // var itFunctionsMutation = `
  // UPDATE [IT Functions]
  // SET
  //   [Assignment Dept] = @input_assignment,
  //   [Driver 1] = @input_driver1,
  //   [Driver 2] = @input_driver2,
  //   [Unit] = @input_unit
  //   [Condition] = @input_condition,
  //   [UseType] = @input_usetype
  // WHERE [CarID] = 1`;
  const input_isoutservice = req.body["Is OutService"] || 0;
  const input_outofservice = req.body["Out of Service"] || null;
  const input_reasonout = req.body["Reason Out of Service"] || null;
  const input_removedby = req.body["Removed by"] || null;
  const input_location = req.body["Location"] || null;
  const input_backinservice = req.body["Back In Service"] || null;
  const input_notes = req.body["Notes"] || null;
  const input_serviceID = req.body["ServiceID"];
  //console.log("service id", input_serviceID);

  // console.log(JSON.stringify(req.body, null, 2))

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_isoutservice", sql.Bit, input_isoutservice)
      .input("input_outofservice", sql.Date, input_outofservice)
      .input("input_reasonout", sql.Int, input_reasonout)
      .input("input_removedby", sql.Int, input_removedby)
      .input("input_location", sql.Int, input_location)
      .input("input_backinservice", sql.Date, input_backinservice)
      .input("input_notes", sql.NVarChar, input_notes)
      .input("input_serviceID", sql.Int, input_serviceID)
      .query(serviceDetailMutation);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateRadioDetail = async function (req, res) {
  var radioDetailMutation = `
  UPDATE [IT Functions]
  SET 
    [Modem] = @input_modem,
    [InfoCop] = @input_infocop,
    [LPR] = @input_LPR,
    [AVL] = @input_AVL,
    [MDT] = @input_MDT,
    [Mobile Radio Model] = @input_radiomodel,
    [LPRNotes] = @input_LPRNotes
  WHERE 
    [ID] = @input_radioID`;
  // console.log()

  // var itFunctionsMutation = `
  // UPDATE [IT Functions]
  // SET
  //   [Assignment Dept] = @input_assignment,
  //   [Driver 1] = @input_driver1,
  //   [Driver 2] = @input_driver2,
  //   [Unit] = @input_unit
  //   [Condition] = @input_condition,
  //   [UseType] = @input_usetype
  // WHERE [CarID] = 1`;
  const input_modem = req.body["Modem"];
  const input_infocop = req.body["InfoCop"];
  const input_LPR = req.body["LPR"];
  const input_AVL = req.body["AVL"];
  const input_MDT = req.body["MDT"];
  const input_radiomodel = req.body["Mobile Radio Model"];
  const input_LPRNotes = req.body["LPRNotes"];
  const input_radioID = req.body["RadioID"];

  // console.log(JSON.stringify(req.body, null, 2))

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_modem", sql.Int, input_modem)
      .input("input_infocop", sql.Bit, input_infocop)
      .input("input_LPR", sql.Bit, input_LPR)
      .input("input_AVL", sql.Bit, input_AVL)
      .input("input_MDT", sql.Bit, input_MDT)
      .input("input_radiomodel", sql.Int, input_radiomodel)
      .input("input_LPRNotes", sql.NVarChar, input_LPRNotes)
      .input("input_radioID", sql.Int, input_radioID)
      .query(radioDetailMutation);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateMaintenanceDetail = async function (req, res) {
  var maintenanceDetailMutation = `
  UPDATE [Maintenance]
  SET 
    [Registration Expiry] = @input_regexp,
    [Inspection Expiry] = @input_inspexp,
    [Next Maintenance] = @input_nextmaint,
    [Scheduled maintanence] = @input_schedmaint,
    [Current Mileage] = @input_currmile,
    [Next Mileage] = @input_nextmile,
    [Notes] = @input_notes
  WHERE 
    [MaintenanceID] = @input_maintenanceID`;
  // console.log()

  // var itFunctionsMutation = `
  // UPDATE [IT Functions]
  // SET
  //   [Assignment Dept] = @input_assignment,
  //   [Driver 1] = @input_driver1,
  //   [Driver 2] = @input_driver2,
  //   [Unit] = @input_unit
  //   [Condition] = @input_condition,
  //   [UseType] = @input_usetype
  // WHERE [CarID] = 1`;
  const input_regexp = req.body["Registration Expiry"] || 0;
  const input_inspexp = req.body["Inspection Expiry"] || null;
  const input_nextmaint = req.body["Next Maintenance"] || null;
  const input_schedmaint = req.body["Scheduled maintanence"] || null;
  const input_currmile = req.body["Current Mileage"] || null;
  const input_nextmile = req.body["Next Mileage"] || null;
  const input_notes = req.body["Notes"] || null;
  const input_maintenanceID = req.body["MaintenanceID"];

  // console.log(JSON.stringify(req.body, null, 2))

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_regexp", sql.Date, input_regexp)
      .input("input_inspexp", sql.Date, input_inspexp)
      .input("input_nextmaint", sql.Date, input_nextmaint)
      .input("input_schedmaint", sql.Date, input_schedmaint)
      .input("input_currmile", sql.Int, input_currmile)
      .input("input_nextmile", sql.Int, input_nextmile)
      .input("input_notes", sql.NVarChar, input_notes)
      .input("input_maintenanceID", sql.Int, input_maintenanceID)
      .query(maintenanceDetailMutation);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateFeatureDetail = async function (req, res) {
  var featureDetailMutation = `
  UPDATE [Car Features]
  SET 
    [Lojack] = @input_lojack,
    [Hitch] = @input_hitch,
    [Cage] = @input_cage,
    [PushBumper] = @input_bumper,
    [PatrolReady] = @input_patrol,
    [SpareTire] = @input_tire,
    [SpareKeys] = @input_keys,
    [CompartmentBox] = @input_compartment,
    [ToCounty] = @input_county
  WHERE 
    [FeatureID] = @input_featureID`;
  // console.log()

  // var itFunctionsMutation = `
  // UPDATE [IT Functions]
  // SET
  //   [Assignment Dept] = @input_assignment,
  //   [Driver 1] = @input_driver1,
  //   [Driver 2] = @input_driver2,
  //   [Unit] = @input_unit
  //   [Condition] = @input_condition,
  //   [UseType] = @input_usetype
  // WHERE [CarID] = 1`;
  const input_lojack = req.body["Lojack"];
  const input_hitch = req.body["Hitch"];
  const input_cage = req.body["Cage"];
  const input_bumper = req.body["PushBumper"];
  const input_patrol = req.body["PatrolReady"];
  const input_tire = req.body["SpareTire"];
  const input_keys = req.body["SpareKeys"];
  const input_compartment = req.body["CompartmentBox"];
  const input_county = req.body["ToCounty"];
  const input_featureID = req.body["FeatureID"];

  // console.log(JSON.stringify(req.body, null, 2))

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_lojack", sql.Bit, input_lojack)
      .input("input_hitch", sql.Bit, input_hitch)
      .input("input_cage", sql.Bit, input_cage)
      .input("input_bumper", sql.Bit, input_bumper)
      .input("input_patrol", sql.Bit, input_patrol)
      .input("input_tire", sql.Bit, input_tire)
      .input("input_keys", sql.Bit, input_keys)
      .input("input_compartment", sql.Bit, input_compartment)
      .input("input_county", sql.Bit, input_county)
      .input("input_featureID", sql.Int, input_featureID)
      .query(featureDetailMutation);

    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.uploadVehiclePhoto = async function (req, res) {
  const accessQuery = `
    INSERT INTO [CarImages](CarID, Image)
    VALUES (@input_id, CAST(@input_image AS VARBINARY(MAX)))
  `;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_id", sql.Int, req.body.CarID)
      .input("input_image", sql.VarChar, req.body.image)
      .query(accessQuery);

    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.findVehiclePhotos = async function (req, res) {
  const accessQuery = `
    SELECT * FROM [CarImages]
    WHERE CarID = @input_parameter
    ORDER BY ID ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    if (result.recordset && result.recordset.length) {
      const records = result.recordset.map((o) => ({
        ...o,
        Image: convertBinaryToBase64Image(o.Image),
      }));
      res.send(records);
    } else {
      res.send([
        {
          Image:
            "data:image/png;base64,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",
        },
      ]);
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

const extractImage = (dbImg) => {
  return String(dbImg)
    .split(" ") //Split string in array of binary chars
    .map((bin) => String.fromCharCode(parseInt(bin, 2))) //Map every binary char to real char
    .join("");
};

exports.addDept = async function (req, res) {
  var deptAdd = `insert into [Depts] (Dept, Dept Desc) values (@input_dept, @input_desc)`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_dept", sql.NVarChar, req.body.Dept)
      .input("input_desc", sql.NVarChar, req.body["DeptDesc"])
      .query(deptAdd);

    return res.status(200).json({ status: "added" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.findBikeById = async function (req, res) {
  const accessQuery = `SELECT
  ID,
  SerialNumber,
  BikeNumber,
  Model,
  Size,
  AssignmentLocation,
  OutOfService,
  OutOfServiceLocation,
  TypeOfIssues,
  OutOfServiceDate,
  InServiceDate,
  Status,
  IssueType
  FROM [Bikes]
  WHERE [Bikes].[ID] = @input_parameter`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getBikeImagesByBikeId = async function (req, res) {
  const accessQuery = `
    SELECT * FROM [Bike_Image] where BikeId = @input_parameter
    ORDER BY Id ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_parameter", sql.Int, req.params.id)
      .query(accessQuery);

    if (result.recordset && result.recordset.length) {
      const records = result.recordset.map((o) => ({
        ...o,
        Bike_Image: convertBinaryToBase64Image(o.Bike_Image),
      }));
      res.send(records);
    } else {
      res.send([
        {
          Bike_Image:
            "data:image/png;base64,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",
        },
      ]);
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

const convertBinaryToBase64Image = (image) => {
  return Buffer.from(image).toString();
};

exports.uploadBikeImage = async function (req, res) {
  const accessQuery = `
    INSERT INTO [Bike_Image](BikeId, Bike_Image)
    VALUES(@input_bike_id, CAST(@input_image AS VARBINARY(MAX)))
  `;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("input_bike_id", sql.Int, req.body.bikeId)
      .input("input_image", sql.VarChar, req.body.image)
      .query(accessQuery);
    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getBikeStatus = async function (req, res) {
  const accessQuery = `
    SELECT * FROM [BikeStatus]
    WHERE Description <> ''
    ORDER BY Description ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    return res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getYesNoFlag = async function (req, res) {
  const accessQuery = `
    SELECT * FROM [FlagYN]
    WHERE Description <> ''
    ORDER BY Description DESC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    return res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getIssueTypes = async function (req, res) {
  const accessQuery = `
    SELECT * FROM [BikeIssueType]
    WHERE Description <> ''
    ORDER BY Description ASC
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    return res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateBikeBasicDetails = async function (req, res) {
  const accessQuery = `
    UPDATE [Bikes]
    SET
      AssignmentLocation = @input_assignment_location,
      BikeNumber = @input_bike_number,
      InServiceDate = @input_in_service_date,
      Model = @input_model,
      OutOfService = @input_out_of_service,
      OutOfServiceDate = @input_out_of_service_date,
      OutOfServiceLocation = @input_out_of_service_location,
      Size = @input_size,
      IssueType = @input_issue_type,
      TypeOfIssues = @input_type_of_issues,
      UpdatedBy = @input_updated_by,
      UpdateDate = @input_updated_date
    WHERE
      ID = @input_id
  `;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input(
        "input_assignment_location",
        sql.VarChar,
        req.body.AssignmentLocation
      )
      .input("input_bike_number", sql.VarChar, req.body.BikeNumber)
      .input("input_in_service_date", sql.DateTime2, req.body.InServiceDate)
      .input("input_model", sql.VarChar, req.body.Model)
      .input("input_out_of_service", sql.VarChar, req.body.OutOfService)
      .input(
        "input_out_of_service_date",
        sql.DateTime2,
        req.body.OutOfServiceDate
      )
      .input(
        "input_out_of_service_location",
        sql.VarChar,
        req.body.OutOfServiceLocation
      )
      .input("input_size", sql.VarChar, req.body.Size)
      .input("input_issue_type", sql.VarChar, req.body.IssueType)
      .input("input_type_of_issues", sql.VarChar, req.body.TypeOfIssues)
      .input("input_updated_by", sql.VarChar, req.body.UpdatedBy)
      .input("input_updated_date", sql.DateTime2, req.body.UpdateDate)
      .input("input_id", sql.Int, req.params.id)
      .query(accessQuery);
    res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getVehiclesForDropdown = async function (req, res) {
  const accessQuery = `
    SELECT CarID AS value, [CG TAG] AS label FROM [vwCarDetails]
    ORDER BY CarID ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getVehiclesServiceDetailsByCarId = async function (req, res) {
  const { tag } = req.params;
  // sd.[AssignedUnit],
  const accessQuery = `
  SELECT TOP (1)
    c.[CarID] AS CarId,
    c.[CG TAG] AS Tag,
    y.[Year],
    m.[Make],
    mo.[Model],
    sd.[OutOfServiceDate] AS OutOfService,
    sd.[BackInServiceDate] AS BackInServiceDate,
   
    sd.[NextScheduledOilChangeDate] AS ScheduledOilChangeDate,
    co.Condition,
    ma.[Next Mileage] AS NextMileage,
    ma.[Current Mileage] AS CurrentMileage,
    ma.[Scheduled maintanence] AS ScheduledMaintanenceDate,
    ma.[Registration Expiry] AS RegistrationExpiryDate,
    ma.[Inspection Expiry] AS InspectionExpiryDate,
    ma.[CurrentHours],
    ma.[DueHours],
    "Assignments"."Assignment Dept" "AssignmentDept",
  "AssignmentDept"."Dept" "AssignedUnit"
  FROM
    Cars AS c
  LEFT JOIN
    [Year] AS y ON y.YearID = c.YearID
  LEFT JOIN
    [Make] AS m ON m.[MakeID] = c.[MakeID]
  LEFT JOIN
    [Model] AS mo ON mo.[ModelID] = c.[ModelID]
  LEFT JOIN
    [ServiceDetails] AS sd ON sd.[CarId] = c.[CarID]
  LEFT JOIN
    Assignments AS a ON a.CarID = sd.CarId
  LEFT JOIN
    Condition AS co ON co.ConditionID = a.Condition
  LEFT JOIN
    Maintenance AS ma ON ma.CarID = c.CarID

    left join Assignments on  Assignments.CarID = c.CarID
	 left join "Depts" "AssignmentDept" on "Assignments"."Assignment Dept" = "AssignmentDept"."DeptID"
  WHERE
    c.[CG TAG] = @input_tag
  `;
  // const accessQuery = `
  //   SELECT TOP(1)
  //   [CG TAG] AS Tag, Year, Make, Model, [Reason Out] AS Reason, [Out of Service] AS OutOfService,
  //   [Is OutService] AS IsOutService, [Back In Service] AS BackInServiceDate,
  //   [Dept Desc] AS AssignedUnit, Condition, [Next Mileage] AS NextMileage,
  //   [Current Mileage] AS CurrentMileage, [Scheduled maintanence] AS ScheduledMaintanenceDate,
  //   [Registration Expiry] AS RegistrationExpiryDate, [Inspection Expiry] AS InspectionExpiryDate
  //   FROM [vwCarServiceDetails]
  //   WHERE [CG TAG] = @input_tag
  // `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_tag", sql.Char, tag)
      .query(accessQuery);
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getVehicleLocationsForDropdown = async function (req, res) {
  const accessQuery = `
    SELECT ID AS value, Description AS label FROM [VehicleLocation]
    WHERE Description <> '' AND isactive=1
    ORDER BY Description ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getKeyLocationsForDropdown = async function (req, res) {
  const accessQuery = `
    SELECT ID AS value, Description AS label FROM [KeyLocation]
    WHERE Description <> ''
    ORDER BY Description ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.fetchAllVehiclesOutOfService = async function (req, res) {
  const query = `SELECT ServiceDetails.CarId AS ServiceDetails_CarId,
  ServiceDetails.Tag AS ServiceDetails_Tag,
  ServiceDetails.ServiceType AS ServiceDetails_ServiceType,
  CONCAT(ServiceDetails.Year,' ',ServiceDetails.Make,' ',ServiceDetails.Model,' ',ServiceDetails.AssignedUnit) AS ServiceDetails_Year_ServiceDetails_Make_ServiceDetails_Model_ServiceDetails_AssignedUnit,
  CONCAT(ServiceDetails.AssignedLocation,' ',ServiceDetails.KeyLocation) AS ServiceDetails_AssignedLocation_ServiceDetails_KeyLocation,
  ServiceDetails.ITIssue AS ServiceDetails_ITIssue,ServiceDetails.Status AS ServiceDetails_Status,
  ServiceDetails.OutOfServiceDate AS ServiceDetails_OutOfServiceDate,ServiceDetails.OutOfServiceDate AS ServiceDetails_OutOfServiceDate,
  ServiceDetails.AssignedLocation AS ServiceDetails_AssignedLocation,
  ServiceDetails.Problems AS ServiceDetails_Problems,ServiceDetails.Comments AS ServiceDetails_Comments,
  ServiceDetails.ID AS ServiceDetails_ID,ServiceDetails.Year AS ServiceDetails_Year,ServiceDetails.Make AS ServiceDetails_Make,
  ServiceDetails.Model AS ServiceDetails_Model,ServiceDetails.AssignedUnit AS ServiceDetails_AssignedUnit,
  ServiceDetails.KeyLocation AS ServiceDetails_KeyLocation FROM ServiceDetails WHERE (ServiceDetails.Status  = 'Out of service') ORDER BY ServiceDetails.Id DESC`;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    const response = {
      data: result.recordset,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.fetchVehiclesOutOfService = async function (req, res) {
  const { page, table, primaryKey } = req.body;
  const pId = primaryKey ? primaryKey : null;
  const payload = { ...req.body };
  const query = basicSelectFilterQueryBuilder(table, payload, false, pId);
  const queryCnt = basicSelectFilterQueryBuilder(table, payload, true, pId);
  const additionalWhere = req.body && req.body.additionalWhere;
  const washAdditionalWhere = [
    ...additionalWhere,
    {
      dbColumn: "ServiceDetails.ServiceType",
      value: ` = 'wash'`,
    },
  ];
  const wipeDownAdditionalWhere = [
    ...additionalWhere,
    {
      dbColumn: "ServiceDetails.ServiceType",
      value: ` = 'wipe down'`,
    },
  ];
  const fuelAdditionalWhere = [
    ...additionalWhere,
    {
      dbColumn: "ServiceDetails.ServiceType",
      value: ` = 'fuel'`,
    },
  ];
  const northAdditionalWhere = [
    ...additionalWhere,
    {
      dbColumn: "ServiceDetails.AssignedUnit",
      value: ` LIKE '%north%'`,
    },
  ];
  const southAdditionalWhere = [
    ...additionalWhere,
    {
      dbColumn: "ServiceDetails.AssignedUnit",
      value: ` LIKE '%south%'`,
    },
  ];
  const washQueryCnt = basicSelectFilterQueryBuilder(
    table,
    { ...req.body, additionalWhere: washAdditionalWhere },
    true,
    pId
  );
  const wipeDownQueryCnt = basicSelectFilterQueryBuilder(
    table,
    { ...req.body, additionalWhere: wipeDownAdditionalWhere },
    true,
    pId
  );
  const fuelQueryCnt = basicSelectFilterQueryBuilder(
    table,
    { ...req.body, additionalWhere: fuelAdditionalWhere },
    true,
    pId
  );
  const northQueryCnt = basicSelectFilterQueryBuilder(
    table,
    { ...req.body, additionalWhere: northAdditionalWhere },
    true,
    pId
  );
  const southQueryCnt = basicSelectFilterQueryBuilder(
    table,
    { ...req.body, additionalWhere: southAdditionalWhere },
    true,
    pId
  );
  try {
    const pool = await poolPromise;
    const resultCnt = await pool.request().query(queryCnt);
    const washResultCnt = await pool.request().query(washQueryCnt);
    const wipeDownResultCnt = await pool.request().query(wipeDownQueryCnt);
    const fuelResultCnt = await pool.request().query(fuelQueryCnt);
    const northResultCnt = await pool.request().query(northQueryCnt);
    const southResultCnt = await pool.request().query(southQueryCnt);
    const [{ totalCount }] = resultCnt.recordset;
    const [{ totalCount: washTotalCount }] = washResultCnt.recordset;
    const [{ totalCount: wipeDownTotalCount }] = wipeDownResultCnt.recordset;
    const [{ totalCount: fuelTotalCount }] = fuelResultCnt.recordset;
    const [{ totalCount: northTotalCount }] = northResultCnt.recordset;
    const [{ totalCount: southTotalCount }] = southResultCnt.recordset;
    const result = await pool.request().query(query);
    console.log("===============",query,'========================')
    const response = {
      data: result.recordset,
      page,
      totalCount,
      washTotalCount,
      wipeDownTotalCount,
      fuelTotalCount,
      northTotalCount,
      southTotalCount,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.fetchVehiclesInService = async function (req, res) {
  const tableName = "ServiceDetails";
  const parentTableName = "Cars";
  const defaultIdField = "Id";
  const {
    fields,
    page,
    pageSize,
    orderBy,
    orderDirection,
    filters,
    search,
    additionalWhere,
    additionalWhereOr,
  } = req.body;
  let query = "";
  let queryCnt = `
    SELECT COUNT(${tableName}.${defaultIdField}) AS totalCount FROM ${parentTableName} AS c
    OUTER APPLY(
      SELECT TOP(1) *
      FROM ${tableName} AS sd
      WHERE sd.CarId = c.CarID
      ORDER BY sd.Id DESC
    ) AS ${tableName}
  `;

  const fieldsStr = prepareFieldsStr(fields);
  query = `
      SELECT ${fieldsStr} FROM ${parentTableName} AS c
      OUTER APPLY(
        SELECT TOP(1) *
        FROM ${tableName} AS sd
        WHERE sd.CarId = c.CarID
        ORDER BY sd.Id DESC
      ) AS ${tableName}
    `;

  const whereClauseOfORArr = [];
  if (search) {
    const arr = prepareForGlobalSearch(fields, search);
    whereClauseOfORArr.push(...arr);
  }

  if (additionalWhereOr && additionalWhereOr.length > 0) {
    additionalWhereOr.forEach((o) => {
      const { dbColumn, value, concatMask } = o;
      if (dbColumn) {
        let colm = dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          colm = prepareConcatFieldStr(dbColumn, concatMask);
        }
        whereClauseOfORArr.push(`${colm} ${value}`);
      }
    });
  }

  const whereClauseArr = [];
  if (filters && filters.length) {
    const { and, or } = prepareForFilters(filters, fields);
    whereClauseArr.push(...and);
    whereClauseOfORArr.push(...or);
  }

  if (additionalWhere && additionalWhere.length > 0) {
    additionalWhere.forEach((o) => {
      const { dbColumn, value, concatMask } = o;
      if (dbColumn) {
        let colm = dbColumn;
        const pipeIndex = colm.indexOf("|");
        if (pipeIndex >= 0) {
          colm = prepareConcatFieldStr(dbColumn, concatMask);
        }
        whereClauseArr.push(`${colm} ${value}`);
      }
    });
  }

  const whereClauseStr = prepareWhereStr(whereClauseOfORArr, whereClauseArr);
  if (whereClauseStr) {
    query += ` ${whereClauseStr}`;
    queryCnt += ` ${whereClauseStr}`;
  }

  if (orderDirection && orderBy && orderBy.dbColumn) {
    const orderByStr = prepareOrderByStr(fields, orderBy, orderDirection);
    query += orderByStr;
  } else {
    query += ` ORDER BY ${tableName}.${defaultIdField} DESC `;
  }

  const pageStr = preparePagination(page, pageSize);
  query += pageStr;
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

exports.fetchVehiclesOutOfServiceHistory = async function (req, res) {
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

exports.fetchVehiclesInServiceHistory = async function (req, res) {
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

exports.getVehiclesDetailsWithMileage = async function (req, res) {
  const { id } = req.params;
  const accessQuery = `
    SELECT TOP(1)
    ID, CarId, Tag, Year, Make, Model, NextScheduledOilChangeDate, NextScheduledOilChangeMileage, AssignedUnit
    FROM [ServiceDetails]
    WHERE CarId = @input_id
    ORDER BY ID DESC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(accessQuery);
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.newVehicleOutOfService = async function (req, res) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("CarId", sql.Int, req.body.CarId)
      .input("Tag", sql.Char, req.body.Tag)
      .input("Year", sql.Char, req.body.Year)
      .input("Make", sql.Char, req.body.Make)
      .input("Model", sql.Char, req.body.Model)
      .input("CurrentMileage", sql.Char, req.body.CurrentMileage)
      .input("CurrentHours", sql.Char, req.body.CurrentHours)
      .input("AssignedUnit", sql.Char, req.body.AssignedUnit)
      .input("AssignedLocation", sql.Char, req.body.AssignedLocation)
      .input("KeyLocation", sql.Char, req.body.KeyLocation)
      .input("Problems", sql.Char, req.body.Problems)
      .input("Comments", sql.Char, null)
      .input("CaseNumber", sql.Char, req.body.CaseNumber)
      .input("ITIssue", sql.Char, req.body.ITIssue)
      .input("ItTicketNumber", sql.Char, req.body.ITTicketNumber)
      .input("Printed", sql.Char, null)
      .input("Officer", sql.Char, req.body.Officer)
      .input("ContactPhone", sql.Char, req.body.ContactPhone)
      .input("Supervisor", sql.Char, req.body.Supervisor)
      .input("OutOfServiceDate", sql.DateTime2, req.body.OutOfServiceDate)
      .input("BackInServiceDate", sql.DateTime2, null)
      .input("BackInServiceComments", sql.Char, null)
      .input("ServiceLocation", sql.Char, req.body.ServiceLocation)
      .input("ServiceType", sql.Char, req.body.ServiceType)
      .input(
        "NextScheduledOilChangeDate",
        sql.DateTime2,
        req.body.NextScheduledOilChangeDate
      )
      .input(
        "NextScheduledOilChangeMileage",
        sql.Char,
        req.body.NextScheduledOilChangeMileage
      )
      .input(
        "RegistrationExpiryDate",
        sql.DateTime2,
        req.body.RegistrationExpiryDate
      )
      .input(
        "InspectionExpiryDate",
        sql.DateTime2,
        req.body.InspectionExpiryDate
      )
      .input(
        "InspectionFailedDate",
        sql.DateTime2,
        req.body.InspectionFailedDate
      )
      .input("UserRole", sql.Char, null)
      .input("Status", sql.Char, req.body.Status)
      .input("CreatedBy", sql.Char, req.body.Username)
      .output("ID_OUT", sql.Int)
      .execute(`[usp_ServiceDetails_Create_NEW]`);
    res.json({
      status: 1,
      message: "Inserted successfully",
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.newVehicleOutOfServiceReverseEntry = async function (req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CarId", sql.Int, req.body.CarId)
      .input("Tag", sql.Char, req.body.Tag)
      .input("Year", sql.Char, req.body.Year)
      .input("Make", sql.Char, req.body.Make)
      .input("Model", sql.Char, req.body.Model)
      .input("CurrentMileage", sql.Char, req.body.CurrentMileage)
      .input("CurrentHours", sql.Char, req.body.CurrentHours)
      .input("AssignedUnit", sql.Char, req.body.AssignedUnit)
      .input("AssignedLocation", sql.Char, req.body.AssignedLocation)
      .input("KeyLocation", sql.Char, req.body.KeyLocation)
      .input("Problems", sql.Char, req.body.Problems)
      .input("Comments", sql.Char, null)
      .input("CaseNumber", sql.Char, req.body.CaseNumber)
      .input("ITIssue", sql.Char, req.body.ITIssue)
      .input("ItTicketNumber", sql.Char, req.body.ITTicketNumber)
      .input("Printed", sql.Char, null)
      .input("Officer", sql.Char, req.body.Officer)
      .input("ContactPhone", sql.Char, req.body.ContactPhone)
      .input("Supervisor", sql.Char, req.body.Supervisor)
      .input("OutOfServiceDate", sql.DateTime2, req.body.OutOfServiceDate)
      .input("BackInServiceDate", sql.DateTime2, null)
      .input("BackInServiceComments", sql.Char, null)
      .input("ServiceLocation", sql.Char, req.body.ServiceLocation)
      .input("ServiceType", sql.Char, req.body.ServiceType)
      .input(
        "NextScheduledOilChangeDate",
        sql.DateTime2,
        req.body.NextScheduledOilChangeDate
      )
      .input(
        "NextScheduledOilChangeMileage",
        sql.Char,
        req.body.NextScheduledOilChangeMileage
      )
      .input(
        "RegistrationExpiryDate",
        sql.DateTime2,
        req.body.RegistrationExpiryDate
      )
      .input(
        "InspectionExpiryDate",
        sql.DateTime2,
        req.body.InspectionExpiryDate
      )
      .input(
        "InspectionFailedDate",
        sql.DateTime2,
        req.body.InspectionFailedDate
      )
      .input("UserRole", sql.Char, null)
      .input("Status", sql.Char, req.body.Status)
      .input("CreatedBy", sql.Char, req.body.Username)
      .output("ID_OUT", sql.Int)
      .execute(`[usp_ServiceDetails_Create_NEW]`);
    if (result && result.output && result.output.ID_OUT) {
      await pool
        .request()
        .input("Id", sql.Int, result.output.ID_OUT)
        .input("Tag", sql.Char, req.body.Tag)
        .input("Year", sql.Char, req.body.Year)
        .input("Make", sql.Char, req.body.Make)
        .input("Model", sql.Char, req.body.Model)
        .input("CurrentMileage", sql.Char, req.body.CurrentMileage)
        .input("CurrentHours", sql.Char, req.body.CurrentHours)
        .input("DueHours", sql.Char, null)
        .input("AssignedUnit", sql.Char, req.body.AssignedUnit)
        .input("AssignedLocation", sql.Char, req.body.AssignedLocation)
        .input("KeyLocation", sql.Char, req.body.KeyLocation)
        .input("Problems", sql.Char, req.body.Problems)
        .input("Comments", sql.Char, null)
        .input("CaseNumber", sql.Char, req.body.CaseNumber)
        .input("ITIssue", sql.Char, req.body.ITIssue)
        .input("ItTicketNumber", sql.Char, req.body.ITTicketNumber)
        .input("Printed", sql.Char, null)
        .input("Officer", sql.Char, req.body.Officer)
        .input("ContactPhone", sql.Char, req.body.ContactPhone)
        .input("Supervisor", sql.Char, req.body.Supervisor)
        .input("OutOfServiceDate", sql.DateTime2, req.body.OutOfServiceDate)
        .input("BackInServiceDate", sql.DateTime2, req.body.OutOfServiceDate) // Back in service date will also be same as out of service because it has reverse entry immediately
        .input(
          "BackInServiceComments",
          sql.Char,
          req.body.BackInServiceComments
        )
        .input("ServiceLocation", sql.Char, req.body.ServiceLocation)
        .input("ServiceType", sql.Char, req.body.ReverseServiceType)
        .input(
          "NextScheduledOilChangeDate",
          sql.DateTime2,
          req.body.NextScheduledOilChangeDate
        )
        .input(
          "NextScheduledOilChangeMileage",
          sql.Char,
          req.body.NextScheduledOilChangeMileage
        )
        .input(
          "RegistrationExpiryDate",
          sql.DateTime2,
          req.body.RegistrationExpiryDate
        )
        .input(
          "InspectionExpiryDate",
          sql.DateTime2,
          req.body.InspectionExpiryDate
        )
        .input(
          "InspectionFailedDate",
          sql.DateTime2,
          req.body.InspectionFailedDate
        )
        .input("UserRole", sql.Char, null)
        .input("Status", sql.Char, req.body.ReverseStatus)
        .input("UpdatedBy", sql.Char, req.body.Username)
        .execute(`[usp_ServiceDetails_Update]`);
      res.json({
        status: 1,
        message: "Inserted successfully",
      });
    } else {
      res.status(500);
      res.send("Something went wrong! Please try again later.");
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.updateVehicleOutOfService = async function (req, res) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .input("Tag", sql.Char, req.body.Tag)
      .input("Year", sql.Char, req.body.Year)
      .input("Make", sql.Char, req.body.Make)
      .input("Model", sql.Char, req.body.Model)
      .input("CurrentMileage", sql.Char, req.body.CurrentMileage)
      .input("CurrentHours", sql.Char, req.body.CurrentHours)
      .input("DueHours", sql.Char, req.body.DueHours)
      .input("AssignedUnit", sql.Char, req.body.AssignedUnit)
      .input("AssignedLocation", sql.Char, req.body.AssignedLocation)
      .input("KeyLocation", sql.Char, req.body.KeyLocation)
      .input("Problems", sql.Char, req.body.Problems)
      .input("Comments", sql.Char, null)
      .input("CaseNumber", sql.Char, req.body.CaseNumber)
      .input("ITIssue", sql.Char, req.body.ITIssue)
      .input("ItTicketNumber", sql.Char, req.body.ITTicketNumber)
      .input("Printed", sql.Char, req.body.Printed)
      .input("Officer", sql.Char, req.body.Officer)
      .input("ContactPhone", sql.Char, req.body.ContactPhone)
      .input("Supervisor", sql.Char, req.body.Supervisor)
      .input("OutOfServiceDate", sql.DateTime2, req.body.OutOfServiceDate)
      .input("BackInServiceDate", sql.DateTime2, req.body.BackInServiceDate)
      .input("BackInServiceComments", sql.Char, req.body.BackInServiceComments)
      .input("ServiceLocation", sql.Char, req.body.ServiceLocation)
      .input("ServiceType", sql.Char, req.body.ServiceType)
      .input(
        "NextScheduledOilChangeDate",
        sql.DateTime2,
        req.body.ScheduledOilChangeDate
      )
      .input(
        "NextScheduledOilChangeMileage",
        sql.Char,
        req.body.NextScheduledOilChangeMileage
      )
      .input(
        "RegistrationExpiryDate",
        sql.DateTime2,
        req.body.RegistrationExpiryDate
      )
      .input(
        "InspectionExpiryDate",
        sql.DateTime2,
        req.body.InspectionExpiryDate
      )
      .input(
        "InspectionFailedDate",
        sql.DateTime2,
        req.body.InspectionFailedDate
      )
      .input("UserRole", sql.Char, null)
      .input("Status", sql.Char, req.body.Status)
      .input("UpdatedBy", sql.Char, req.body.Username)
      .execute(`[usp_ServiceDetails_Update]`);
    res.json({
      status: 1,
      message: "Updated successfully",
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.deleteVehicleOutOfService = async function (req, res) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("ID", sql.Int, req.params.id)
      .input("DeletedBy", sql.Char, req.body.Username)
      .execute(`[usp_ServiceDetails_Delete]`);
    res.json({
      status: 1,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.updateMileage = async function (req, res) {
  try {
    const pool = await poolPromise;

    await pool
      .request()
      .input("CarId", sql.Int, req.body.CarId)
      .input("Tag", sql.Char, req.body.Tag)
      .input("Year", sql.Char, req.body.Year)
      .input("Make", sql.Char, req.body.Make)
      .input("Model", sql.Char, req.body.Model)
      .input("NextMileage", sql.Char, req.body.NextMileage)
      .input("CurrentMileage", sql.Char, req.body.CurrentMileage)
      .input(
        "NextScheduledOilChangeDate",
        sql.DateTime2,
        req.body.ScheduledOilChangeDate
      )
      .input("UpdatedBy", sql.Char, req.body.Username)
      .execute(`[usp_VehicleMileage_Update]`);
    res.json({
      status: 1,
      message: "Update successfully",
    });
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

exports.getVehicleOutOfServiceReportByCarId = async function (req, res) {
  const { id } = req.params;
  const accessQuery = `
    SELECT TOP(1)
    ID, CarId, Tag, Year, Make, Model, CurrentHours,
    DueHours, CurrentMileage, CaseNumber, ITIssue, ITTicketNumber,
    ServiceLocation, NextScheduledOilChangeDate, NextScheduledOilChangeMileage,
    AssignedUnit, AssignedLocation, Problems, Comments, Officer, ContactPhone,
    Supervisor, Status, OutOfServiceDate, KeyLocation, CreateDate
    FROM ServiceDetails
    WHERE CarId = @input_id
    ORDER BY ID DESC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(accessQuery);
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getServiceTypes = async function (req, res) {
  const accessQuery = `
    SELECT
      st.ID AS value, st.Description AS label
    FROM
      ServiceType AS st
    WHERE
      st.Description <> ''
    ORDER BY
      st.Description ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getLocations = async function (req, res) {
  const accessQuery = `
    SELECT
      l.LocationID AS value, l.Location AS label
    FROM
      Location AS l
    WHERE
      l.Location <> ''
    ORDER BY
      l.Location ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getVehicleStatus = async function (req, res) {
  const accessQuery = `
    SELECT
      vs.ID AS value, vs.Description AS label
    FROM
      VehicleStatus AS vs
    WHERE
      vs.Description <> ''
    ORDER BY
      vs.Description ASC
  `;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(accessQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getVehicleOutOfServiceById = async function (req, res) {
  const { id } = req.params;
  const accessQuery = `
    SELECT
      sd.*
    FROM
      ServiceDetails AS sd
    WHERE
      sd.ID = @input_id
  `;
  const accessHistoryQuery = `
    SELECT
      sdh.CurrentHours AS PrevCurrentHours,
      sdh.DueHours AS PrevDueHours,
      sdh.CurrentMileage AS PrevCurrentMileage,
      sdh.NextScheduledOilChangeMileage AS PrevNextScheduledOilChangeMileage
    FROM
      ServiceDetailsHist AS sdh
    WHERE
      sdh.Tag = @input_tag AND sdh.Status = 'Back in service'
    ORDER BY
      ID DESC
  `;
  const accessMaintenanceQuery = `
    SELECT
      m.[Current Mileage] AS NewCurrentMileage,
      m.[Next Mileage] AS NewNextScheduledOilChangeMileage,
      m.[CurrentHours] AS CurrentHours,
      m.[DueHours] AS DueHours
    FROM
      Maintenance AS m
    WHERE
      m.CarID = @input_id
    ORDER BY
      MaintenanceID DESC
  `;
  try {
    let serviceDetails = null;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(accessQuery);
    if (result.recordset && result.recordset[0]) {
      serviceDetails = { ...result.recordset[0] };
      const { Tag, CarId } = serviceDetails;
      if (Tag) {
        const tagResult = await pool
          .request()
          .input("input_tag", sql.Char, Tag)
          .query(accessHistoryQuery);
        if (tagResult.recordset && tagResult.recordset[0]) {
          serviceDetails = { ...serviceDetails, ...tagResult.recordset[0] };
        }
      }
      if (CarId) {
        const carResult = await pool
          .request()
          .input("input_id", sql.Int, CarId)
          .query(accessMaintenanceQuery);
        if (carResult.recordset && carResult.recordset[0]) {
          serviceDetails = { ...serviceDetails, ...carResult.recordset[0] };
        }
      }
    }
    res.status(200).json(serviceDetails);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getCarDetailsById = async function (req, res) {
  const { id } = req.params;
  const accessQuery = `
    SELECT
      cd.*
    FROM
      vwCarDetails AS cd
    WHERE
      cd.CarID = @input_id
  `;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_id", sql.Int, id)
      .query(accessQuery);
    if (result.recordset && result.recordset[0]) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addCarDetail = async function (req, res) {
  //CG TAG

  const getCount = `
  SELECT
  COUNT(*) AS Total
  FROM
    Cars 
  where [CG TAG] = @input_cg
`;

  try {
    const pool = await poolPromise;
    const getCountresult = await pool
      .request()
      .input("input_cg", sql.Char, req.body.CgTag)
      .query(getCount);
    if (getCountresult.recordset[0].Total > 0) {
      return res
        .status(500)
        .json({ message: "Car already exists the same tag" });
    }
  } catch (err) {
    res.status(500).send(err);
  }

  const carMutationAdd = `INSERT INTO [Cars] ([YearID],[MakeID],[ModelID],[EngineID],[BodyTypeID],[DriveID],[VIN],[MG TAG],[CG TAG]) values (@input_yearid, @input_makeid,@input_modelid,@input_engineid,@input_bodytypeid,@input_driveid,@input_vin,@input_mg,@input_cg)`;

  const MaintenanceInsert = `INSERT INTO [Maintenance] ([CarID]) 
  values (@input_carid)`;

  //CarFeatures
  const CarFeatures = `INSERT INTO [Car Features] ([CarID],Lojack,Hitch,Cage,PushBumper,PatrolReady) 
  values (@input_carid,0,0,0,0,0)`;

  //ITFunctions
  const ITFunctions = `INSERT INTO [IT Functions] ([CarID]) 
  values (@input_carid)`;

  //Service Details
  const ServiceDetails = `INSERT INTO [Service Details] ([CarID],[Is OutService]) 
  values (@input_carid,0)`;

  const insertassignments = `INSERT INTO [Assignments] ([CarID]) 
  values (@input_carid)`;

  const accessQuery = `
  SELECT
  Top 1
  CarID
  FROM
    Cars 
  ORDER BY
    CarID Desc
`;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("input_yearid", sql.Int, req.body.YearID)
      .input("input_makeid", sql.Int, req.body.MakeID)
      .input("input_modelid", sql.Int, req.body.ModelID)
      .input("input_engineid", sql.Int, req.body.EngineID)
      .input("input_bodytypeid", sql.Int, req.body.BodyTypeID)
      .input("input_driveid", sql.Int, req.body.DriveTrainId)
      .input("input_vin", sql.Char, req.body.Vin)
      .input("input_mg", sql.Char, req.body.MgTag)
      .input("input_cg", sql.Char, req.body.CgTag)
      .query(carMutationAdd);

    const result2 = await pool.request().query(accessQuery);

    const result3 = await pool
      .request()
      .input("input_carid", sql.Int, result2.recordset[0].CarID)
      .query(insertassignments);

    const result4 = await pool
      .request()
      .input("input_carid", sql.Int, result2.recordset[0].CarID)
      .query(MaintenanceInsert);

    //CarFeatures
    const CarFeatures1 = await pool
      .request()
      .input("input_carid", sql.Int, result2.recordset[0].CarID)
      .query(CarFeatures);

    //ITFunctions
    const ITFunctions1 = await pool
      .request()
      .input("input_carid", sql.Int, result2.recordset[0].CarID)
      .query(ITFunctions);

    //ServiceDetails
    // const ServiceDetails1 = await pool
    //   .request()
    //   .input("input_cg", sql.Char, req.body.CgTag)
    //   .query(Keys);

    const accessQuery1 = `
  SELECT
  Top 1
  ID
  FROM
    Keys 
  ORDER BY
    ID Desc
`;
    const resultgetKey = await pool.request().query(accessQuery1);

    //console.log("insertedid", resultgetKey.recordset[0].ID);

    return res.status(200).json({ status: 1 });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAssignmentDepartments = async function (req, res) {
  const query = `
    SELECT
      d.DeptId as Id,
      d.Dept as Title
    FROM
      Depts AS d
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    if (result && result.recordset) {
      const payload = {
        status: 1,
        data: result.recordset,
        error: "",
        message: "Records fetched successfully!",
      };
      return res.status(200).json(payload);
    } else {
      const payload = {
        status: 1,
        data: [],
        error: "",
        message: "No records found!",
      };
      return res.status(200).json(payload);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
