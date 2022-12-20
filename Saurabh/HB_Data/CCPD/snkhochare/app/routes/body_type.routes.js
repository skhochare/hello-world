const express = require("express");
const router = express.Router();
const bodyTypeController = require("../controllers/body_type.controller");

router.get("/", bodyTypeController.getAll);

module.exports = router;
