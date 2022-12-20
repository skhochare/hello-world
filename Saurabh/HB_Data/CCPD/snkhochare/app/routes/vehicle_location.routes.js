const express = require("express");
const router = express.Router();
const vehicleLocationCtrl = require("../controllers/vehicle_location.controller");

router.post("/filter", vehicleLocationCtrl.fetch);

router.post("/", vehicleLocationCtrl.add);

router.put("/:id", vehicleLocationCtrl.update);

router.get("/:id", vehicleLocationCtrl.get);

module.exports = router;
