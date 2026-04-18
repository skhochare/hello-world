import Show from "../models/Show.js";

export const addShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.send({
      success: true,
      message: "Show added successfully",
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    const shows = await Show.find({
      movie: movieId,
      date: date,
    })
      .populate("theatre")
      .sort({ time: 1 });

    res.send({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

export const getShowsByTheatre = async (req, res) => {
  try {
    const { theatreId } = req.query;

    const shows = await Show.find({
      theatre: theatreId,
    })
      .populate("movie")
      .sort({ date: 1, time: 1 });

    res.send({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};