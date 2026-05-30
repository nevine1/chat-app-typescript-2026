import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "user_profiles",
    allowedFormats: ["jpg", "png", "gif"],
});
