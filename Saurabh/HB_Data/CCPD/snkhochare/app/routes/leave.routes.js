const express = require("express");
const router = express.Router();
const leaveCtrl = require("../controllers/leave.controller");

router.get(`/reasons`, leaveCtrl.getLeaveReasons);
router.get("/leaveReasons", leaveCtrl.getReasonforDropdown);
router.post(`/`, leaveCtrl.getLeavesByDateRange);

router.post(`/ReportFilterWise`, leaveCtrl.ReportFilterWise);
router.post(`/LeaveAccrualsFilterWise`, leaveCtrl.LeaveAccrualsFilterWise);
router.post(
  `/LeaveAccrualsDepartmentWise`,
  leaveCtrl.LeaveAccrualsDepartmentWise
);
router.post(`/save`, leaveCtrl.saveLeave);
router.get(`/getByLeaveId/:id`, leaveCtrl.getLeaveById);
router.get(`/getByLeaveEmpId/:empId`, leaveCtrl.getLeaveByEmpId);
router.get(`/getDelegates/:id`, leaveCtrl.getDelegates);
router.post(`/requested-leaves`, leaveCtrl.getRequestedLeaves);
router.post(`/accrual-balance`, leaveCtrl.getAccrualBalance);
router.post(`/getAccrualBalanceDepartmentWise`, leaveCtrl.getAccrualBalanceDepartmentWise);
router.post(`/requested-leaves-count`, leaveCtrl.getRequestedCount);
router.post(`/update-status/:id`, leaveCtrl.updateLeaveStatus);
router.post(`/cancel/:id`, leaveCtrl.cancelScheduleLeave);
router.put(`/shuffle-event-date/:id`, leaveCtrl.shuffleEventDateById);
router.post(`/updateLeave/:id`, leaveCtrl.updateLeave);
router.post(`/uploadDoc`, leaveCtrl.uploadDoc);

module.exports = router;
