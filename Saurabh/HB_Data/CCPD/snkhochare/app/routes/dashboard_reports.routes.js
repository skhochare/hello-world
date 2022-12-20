const express = require("express");
const router = express.Router();
const {
  staffSummary,
  tempInactiveStatus,
  staffSummaryEmployeeList,
  tempInActiveLeaveEmployeesList,
} = require("../controllers/dashboard_reports.controller");
router.get("/staffSummary/:grp", staffSummary);
router.get("/tempInactiveStatus", tempInactiveStatus);
router.post("/staffSummaryEmployeeList", staffSummaryEmployeeList);
router.post("/tempInActiveLeaveEmployeesList", tempInActiveLeaveEmployeesList);

module.exports = router;
