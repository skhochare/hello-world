const express = require("express");
const router = express.Router();
const keyLocationCtrl = require("../controllers/key_locations.controller");

router.post("/filter", keyLocationCtrl.fetch);

router.post("/", keyLocationCtrl.add);

router.put("/:id", keyLocationCtrl.update);

router.get("/:id", keyLocationCtrl.get);

module.exports = router;
