import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { addTheatre, getMyTheatres, getAllTheatres, approveTheatre } from "../controllers/theatreController.js";

const theatreRouter = express.Router();

// Partner Routes
theatreRouter.post("/add-theatre", authMiddleware, addTheatre);
theatreRouter.get("/get-my-theatres", authMiddleware, getMyTheatres);

// Admin Routes
theatreRouter.get("/get-all-theatres", authMiddleware, adminMiddleware, getAllTheatres);
theatreRouter.put("/approve-theatre", authMiddleware, adminMiddleware, approveTheatre);


export default theatreRouter;