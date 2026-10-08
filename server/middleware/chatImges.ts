import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "chat_images", // Specify the folder in Cloudinary where files will be stored
    allowedFormats: ["jpg", "png", "gif"],
});


const uploadChatImages = multer({ storage: storage });

export default uploadChatImages; 