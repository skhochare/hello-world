const express = require("express");
const router = express.Router();
const modelController = require("../controllers/model.controller");

router.get("/", modelController.getAll);

module.exports = router;
