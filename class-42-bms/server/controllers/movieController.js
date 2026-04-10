import Movie from "../models/Movie.js";

export const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.send({
      success: true,
      message: "Movie added successfully",
      data: movie,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    res.send({
      success: true,
      message: "Movie updated successfully",
      data: null,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId);
    res.send({
      success: true,
      message: "Movie deleted successfully",
      data: null,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};