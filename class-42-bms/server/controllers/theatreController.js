import Theatre from "../models/Theatre.js";

export const addTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create({
      ...req.body,
      owner: req.userId,
      isActive: false,
    });

    return res.send({
      success: true,
      message: "Theatre submitted successfully",
      data: theatre,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({ owner: req.userId }).sort({
      createdAt: -1,
    });

    return res.send({
      success: true,
      message: "Your theatres fetched successfully",
      data: theatres,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: theatres,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveTheatre = async (req, res) => {
  try {
    const { theatreId } = req.body;

    if (!theatreId) {
      return res.status(400).json({
        success: false,
        message: "Theatre ID required",
      });
    }

    await Theatre.findByIdAndUpdate(theatreId, {
      isActive: true,
    });

    return res.json({
      success: true,
      message: "Theatre approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};