const express = require("express");
const router = express.Router();
const {
  unitsByBureau,
  employeesByBureau,
  employeesByDivision,
  employeesByUnit,
  employeesByDepartment,
} = require("./../controllers/department.controller");

router.post("/unitsByBureau/:bureauId", unitsByBureau);
router.post("/employeesByBureau/:bureauId", employeesByBureau);
router.post("/employeesByDivision/:divisionId", employeesByDivision);
router.post("/employeesByUnit/:unitId", employeesByUnit);
router.post("/employeesByDepartment/", employeesByDepartment);

module.exports = router;
