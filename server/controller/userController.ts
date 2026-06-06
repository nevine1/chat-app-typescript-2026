import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, password, profilePic, bio } = req.body;

        // 1. Required fields validation
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
            return;
        }

        // Sanitize and validate Email (trims extra spaces & forces lowercase)
        const sanitizedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(sanitizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email",
            });
            return;
        }


        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
            return;
        }


        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        // upload profile picture to Cloudinary if provided (optional)
        let profilePicUrl = "";
        if (profilePic) {
            try {
                profilePicUrl = await uploadToCloudinary(profilePic, "user_profiles");
            } catch (error) {
                console.error("Error uploading profile picture to Cloudinary:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to upload profile picture",
                });
                return;
            }
        }

        // Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //  Create and save the new user
        const user = await User.create({
            name,
            email: sanitizedEmail,
            password: hashedPassword,
            profilePic,
            bio,
        });

        //  Generate the JWT token using 
        const token = generateToken(user._id.toString());

        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
        };

        //  Maximum Security Step: Send the token in an HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true, // Blocks XSS attacks (JavaScript cannot touch this cookie)
            secure: process.env.NODE_ENV === "production", // Cookie only transmits over HTTPS in production
            sameSite: "strict", // Shields your app against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });


        console.log("New user created successfully:", newUser._id);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser,
            // we don't return the token in the body anymore; it's tucked away safely in the cookie!
        });

    } catch (err) {
        console.error("Error in createUser controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const signInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }


        const sanitizedEmail = email.trim().toLowerCase();

        //  Database Lookup (Explicitly fetch password if it's selected: false in your schema)
        const user = await User.findOne({ email: sanitizedEmail }).select("+password +name +profilePic +bio");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password", // Generic message prevents user enumeration
            });
            return;
        }

        //  Verify the password
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        //  Generate the JWT token
        const token = generateToken(user._id.toString());

        //  Send the token in an HTTP-Only Cookie
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            // Note: Use 'lax' if frontend/backend share a domain family, 
            // or 'none' (with secure: true) if they are on completely different domains (e.g., vercel vs render)
            sameSite: isProduction ? "lax" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        //  Structure response data safely
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
        };

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: userData,
        });

    } catch (err) {

        console.error("Error in signInUser controller:", err);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const isUserAuthenticated = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;

        const user = await User.findById(userId).select('-password'); // Exclude password for security!
        res.status(200).json({
            isAuthenticated: true,
            message: "User is authenticated",
            user: user,
        });

    } catch (err) {
        console.error("Error in isUserAuthenticated controller:", err);
        res.status(500).json({
            isAuthenticated: false,
            message: "Internal server error",
        });
    }
};