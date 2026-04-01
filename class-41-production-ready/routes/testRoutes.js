const express = require("express");
const { testBody, testError } = require('../controllers/testController');

// Middlewares
const logger = require("../middlewares/loggerMiddleware");

const router = express.Router();

router.post("/test-body", logger, testBody)
router.get("/error", logger, testError)

module.exports = router;