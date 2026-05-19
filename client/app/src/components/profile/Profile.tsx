"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {};

const Profile = (props: Props) => {
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [name, setName] = useState<string>("Martin Smith");
    const [bio, setBio] = useState<string>(
        "Hello everyone! I'm Martin, a passionate traveler and food lover..."
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    return (
        <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center sm:justify-evenly max-sm:flex-col">
            <div className="w-5/6 max-w-2xl">
                <form className="flex flex-col gap-6 border border-gray-300 rounded-lg shadow-md px-10 py-8 w-[80%] max-w-md">

                    <h1 className="text-xl font-semibold">Profile details</h1>


                    <label htmlFor="avatar" className="cursor-pointer">
                        Avatar
                    </label>

                    <input
                        type="file"
                        id="avatar"
                        accept=".png,.jpg,.jpeg"
                        hidden
                        onChange={handleImageChange}
                    />


                    <Image
                        src={selectedImage || "/default-avatar.png"}
                        alt="Selected Avatar"
                        width={100}
                        height={100}
                        className="mx-auto rounded-full object-cover"
                    />
                </form>
            </div>
        </div>
    );
};

export default Profile;