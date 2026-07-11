"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import Link from "next/link";
import { AppDispatch } from "../../store/store";
import { updateUserProfile } from "../../store/async/userAsync";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../imports/types";
import { RootState } from "../../store/rootRoducer";

const Profile = () => {

    const dispatch = useDispatch<AppDispatch>();
    const user: UserData | null = useSelector((state: RootState) => state.auth.user);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // للـ Preview في الـ UI
    const [imageFile, setImageFile] = useState<File | null>(null); // الملف الحقيقي اللي هيروح للباكيند
    const [userProfile, setUserProfile] = useState<UserData | null>(null);

    useEffect(() => {
        if (user) {
            setUserProfile(user);
            // لو المستخدم عنده صورة بروفايل مسبقاً من الباكيند، اعرضيها
            if (user?.profilePic) {
                setSelectedImage(user?.profilePic);
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserProfile(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); // حفظ الملف الفعلي للباكيند
            const imageUrl = URL.createObjectURL(file); // عمل رابط مؤقت لعرضه في الـ UI
            setSelectedImage(imageUrl);
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditing) {
            // If we are just viewing, clicking the button switches to edit mode
            setIsEditing(true);
            return;
        }

        try {
            // We just send a simple object to our Thunk action!
            await dispatch(
                updateUserProfile({
                    name: userProfile?.name || "",
                    bio: userProfile?.bio || "",
                    profilePic: imageFile
                })
            );

            setIsEditing(false); // Switch back to view mode on success
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile in UI component:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 w-5/6">
            <div className="w-full max-w-lg">
                <form onSubmit={handleSubmit}
                    className="w-full bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-6">

                    <h1 className="text-2xl font-semibold text-center text-white">
                        Profile Details
                    </h1>


                    <div className="relative mx-auto">
                        <Image
                            src={selectedImage || "/images/avatar_icon.png"}
                            alt="Selected Avatar"
                            width={120}
                            height={120}
                            loading="eager"
                            onClick={handleImageClick}
                            className={`mx-auto rounded-full object-cover border-4 border-white/30 w-[120px] h-[120px] ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
                        />
                        {isEditing && (
                            <p className="text-xs text-gray-400 text-center mt-1">Click to change</p>
                        )}
                    </div>


                    <input
                        type="file"
                        id="avatar"
                        accept=".png,.jpg,.jpeg"
                        hidden
                        onChange={handleImageChange}
                        ref={fileInputRef}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userProfile?.name || ""}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-300">
                                {userProfile?.name || "No name set"}
                            </p>
                        )}
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm">Bio</label>
                        {isEditing ? (
                            <textarea
                                value={userProfile?.bio || ""}
                                onChange={handleChange}
                                placeholder="Write your bio..."
                                rows={4}
                                name="bio"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none resize-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-300 whitespace-pre-wrap">
                                {userProfile?.bio || "No bio yet..."}
                            </p>
                        )}
                    </div>


                    <button
                        type="submit"
                        className={`transition-all duration-300 rounded-lg py-3 font-medium text-white ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>

                    <Link
                        href="/"
                        className="text-white text-center hover:underline transition-all duration-300"
                    >
                        Chat Now
                    </Link>

                </form>
            </div>
        </div>
    );
};

export default Profile;