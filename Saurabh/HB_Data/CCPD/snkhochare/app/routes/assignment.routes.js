const express = require("express");
const router = express.Router();
const assignmentCtrl = require("../controllers/assignment.controller");

router.post("/filter", assignmentCtrl.fetch);
router.get("/all/getDepts", assignmentCtrl.getDepts);
router.post("/", assignmentCtrl.add);
router.post("/fleet/add_dept", assignmentCtrl.add);
router.put("/:id", assignmentCtrl.update);

router.get("/:id", assignmentCtrl.get);

module.exports = router;
