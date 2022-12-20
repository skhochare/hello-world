const express = require("express");
const router = express.Router();
const callOutCtrl = require("../controllers/call_out.controller");

router.get(`/reasons`, callOutCtrl.getLeaveReasons);
router.get(`/seeing-physician`, callOutCtrl.getSeeingPhysician);
router.get(`/nature-illness`, callOutCtrl.getNatureOfIllness);
router.get(`/work-part-day`, callOutCtrl.getWorkPartDay);

router.post(`/filter`, callOutCtrl.fetchCallOutList);
router.post(`/ReportFilterWise`, callOutCtrl.ReportFilterWise);
router.post(`/save`, callOutCtrl.saveCallout);

module.exports = router;
