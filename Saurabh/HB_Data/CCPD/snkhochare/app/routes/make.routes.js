const express = require("express");
const router = express.Router();
const makeController = require("../controllers/make.controller");

router.get("/", makeController.getAll);

module.exports = router;
