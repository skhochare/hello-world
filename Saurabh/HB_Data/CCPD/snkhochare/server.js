const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cor.js");
const path = require("path");
var https = require("https");
var fs = require("fs");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
var compression = require("compression");

dotenv.config({
  path: `./environment/${process.env.NODE_ENV}.env`,
});
const fleet_management_systemRoutes = require("./app/routes/fleet_management_system.routes");
const handgunRoutes = require("./app/routes/handgun.routes");
const handgunEmployeeRoutes = require("./app/routes/handgun_employee.routes");
const serviceTypeRoute = require("./app/routes/service_type.routes");
const vehicleLocationRoute = require("./app/routes/vehicle_location.routes");
const keyLocationsRoute = require("./app/routes/key_locations.routes");
const keysRoute = require("./app/routes/keysRoute.routes");
const yearsRoute = require("./app/routes/years.routes");
const makeRoute = require("./app/routes/make.routes");
const modelRoute = require("./app/routes/model.routes");
const engineRoute = require("./app/routes/engine.routes");
const driveTrainRoute = require("./app/routes/drive_train.routes");
const bodyTypeRoute = require("./app/routes/body_type.routes");
const leaveRoutes = require("./app/routes/leave.routes");
const leaveDelegationRoutes = require("./app/routes/leave_delegation.routes");
const calloutRoutes = require("./app/routes/call_out.routes");
const leaveAccuralRoutes = require("./app/routes/leave_accural.routes");
const Assignment = require("./app/routes/assignment.routes");
const Employee = require("./app/routes/employee.routes");
const EmployeeTempUnitShiftRoutes = require("./app/routes/employee_temp_unit_shift.routes");
const driverRoute = require("./app/routes/driver.routes");
const empUnitScheduleRoute = require("./app/routes/employee_unit_schedules.routes");
const trainingRoute = require("./app/routes/training.routes");
const titleRoute = require("./app/routes/title.routes");
const departmentRoutes = require("./app/routes/department.routes");
const shotSpotterRoutes = require("./app/routes/shotspotterevents.routes");
const dashboardReportRoutes = require("./app/routes/dashboard_reports.routes");
//var proxy = require('http-proxy-middleware');

// create express app
const app = express();
app.use(cors());

// app.use(
//   '/api',
//   proxy({ target: 'localhost:3001'})
// );

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb", extended: true }));

//setting middleware
app.use("/img", express.static(path.join(__dirname, "public/files"))); //Serves resources from public/files folder
app.use(
  "/profile",
  express.static(path.join(__dirname, "app/controllers/profiles"))
); //Serves resources from public/files folder
app.use(compression());
app.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
    tempFileDir: `${__dirname}/public/files/temp`,
  })
);

app.post("/upload", (req, res, next) => {
  let uploadFile = req.files.file;
  const name = uploadFile.name;
  const md5 = uploadFile.md5;
  const saveAs = `${md5}_${name}`;
  uploadFile.mv(`${__dirname}/public/files/${saveAs}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json({ status: "uploaded", name, saveAs });
  });
});

// define a simple route
app.get("/", (req, res) => {
  let apiStage = "";
  switch (process.env.NODE_ENV) {
    case "staging":
      apiStage = "Staging";
      break;
    case "prod":
      apiStage = "Production";
      break;
    default:
      apiStage = "Development";
      break;
  }
  res.json({ message: `Welcome to CCPD ${apiStage} application.` });
});

//Require MP routes
require("./app/routes/mp.routes.js")(app);

//Require HR routes
require("./app/routes/hr.routes.js")(app);

//Require ldap routes
require("./app/routes/ldap.routes.js")(app);

//Require lineup routes
require("./app/routes/lineup.routes.js")(app);

//Add in fleet routes
require("./app/routes/fleet.routes.js")(app);
require("./app/routes/role_routes.js")(app);
//Add in fleet management system routes
app.use("/fms", fleet_management_systemRoutes);

//Add in handgun routes
app.use("/handgun", handgunRoutes);

//Add in handgun employee routes
app.use("/handgun-employee", handgunEmployeeRoutes);
app.use("/serviceTypes", serviceTypeRoute);
app.use("/vehicleLocations", vehicleLocationRoute);
app.use("/keyLocations", keyLocationsRoute);
app.use("/keys", keysRoute);
app.use("/years", yearsRoute);
app.use("/make", makeRoute);
app.use("/model", modelRoute);
app.use("/drive_train", driveTrainRoute);
app.use("/body_type", bodyTypeRoute);
app.use("/engine", engineRoute);
app.use("/driver", driverRoute);

//Add in leave routes
app.use("/leave", leaveRoutes);
app.use("/leave_delegation", leaveDelegationRoutes);
//Add in callout routes
app.use("/call-out", calloutRoutes);
//Add in leave accural routes
app.use("/leave-accural", leaveAccuralRoutes);
app.use("/assignment", Assignment);
app.use("/employee", Employee);
app.use("/employee_temp_unit_shift", EmployeeTempUnitShiftRoutes);
app.use("/emp-unit-schedules", empUnitScheduleRoute);
app.use("/training", trainingRoute);
app.use("/title", titleRoute);
app.use("/department", departmentRoutes);

app.use("/shotspotterevents", shotSpotterRoutes);
app.use("/dashboard-reports", dashboardReportRoutes);

const port = process.env.PORT ? process.env.PORT : 3000;

if (process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "prod") {
  // old options
  // var options = {
  //   key: fs.readFileSync('/etc/pki/tls/private/wildkeyno.pem'),
  //   cert: fs.readFileSync('/etc/pki/tls/private/sf_bundle-g2-g1.crt'),
  //   cert: fs.readFileSync('/etc/pki/tls/private/wildcert.crt')
  // };
  const keyFilePath =
    process.env.SERVER_KEY_FILE_PATH ||
    "/etc/pki/tls/private/camdenpdwildUN.key";
  const certFilePath =
    process.env.SERVER_CERT_FILE_PATH ||
    "/etc/pki/tls/private/camdenpdwild.crt";

  const options = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
    ca: fs.readFileSync("/etc/pki/tls/private/camdenpdwild.pem"),
  };

  // listen for requests
  https.createServer(options, app).listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} else {
  //listen for requests
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
