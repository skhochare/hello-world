const express = require("express");
const { getMovieById, getMovies, updateMovie, addMovie } = require('../controllers/moviesController');

const router = express.Router();

router.get("/", getMovies);
router.post("/", addMovie);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);

module.exports = router;