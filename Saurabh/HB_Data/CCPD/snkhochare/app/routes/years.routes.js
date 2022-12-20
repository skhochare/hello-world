const express = require("express");
const router = express.Router();
const yearsController = require("../controllers/years.controller");

router.get("/", yearsController.getAll);

module.exports = router;
