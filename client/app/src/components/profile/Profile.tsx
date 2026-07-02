"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppDispatch } from "@/store/store";
import { updateUserProfile } from "../../store/async/userAsync";
import { useDispatch } from "react-redux";

type Props = {};


const Profile = (props: Props) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [selectedImage, setSelectedImage] = useState<string | null>(null); //image preview
    const [imageFile, setImageFile] = useState<File | null>(null); //actual file to send to backend
    const [name, setName] = useState<string>("Martin Smith");
    const [bio, setBio] = useState<string>(
        "Hello everyone! I'm Martin, a passionate traveler and food lover..."
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImageFile(file); // Store the actual file for backend upload
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

        }
    };


    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateUserProfile({
            name,
            bio,
            profilePic: imageFile,
            email: ""
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 w-5/6">
            <div className="w-full max-w-lg">
                <form onSubmit={handleSubmit}
                    className="w-full bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-6">

                    <h1 className="text-2xl font-semibold text-center text-white">
                        Profile Details
                    </h1>

                    <label htmlFor="avatar" className="cursor-pointer text-gray-200 text-center">
                        Upload Avatar
                    </label>

                    <input
                        type="file"
                        id="avatar"
                        accept=".png,.jpg,.jpeg"
                        hidden
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />

                    <Image
                        src={selectedImage || "/images/avatar_icon.png"}
                        alt="Selected Avatar"
                        width={120}
                        height={120}
                        loading="eager"
                        onClick={handleImageClick}
                        className="mx-auto cursor-pointer rounded-full object-cover border-4 border-white/30 w-[120px] h-[120px]"
                    />

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                    />

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write your bio..."
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none resize-none"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg py-3 font-medium text-white"
                    >
                        Save Profile
                    </button>

                    <Link
                        href="/"
                        className=" text-white text-center hover:underline transition-all duration-300"
                    >
                        Chat Now
                    </Link>

                </form>
            </div>
        </div>
    );
};

export default Profile;