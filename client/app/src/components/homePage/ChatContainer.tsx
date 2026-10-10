
"use client";

import React, { useEffect } from "react";
import assets, { User } from "../../assets/assets";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getUserConversation } from "../../store/async/conversationAsync";
import {
    getAllMessages,
    createNewMessage,
    editMessage,
} from "../../store/async/messageAsync";

type Props = {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
};

const ChatContainer = ({ selectedUser, setSelectedUser }: Props) => {
    const dispatch = useDispatch();

    const [message, setMessage] = React.useState<string>("");
    const [image, setImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    const [editMsg, setEditMsg] = React.useState<boolean>(false);
    const [editingMessageId, setEditingMessageId] =
        React.useState<string | null>(null);

    const { user } = useSelector((state: any) => state.auth);
    const { selectedConversation } = useSelector(
        (state: any) => state.conversations
    );
    const { messages } = useSelector((state: any) => state.messages);

    const scrollEnd = React.useRef<HTMLDivElement>(null);

    // Scroll to the latest message.
    useEffect(() => {
        scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Get the conversation between the logged-in user and selected user.
    useEffect(() => {
        if (selectedUser && user) {
            dispatch(getUserConversation(user._id, selectedUser._id));
        }
    }, [selectedUser, user, dispatch]);

    // Get all messages in the selected conversation.
    useEffect(() => {
        if (selectedConversation) {
            dispatch(getAllMessages(selectedConversation._id));
        }
    }, [selectedConversation, dispatch]);

    // Send a new message.
    const sendMessage = () => {
        if (
            (!message.trim() && !image) ||
            !selectedUser ||
            !user ||
            !selectedConversation
        ) {
            return;
        }

        dispatch(
            createNewMessage(
                {
                    senderId: user._id,
                    receiverId: selectedUser._id,
                    text: message.trim(),
                    image: image || undefined,
                    timestamp: new Date(),
                },
                selectedConversation._id
            )
        );

        setMessage("");
        setImage(null);
        setImagePreview(null);
    };

    // Select an image and display its preview.
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }

        // Allows selecting the same file again if needed.
        e.target.value = "";
    };

    // Enter edit mode for the message that was clicked.
    const handleEditClick = (msg: any) => {
        setEditMsg(true);

        // Save the ID of the specific message being edited.
        setEditingMessageId(msg._id);

        // Put the existing text into the input.
        setMessage(msg.text || "");

        // No new image has been selected yet.
        setImage(null);

        // Display the existing image, if there is one.
        setImagePreview(
            typeof msg.image === "string" && msg.image
                ? msg.image
                : null
        );
    };

    // Save the edited text and/or image.
    const handleUpdateMessage = () => {
        if (!editingMessageId) {
            return;
        }

        // Do not allow an empty message with no image.
        if (!message.trim() && !image && !imagePreview) {
            return;
        }

        dispatch(
            editMessage(
                editingMessageId,
                message.trim(),
                image
            )
        );

        // Reset the input after requesting the update.
        setEditMsg(false);
        setEditingMessageId(null);
        setMessage("");
        setImage(null);
        setImagePreview(null);
    };

    // Cancel editing without saving.
    const handleCancelEdit = () => {
        setEditMsg(false);
        setEditingMessageId(null);
        setMessage("");
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = () => {
        if (editMsg) {
            handleUpdateMessage();
        } else {
            sendMessage();
        }
    };

    return selectedUser ? (
        <div className="h-full min-h-0 flex flex-col backdrop-blur-lg bg-white/5 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2B2D31]">
                <Image
                    src={
                        selectedUser.profilePic ||
                        "/images/default-profile.png"
                    }
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />

                <div className="flex items-center gap-2 min-w-0">
                    <p className="text-white text-sm md:text-base truncate font-medium">
                        {selectedUser.name || "Nevine"}
                    </p>
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <Image
                        src={assets.arrow_icon || ""}
                        alt="back"
                        width={20}
                        height={20}
                        className="cursor-pointer md:hidden"
                        onClick={() => setSelectedUser(null)}
                    />

                    <Image
                        src={assets.help_icon || ""}
                        alt="help"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {messages.map((msg: any, index: number) => {
                    const isSender =
                        user && msg.senderId === user._id;

                    return (
                        <div
                            key={msg._id || index}
                            className={`flex items-end gap-2 md:gap-3 ${!isSender ? "flex-row-reverse" : ""
                                }`}
                        >
                            {/* Message bubble */}
                            <div
                                className={`max-w-[75%] md:max-w-[60%] overflow-hidden rounded-2xl ${isSender
                                    ? "bg-violet-500/30 rounded-bl-none"
                                    : "bg-gray-700 rounded-br-none"
                                    }`}
                            >
                                {/* Message image */}
                                {typeof msg.image === "string" &&
                                    msg.image.trim() !== "" && (
                                        <Image
                                            src={msg.image}
                                            alt="message image"
                                            width={300}
                                            height={300}
                                            className="w-full max-w-[300px] max-h-[300px] object-cover"
                                        />
                                    )}

                                {/* Message text and menu */}
                                <div className="group relative hover:bg-gray-600/20 transition-all duration-300">
                                    {msg.text && (
                                        <p className="px-4 py-3 text-sm md:text-base text-white break-words">
                                            {msg.text}
                                        </p>
                                    )}

                                    {/* Only allow editing your own messages */}
                                    {isSender && (
                                        <div className="absolute bottom-0 right-0 z-50 min-w-20 rounded-md bg-gray-800 p-2 text-xs text-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
                                            <p
                                                onClick={() =>
                                                    handleEditClick(msg)
                                                }
                                                className="cursor-pointer rounded px-2 py-1 hover:bg-gray-700"
                                            >
                                                Edit
                                            </p>

                                            <p className="cursor-pointer rounded px-2 py-1 hover:bg-gray-700">
                                                Delete
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Avatar and time */}
                            <div className="flex flex-col items-center text-xs text-gray-400">
                                <Image
                                    src={
                                        (isSender
                                            ? user?.profilePic
                                            : selectedUser?.profilePic) ||
                                        "/images/default-profile.png"
                                    }
                                    alt="user"
                                    width={28}
                                    height={28}
                                    className="rounded-full object-cover"
                                />

                                <span className="mt-1 whitespace-nowrap">
                                    {msg.createdAt
                                        ? format(
                                            new Date(msg.createdAt),
                                            "h:mm a"
                                        )
                                        : ""}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div ref={scrollEnd} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-[#2B2D31]">
                {editMsg && (
                    <p className="text-sm text-violet-300 mb-2">
                        Editing message
                    </p>
                )}

                <div className="flex items-center gap-3 bg-[#1F2937] rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder={
                            editMsg
                                ? "Edit your message..."
                                : "Type a message..."
                        }
                        className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit();
                            }

                            if (e.key === "Escape" && editMsg) {
                                handleCancelEdit();
                            }
                        }}
                    />

                    <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        hidden
                        onChange={handleImageChange}
                    />

                    <label htmlFor="image">
                        <Image
                            src={assets.gallery_icon || ""}
                            alt="Choose image"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                        />
                    </label>

                    <Image
                        src={assets.send_button || ""}
                        alt={editMsg ? "Save changes" : "Send message"}
                        width={32}
                        height={32}
                        className="cursor-pointer"
                        onClick={handleSubmit}
                    />

                    {editMsg && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-xs text-gray-300 hover:text-white"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* Image preview */}
                {imagePreview && (
                    <div className="mt-3 flex items-center gap-3">
                        <Image
                            src={imagePreview}
                            alt="Image preview"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                        />

                        {editMsg && (
                            <p className="text-xs text-gray-300">
                                Choose another image above to replace it.
                            </p>
                        )}
                    </div>
                )}
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
    );
};

export default ChatContainer;
