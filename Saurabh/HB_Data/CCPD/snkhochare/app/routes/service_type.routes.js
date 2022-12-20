const express = require("express");
const router = express.Router();
const serviceTypeCtrl = require("../controllers/service_type.controller");

router.post("/filter", serviceTypeCtrl.fetch);

router.post("/", serviceTypeCtrl.add);

router.put("/:id", serviceTypeCtrl.update);

router.get("/:id", serviceTypeCtrl.get);

module.exports = router;
