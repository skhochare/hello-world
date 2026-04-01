const express = require("express");
const { healthCheck, healthCheckV2 } = require('../controllers/healthController');

const router = express.Router();

router.get("/health", healthCheck);
router.get("/health/v2", healthCheckV2);

module.exports = router;