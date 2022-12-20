const express = require("express");
const router = express.Router();
const {
  storeRequest,
  rawBody,
  filterEvents,
} = require("./../controllers/shotspotterevents.controller");

router.post("/filter", filterEvents);
router.post("/", rawBody, storeRequest);
module.exports = router;
