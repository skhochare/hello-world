import User from "../models/User.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        // Step 1: Read user input from request
        const { name, email, password, role = "user" } = req.body;
    
        // Step 2: Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Step 3: Create the new user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
    
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = signToken({ userId: user._id.toString() });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token
            }
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

export const getCurrentUser= async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                user
            }
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetfh user"
        });
    }
};