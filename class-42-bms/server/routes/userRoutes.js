import express from "express";
import { register, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
// router.get("/", getUsers);

export default router;