const express = require("express");
const router = express.Router();
const handgunEmployeeCtrl = require("../controllers/handgun_employee.controller");

router.post(`/`, handgunEmployeeCtrl.addLog);
router.post(`/filter`, handgunEmployeeCtrl.fetchGunEmployeeLogs);

module.exports = router;