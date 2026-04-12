import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/movie", movieRouter);

app.get("/health", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(5001, () => {
    console.log(`Server running on port ${PORT}`);
});