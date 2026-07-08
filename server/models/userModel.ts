import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // Prevents password from being returned in accidental queries
    },
    profilePic: {
        type: String,
        default: "",
        validate: {
            validator: function (value: string) {
                return value === "" || validator.isURL(value);
            },
            message: "Please provide a valid image URL",
        }

    },
    bio: {
        type: String,
        maxLength: [150, "Bio cannot exceed 150 characters"],
        trim: true,
    },
},
    {
        timestamps: true,
    });

// Extra Security: Ensure index creation happens (crucial for 'unique: true' to work reliably)
userSchema.set('autoIndex', true);

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;