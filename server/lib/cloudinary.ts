import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The reusable uploader function
export const uploadToCloudinary = async (fileStr: string, folder: string = "user_profiles") => {
    //fileStr is the images come from the client as a base64 string, we can directly upload it to Cloudinary without needing to save it to the server first.
    try {
        const uploadResult = await cloudinary.uploader.upload(fileStr, {
            folder: folder,
            resource_type: "auto",
        });
        return uploadResult.secure_url; // Just return the web URL string
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image");
    }
};     