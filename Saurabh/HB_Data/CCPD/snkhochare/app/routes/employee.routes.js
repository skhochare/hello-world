const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee.controller");

router.get(`/loghistory/`, employee.getEmployeeLogHistory);
router.post(`/loghistory/`, employee.bulkEmployeeLogHistory);

module.exports = router;
