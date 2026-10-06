"use client"
import React, { useEffect, useRef } from 'react'
import assets, { imagesDummyData, User } from '../../assets/assets'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Message } from '../../imports/types'
import { format } from 'date-fns'
import { getUserConversation } from '../../store/async/conversationAsync'
import { getAllMessages, createNewMessage } from '../../store/async/messageAsync'


type Props = {
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
}


const ChatContainer = ({ selectedUser, setSelectedUser }: Props) => {
    const dispatch = useDispatch();
    const [message, setMessage] = React.useState<string>("");
    const { user } = useSelector((state: any) => state.auth);
    const { selectedConversation } = useSelector((state: any) => state.conversations);
    const { messages } = useSelector((state: any) => state.messages);

    const scrollEnd = React.useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    //getting the user conversation when user click on the user from the list
    useEffect(() => {
        if (selectedUser && user) {
            dispatch(getUserConversation(user._id, selectedUser._id));
        }
    }, [selectedUser, user])

    //getting all messages of the selected conversation for selected User
    useEffect(() => {
        if (selectedConversation) {
            dispatch(getAllMessages(selectedConversation._id));
        }
    }, [selectedConversation])

    //sending the mesasge to the selected user 
    const sendMessage = () => {
        try {

            if (message.trim() && selectedUser && user && selectedConversation) {
                dispatch(createNewMessage({
                    senderId: user?._id,
                    receiverId: selectedUser?._id,
                    text: message.trim()
                }, selectedConversation?._id));
                setMessage("");
            }
        } catch (err) {
            throw new Error("Failed to send message", err);
        }

    }



    return selectedUser ? (
        <div className="h-full flex flex-col backdrop-blur-lg bg-white/5 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2B2D31]">

                {/* User Avatar */}
                <Image
                    src={selectedUser?.profilePic || ""}
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
            <div className="flex-1 overflow-y p-4 space-y-4">

                {messages.map((msg, index) => {
                    console.log("mesage is:", msg)
                    const isSender = user ? msg.senderId === user._id : false

                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2 md:gap-3 ${!isSender ? "flex-row-reverse" : ""
                                }`}
                        >

                            {/* Message Content */}
                            <div className="max-w-[75%] md:max-w-[60%]">

                                {msg?.image ? (
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
                                            ? `${user?.profilePic}` || "/images/default-profile.png"
                                            : `${selectedUser?.profilePic}` || "/images/default-profile.png"
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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                        onClick={sendMessage}
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