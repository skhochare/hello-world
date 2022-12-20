const express = require("express");
const router = express.Router();
const engineController = require("../controllers/engine.controller");

router.get("/", engineController.getAll);

module.exports = router;
