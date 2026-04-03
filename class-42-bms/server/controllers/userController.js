import User from "../models/User.js";

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
    
        // Step 3: Create the new user
        await User.create({
            name,
            email,
            password,
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