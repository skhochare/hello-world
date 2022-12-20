const express = require("express");
const router = express.Router();
const driveTrainController = require("../controllers/drive_train.controller");

router.get("/", driveTrainController.getAll);

module.exports = router;
