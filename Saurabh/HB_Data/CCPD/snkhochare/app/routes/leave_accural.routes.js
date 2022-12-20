const express = require("express");
const router = express.Router();
const leaveAccuralCtrl = require("../controllers/leave_accural.controller");

router.get(`/get-balance/:id`, leaveAccuralCtrl.getBalanceByEmployeeId);
router.get(
  `/employee-shift-time/:id`,
  leaveAccuralCtrl.getEmployeeShiftTimeByEmployeeId
);
router.get(
  `/employee-shift-time-unit/:id`,
  leaveAccuralCtrl.getUnitShiftTimeByEmployeeId
);
router.get(
  "/by-employee-id/:id",
  leaveAccuralCtrl.getLeaveAccuralsByEmployeeId
);
router.get("/getPayDate", leaveAccuralCtrl.getPaydate);

module.exports = router;
