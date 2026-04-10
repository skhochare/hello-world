import express from "express";
import { addMovie, updateMovie, getAllMovies, deleteMovie } from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/add-movie", addMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.put("/update-movie", updateMovie);
movieRouter.post("/delete-movie", deleteMovie);

export default movieRouter;