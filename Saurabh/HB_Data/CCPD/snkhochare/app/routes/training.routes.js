const express = require("express");
const router = express.Router();
const controller = require("../controllers/training.controller");

router.get("/:id", controller.getTrainingDetails);

router.post("/getTrainingByDateRange", controller.getTrainingByDateRange);
router.post("/getAllTrainingsByDateRange", controller.getAllTrainingsByDateRange);
router.post("/filter", controller.filterTrainings);
router.post("/", controller.addTraining);

router.put("/:id", controller.updateTrainingDetails);

router.delete("/:id", controller.deleteTrainingDetails);

module.exports = router;
