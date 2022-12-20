const express = require("express");
const router = express.Router();
const title = require("../controllers/title.controller");

router.get(`/`, title.getAll);
router.get(`/:id`, title.getSingle);
router.post(`/filter`, title.filterTitles);
router.post(`/`, title.insertTitle);
router.put(`/:id`, title.updateTitle);
router.delete(`/:id`, title.deleteTitle);

module.exports = router;
