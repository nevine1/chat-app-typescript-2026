import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, profilePic, bio } = req.body;

        // Sanitize Input
        const sanitizedName = name?.trim();
        const sanitizedEmail = email?.trim().toLowerCase();
        const sanitizedBio = bio?.trim() || "";

        if (!sanitizedName || !sanitizedEmail || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
            return;
        }

        if (!validator.isEmail(sanitizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email address.",
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
            return;
        }

        const existingUser = await User.findOne({ email: sanitizedEmail });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists.",
            });
            return;
        }

        // Upload Profile Picture 
        let profilePicUrl = "";

        if (profilePic) {
            try {
                profilePicUrl = await uploadToCloudinary(
                    profilePic,
                    "user_profiles"
                );
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);

                res.status(500).json({
                    success: false,
                    message: "Failed to upload profile picture.",
                });
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Create User
        const user = await User.create({
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            profilePic: profilePicUrl,
            bio: sanitizedBio,
        });
        // Generate JWT
        const token = generateToken(user._id.toString());

        console.log("User created:", user.email);
        console.log("Token:", token);

        // Send JWT in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        const registeredUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio
        }
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: registeredUser
        });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
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

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({
                isAuthenticated: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            isAuthenticated: true,
            message: "User is authenticated",
            data: user,
        });

    } catch (err) {
        console.error("Error in isUserAuthenticated controller:", err);
        res.status(500).json({
            isAuthenticated: false,
            message: "Internal server error",
        });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            data: user
        });

    } catch (err) {
        console.error("Error in getUserData controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {

    try {

        const { name, email, bio } = req.body;
        const userId = (req as any).userId; // Assuming userId is set in the request object by authentication middleware
        console.log('User id is:', userId)
        const file = req.file; // Assuming multer middleware is used to handle file uploads
        //to update the profile data
        const updatedProfileData: any = {}
        if (name) updatedProfileData.name = name;
        if (email) updatedProfileData.email = email;
        if (bio) updatedProfileData.bio = bio;
        if (file) updatedProfileData.profilePic = file.path;

        const user = await User.findByIdAndUpdate(
            userId,
            updatedProfileData,
            { new: true, runValidators: true }).select('-password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (err) {
        console.error("Error in updateProfile controller:", err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}