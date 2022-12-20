const fleet = require("../controllers/fleet.controller.js");
const assignmentCtrl = require("../controllers/assignment.controller");

module.exports = (app) => {
  // Retrieve all employees
  app.get("/fleet", fleet.findAll);
  app.post("/fleet/add_dept", assignmentCtrl.add);
  app.get("/fleetTag", fleet.findAllTag);
  app.get("/fleet/statics", fleet.getVehicleStatics);
  app.get("/fleet/bikes", fleet.findAllBikes);
  app.get("/fleet/addfilters", fleet.getAdditionalFilters);
  app.get("/fleet/get_assignment_departments", fleet.getAssignmentDepartments);
  app.get("/fleet/all_vehicles_out_of_service", fleet.fetchAllVehiclesOutOfService);
  app.post("/fleet/vehicles_out_of_service", fleet.fetchVehiclesOutOfService);
  app.post("/fleet/vehicles_in_service", fleet.fetchVehiclesInService);
  app.post(
    "/fleet/vehicles_out_of_service/history",
    fleet.fetchVehiclesOutOfServiceHistory
  );
  app.post(
    "/fleet/vehicles_in_service/history",
    fleet.fetchVehiclesInServiceHistory
  );
  app.post("/fleet/vehicles_out_of_service/save", fleet.newVehicleOutOfService);
  app.post(
    "/fleet/vehicles_out_of_service/save_reverse_entry",
    fleet.newVehicleOutOfServiceReverseEntry
  );
  app.put(
    "/fleet/vehicles_out_of_service/save/:id",
    fleet.updateVehicleOutOfService
  );
  app.put(
    "/fleet/vehicles_out_of_service/delete/:id",
    fleet.deleteVehicleOutOfService
  );

  app.post("/fleet/update_car", fleet.updateCarDetail);
  app.post("/fleet/add_car", fleet.addCarDetail);
  //getCountofAssignedUnits
  app.get(
    "/vehicles_out_of_service/getCountofAssignedUnits",
    fleet.getCountofAssignedUnits
  );

  app.post("/fleet/update_assignment", fleet.updateAssignmentDetail);
  app.post("/fleet/update_service", fleet.updateServiceDetail);
  app.post("/fleet/update_radio", fleet.updateRadioDetail);
  app.post("/fleet/update_maintenance", fleet.updateMaintenanceDetail);
  app.post("/fleet/update_feature", fleet.updateFeatureDetail);
  app.put("/fleet/mileage/update", fleet.updateMileage);

  app.post("/fleet/uploadVehiclePhoto", fleet.uploadVehiclePhoto);
  app.get("/fleet/getVehiclesForDropdown", fleet.getVehiclesForDropdown);
  app.get(
    "/fleet/getVehicleLocationsForDropdown",
    fleet.getVehicleLocationsForDropdown
  );
  app.get(
    "/fleet/getKeyLocationsForDropdown",
    fleet.getKeyLocationsForDropdown
  );
  app.get(
    "/fleet/getVehiclesServiceDetailsByCarId/:tag",
    fleet.getVehiclesServiceDetailsByCarId
  );
  app.get("/fleet/getServiceTypes", fleet.getServiceTypes);
  app.get("/fleet/getLocations", fleet.getLocations);
  app.get("/fleet/getVehicleStatus", fleet.getVehicleStatus);

  //Retrieve the employee
  app.get("/fleet/:id", fleet.findOne);
  app.get("/fleet/bike/status", fleet.getBikeStatus);
  app.get("/fleet/bike/flagYesNo", fleet.getYesNoFlag);
  app.get("/fleet/bike/issueTypes", fleet.getIssueTypes);
  app.get("/fleet/bike/:id", fleet.findBikeById);
  app.put("/fleet/bike/update/:id", fleet.updateBikeBasicDetails);
  app.get("/fleet/getPhotos/:id", fleet.findVehiclePhotos);
  app.get("/fleet/getBikePhotos/:id", fleet.getBikeImagesByBikeId);
  app.post("/fleet/uploadBikeImage", fleet.uploadBikeImage);

  app.get("/fleet/:id/maintenance", fleet.getMaintenance);
  app.get("/fleet/:id/assignments", fleet.getAssignments);
  app.get("/fleet/:tagNum/keys", fleet.getKey);
  app.get("/fleet/:id/features", fleet.getFeatures);
  app.get("/fleet/:id/radio", fleet.getRadioInfo);
  app.get("/fleet/:id/service", fleet.getServiceDetails);
  app.get("/fleet/getExtraRadio/:tagNum", fleet.getAdditionalRadio);

  app.get(
    "/fleet/vehicles_out_of_service/getCarDetailsById/:id",
    fleet.getCarDetailsById
  );
  app.get(
    `/fleet/vehicles_out_of_service/report/:id`,
    fleet.getVehicleOutOfServiceReportByCarId
  );
  app.get(
    `/fleet/vehicles_out_of_service/:id`,
    fleet.getVehicleOutOfServiceById
  );
};
