const express = require("express");
const router = express.Router();
const empUnitSchedulesCtrl = require("../controllers/employee_unit_schedules.controller");

router.get(`/get/:type/:typeId`, empUnitSchedulesCtrl.getScheduleByTypeAndTypeId);

router.post(`/`, empUnitSchedulesCtrl.addSchedule);

router.put(`/`, empUnitSchedulesCtrl.updateSchedule);

router.delete(`/:type/:typeId`, empUnitSchedulesCtrl.deleteScheduleByTypeAndTypeId);

module.exports = router;
