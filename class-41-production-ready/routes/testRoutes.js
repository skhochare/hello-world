const express = require("express");
const { testBody } = require('../controllers/testController');

// Middlewares
const logger = require("../middlewares/loggerMiddleware");

const router = express.Router();

router.post("/test-body", logger, testBody)
router.get("/error", logger, testBody)

module.exports = router;