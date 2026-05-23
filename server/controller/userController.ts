import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";

import userModel from "../models/userModal.js";

// Create new user
export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, password, profilePic, bio } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
            return;
        }

        // Email validation
        if (!validator.isEmail(email)) {
            res.status(400).json({
                success: false,
                message: "Invalid email",
            });
            return;
        }

        // Password strength
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
            return;
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            profilePic,
            bio,
        });

        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
        };

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};