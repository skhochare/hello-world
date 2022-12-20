const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee_temp_unit_shift.controller");

router.get(`/`, employee.getEmployeeTemUnitShift);
router.post(`/`, employee.insertEmployeeTempUnitShift);
router.get("/:id", employee.getSingleEmployeeTemUnitShift);
router.put("/:id", employee.updateSingleEmployeeTemUnitShift);

module.exports = router;
