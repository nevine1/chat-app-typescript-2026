"use client"
import React, { useEffect, useRef } from 'react'
import assets, { imagesDummyData, User } from '../../assets/assets'
import Image from 'next/image'
import { format } from 'date-fns'
type Props = {
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
}


const ChatContainer = ({ selectedUser, setSelectedUser }: Props) => {

    const scrollEnd = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [])

    return selectedUser ? (
        <div className="h-full flex flex-col backdrop-blur-lg bg-white/5 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2B2D31]">

                {/* User Avatar */}
                <Image
                    src={assets.avatar_icon || ""}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />

                {/* User Info */}
                <div className="flex items-center gap-2 min-w-0">
                    <p className="text-white text-sm md:text-base truncate font-medium">
                        {selectedUser?.name || "Nevine"}
                    </p>

                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4 ml-auto">

                    {/* Back Button - Mobile Only */}
                    <Image
                        src={assets.arrow_icon || ""}
                        alt="back"
                        width={20}
                        height={20}
                        className="cursor-pointer md:hidden"
                        onClick={() => setSelectedUser(null)}
                    />

                    {/* Help Icon */}
                    <Image
                        src={assets.help_icon || ""}
                        alt="help"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Chat Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {imagesDummyData.map((msg, index) => {
                    console.log("mesage is:", msg)
                    const isSender =
                        msg.senderId === "680f50aaf10f3cd28382ecf2"

                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2 md:gap-3 ${!isSender ? "flex-row-reverse" : ""
                                }`}
                        >

                            {/* Message Content */}
                            <div className="max-w-[75%] md:max-w-[60%]">

                                {msg.image ? (
                                    <Image
                                        src={msg.image}
                                        alt="message image"
                                        width={240}
                                        height={240}
                                        className="rounded-lg border border-gray-600 overflow-hidden"
                                    />
                                ) : (
                                    <p
                                        className={`p-3 text-sm md:text-base text-white break-words rounded-2xl
                                            ${isSender
                                                ? "bg-violet-500/30 rounded-bl-none"
                                                : "bg-gray-700 rounded-br-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </p>
                                )}
                            </div>

                            {/* Avatar + Time */}
                            <div className="flex flex-col items-center text-xs text-gray-400">

                                <Image
                                    src={
                                        isSender
                                            ? "/images/profile_richard.png"
                                            : "/images/profile_martin.png"
                                    }
                                    alt="user"
                                    width={28}
                                    height={28}
                                    className="rounded-full object-cover"
                                />

                                <span className="mt-1 whitespace-nowrap">
                                    {/* {format(new Date(msg.createdAt), "h:mm a")

                                    }

                                    */}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#2B2D31]">

                <div className="flex items-center gap-3 bg-[#1F2937] rounded-full px-4 py-2">

                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
                    />
                    <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
                        hidden
                    />
                    <label htmlFor='image'>
                        <Image
                            src={assets.gallery_icon || ""}
                            alt="gallery"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                        />
                    </label>


                    <Image
                        src={assets.send_button || ""}
                        alt="send"
                        width={32}
                        height={32}
                        className="cursor-pointer"
                    />
                </div>
                <div ref={scrollEnd}></div>
            </div>
        </div>
    ) : (
        <div className="hidden md:flex flex-col items-center justify-center gap-5 h-full bg-white/10 rounded-lg">

            <Image
                src={assets.logo_icon || ""}
                alt="logo"
                width={80}
                height={80}
                className="object-contain"
            />

            <div className="text-center space-y-2">
                <h2 className="text-white text-2xl font-semibold">
                    Welcome to Chat
                </h2>

                <p className="text-gray-300 text-sm">
                    Chat anytime, anywhere
                </p>
            </div>
        </div>
    )
}

export default ChatContainer