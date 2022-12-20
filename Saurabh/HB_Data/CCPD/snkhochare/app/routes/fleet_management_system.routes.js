const express = require("express");
const router = express.Router();
const fms = require("../controllers/fleet_management_system.controller");

router.post(`/vehicles-inspection`, fms.fetchVehiclesInspection);
router.post(`/vehicles-inspection/save`, fms.insertVehiclesInspection);
router.get(`/vehicles-inspection/report/:id`, fms.getVehicleInspectionReportById);

module.exports = router;
