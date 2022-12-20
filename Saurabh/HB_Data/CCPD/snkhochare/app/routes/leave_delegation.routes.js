const express = require("express");
const router = express.Router();
const leaveDelegationCtrl = require("../controllers/leave_delegation.controller");

router.get(`/employees/:empId/:levelType`, leaveDelegationCtrl.getEmployeeList);
router.post(
  `/get-supervisors-delegates/:id`,
  leaveDelegationCtrl.getSupervisorsDelegates
);

router.post(`/get-delegates`, leaveDelegationCtrl.fetchData);
router.post(`/deleteAll`, leaveDelegationCtrl.deleteAll);
router.post(`/`, leaveDelegationCtrl.add);

router.delete(`/delete/:id`, leaveDelegationCtrl.delete);

module.exports = router;
