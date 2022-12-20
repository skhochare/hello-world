const hr = require("../controllers/hr.controller.js");

module.exports = (app) => {
  // Retrieve all employees
  app.get("/hr", hr.findAll);

  //Retrieve the employee
  app.get("/hr/one/:id", hr.findOne);
  //Retrieve the employee details by Badge number
  app.get("/hr/onebybadge/:id", hr.findOneByBadgeNo);
  //Retrieve the supervisor
  app.get("/hr/supervisor/:id", hr.findSupervisor);
  app.get("/hr/supervisorsByEmployeeId/:id", hr.findSupervisorsByEmployeeId);
  app.get("/hr/saveThumbToFolder", hr.saveThumbImageInFolder)
  app.get("/hr/saveFullToFolder", hr.saveFullImageInFolder)

  //Retrieve the subordinate
  app.get("/hr/subordinate/:id/:filterValue?", hr.findSubordinate);

  // Retrive Supervisors by Title
  app.get(
    "/hr/supervisorsByTitle/:titleId/:b/:d/:u",
    hr.findSupervisorsByTitle
  );

  //Retrieve the employee id
  app.get("/hr/employee/:name", hr.findEmployeeId);
  app.get("/hr/employeeUsernameById/:id", hr.findEmployeeUsernameById);
  app.get("/hr/employeeByUsername/:username", hr.findEmployeeByUsername);

  //Retrieve the employee Photo 1
  app.get("/hr/photo1/:id", hr.findPhoto1);

  //Retrieve the employee Photo 2
  app.get("/hr/photo2/:id", hr.findPhoto2);

  //Create the new employee
  app.post("/hr/newEmployee", hr.createOne);

  //Update employee record - Personal Info
  app.put("/hr/update/p1/:id", hr.updateOneP1);

  //Update employee record - Department Info
  app.put("/hr/update/p2/:id", hr.updateOneP2);

  //Update employee record - Contact Info
  app.put("/hr/update/p3/:id", hr.updateOneP3);

  //Update employee record - Emergency Contact Info
  app.put("/hr/update/p4/:id", hr.updateOneP4);

  //Update employee record - Equipment Info/ Certification/Skills Info
  app.put("/hr/update/p5/:id", hr.updateOneP5);

  //Update employee record - Insurance Info
  app.put("/hr/update/p6/:id", hr.updateOneP6);

  //Retrieve Title
  app.get("/hr/title", hr.findTitle);
  app.get("/hr/titlev2/:status", hr.findTitlev2);
  app.get("/hr/employeesByTitle/:title", hr.findEmployeesByTitle);
  app.post("/hr/transfer-report", hr.TransferReport);

  //Retrieve Status
  app.get("/hr/status", hr.findStatus);
  app.get("/hr/inActiveStatus", hr.findInActiveStatus);
  app.post("/hr/inActiveEmployee", hr.fetchInactiveEmployee);

  //Retrieve State
  app.get("/hr/state", hr.findState);

  //Retrieve handgun
  app.get("/hr/Findhandgun/:id", hr.Findhandgun);
 
  //Retrieve Education Code
  app.get("/hr/education", hr.findEducation);

  //Retrieve Race
  app.get("/hr/race", hr.findRace);

  //Update the Photo1
  app.post("/hr/updatePhoto1", hr.updatePhoto1);

  //Update the Photo2
  app.post("/hr/updatePhoto2", hr.updatePhoto2);

  //Get static employees, units, and divisions
  app.get("/hr/employees", hr.findEmployees);

  app.get("/hr/employees/:bureauId", hr.findEmployeesByBureauId);

  app.get("/hr/getEmployeeForDropdown", hr.getEmployeeForDropdown);
  app.get("/hr/getEmployeeForFleet", hr.getEmployeeForFleet);
  app.get("/hr/employeesByBureau/:id", hr.findEmployeesByBureau);
  app.get(
    "/hr/getEmployeeCommanderByEmployeeId/:id",
    hr.getEmployeeCommanderByEmployeeId
  );
  app.get(
    "/hr/getEmployeeCommanderByEmployeeIdAndBureau/:id/:bureauId",
    hr.getEmployeeCommanderByEmployeeIdAndBureau
  );

  app.get("/hr/units/:includeInActive?", hr.findUnits);

  app.get("/hr/getUnits/:id?", hr.fetchUnitsByDivision);
  app.get(
    "/hr/employees_by_units/:unit?/:bureau?/:division?",
    hr.fetchEmployeesByUnit
  );

  app.get(
    "/hr/unitsWithSupervisors/:includeInActive?",
    hr.findUnitsWithSupervisor
  );
  app.get(
    "/hr/unitsWithSupervisor/:id/:includeInActive?",
    hr.findUnitsWithSupervisorById
  );
  app.get("/hr/unitsByDivision/:id/:includeInActive?", hr.findUnitsByDivision);
  app.get(
    "/hr/unitsWithSupervisorByDivision/:id/:includeInActive?",
    hr.findUnitsWithSupervisorByDivision
  );
  app.post("/hr/units", hr.createUnit);
  app.put("/hr/units/:id", hr.updateUnitById);

  //app.get("/hr/divisions/:includeInActive?", hr.findDivisions);
  app.get("/hr/divisions/:bureauId?/:includeInActive?", hr.findDivisions);
  app.get(
    "/hr/divisionsWithCommanders/:includeInActive?",
    hr.findDivisionsCommander
  );
  app.get(
    "/hr/divisionsWithCommander/:id/:includeInActive?",
    hr.findDivisionsCommanderById
  );
  app.get(
    "/hr/divisionsByBureau/:id?/:includeInActive?",
    hr.findDivisionsByBureau
  );
  app.get("/hr/getDivisions/:id?", hr.fetchDivisions);

  app.get(
    "/hr/divisionsWithCommandersByBureau/:id/:includeInActive?",
    hr.findDivisionsCommanderByBureau
  );
  app.get("/hr/divisionByUnit/:id/:includeInActive?", hr.findDivisionByUnit);
  app.post("/hr/divisions", hr.createDivision);
  app.put("/hr/divisions/:id", hr.updateDivisionById);

  app.get("/hr/bureaus/:includeInActive?", hr.findBureaus);
  app.get(
    "/hr/bureausWithCommanders/:includeInActive?",
    hr.findBureausCommander
  );
  app.get(
    "/hr/bureausWithParentCommanders/:includeInActive?",
    hr.findBureausParentCommander
  );
  app.get(
    "/hr/bureausWithCommander/:id/:includeInActive?",
    hr.findBureausCommanderById
  );
  app.get(
    "/hr/bureauByDivision/:id/:includeInActive?",
    hr.findBureauByDivision
  );
  app.post("/hr/bureaus", hr.createBureau);
  app.post("/hr/uniqueBureau", hr.uniqueBureau);
  app.post("/hr/uniqueDivision", hr.uniqueDivision);
  app.put("/hr/bureaus/:id", hr.updateBureauById);

  app.get("/hr/branches", hr.findBranches);

  app.get("/departments/getById/:id", hr.getDepartmentById);
  app.post("/departments/filter/:type", hr.filterDepartmentsByType);
  app.post("/departments/deleteInspector", hr.deleteDepartmentInspectors);

  app.get("/export/organizationalLayout/:type", hr.organizationalLayoutExport);
};
