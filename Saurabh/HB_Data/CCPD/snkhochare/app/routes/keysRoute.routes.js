const express = require("express");
const router = express.Router();
const keyLocationCtrl = require("../controllers/key_locations.controller");

router.post("/add", keyLocationCtrl.addKeys);
router.post("/allValues/update/:id", keyLocationCtrl.updateKeys);
//getAll
router.get("/getAll", keyLocationCtrl.getAll);
router.get("/:id", keyLocationCtrl.getsingle);
module.exports = router;
