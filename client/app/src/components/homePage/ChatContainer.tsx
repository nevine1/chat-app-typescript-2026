
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { HiOutlineDotsVertical } from "react-icons/hi";
import assets, { User } from "../../assets/assets";
import { getUserConversation } from "../../store/async/conversationAsync";
import {
    getAllMessages,
    createNewMessage,
    editMessage,
    delMessage
} from "../../store/async/messageAsync";
import { deleteMessage } from "../../store/slices/messagesSlice";

type Props = {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
};

const ChatContainer = ({ selectedUser, setSelectedUser }: Props) => {
    const dispatch = useDispatch<any>();

    const [message, setMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [editMsg, setEditMsg] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(
        null
    );

    // Controls which message's three-dot menu is open.
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { user } = useSelector((state: any) => state.auth);

    const { selectedConversation } = useSelector(
        (state: any) => state.conversations
    );

    const { messages = [] } = useSelector(
        (state: any) => state.messages
    );

    const scrollEnd = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        scrollEnd.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    useEffect(() => {
        if (selectedUser?._id && user?._id) {
            dispatch(
                getUserConversation(user._id, selectedUser._id)
            );
        }
    }, [selectedUser?._id, user?._id, dispatch]);

    useEffect(() => {
        if (selectedConversation?._id) {
            dispatch(getAllMessages(selectedConversation._id));
        }
    }, [selectedConversation?._id, dispatch]);

    useEffect(() => {
        setEditMsg(false);
        setEditingMessageId(null);
        setMessage("");
        setImage(null);
        setImagePreview(null);
        setOpenMenuId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }, [selectedUser?._id]);

    // Release temporary browser image URLs when they are replaced.
    const previousPreviewRef = useRef<string | null>(null);

    useEffect(() => {
        const previousPreview = previousPreviewRef.current;

        if (
            previousPreview &&
            previousPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(previousPreview);
        }

        previousPreviewRef.current = imagePreview;

        return () => {
            if (
                imagePreview &&
                imagePreview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Send a new message.
    const sendMessage = () => {
        if (
            (!message.trim() && !image) ||
            !selectedUser?._id ||
            !user?._id ||
            !selectedConversation?._id
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
        setOpenMenuId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Only accept the image types offered by the input.
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            e.target.value = "";
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));

        // Allow the same file to be selected again.
        e.target.value = "";
    };

    // Open edit mode for a specific message.
    const handleEditClick = (msg: any) => {
        const senderId =
            typeof msg.senderId === "string"
                ? msg.senderId
                : msg.senderId?._id;

        // Only the sender can edit their own messages.
        if (!user?._id || senderId !== user._id) {
            return;
        }

        setEditMsg(true);
        setEditingMessageId(msg._id);
        setMessage(msg.text || "");
        setImage(null);

        // Keep the existing image visible until a replacement is selected.
        setImagePreview(
            typeof msg.image === "string" && msg.image.trim()
                ? msg.image
                : null
        );

        setOpenMenuId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // Save changes to the selected message.
    const handleUpdateMessage = () => {
        if (!editingMessageId) return;

        // An edited message must contain text or an image.
        // The existing image also counts if it has not been replaced.
        if (!message.trim() && !imagePreview) {
            return;
        }

        dispatch(
            editMessage(
                editingMessageId,
                message.trim(),
                image
            )
        );

        // Exit edit mode.
        setEditMsg(false);
        setEditingMessageId(null);
        setMessage("");
        setImage(null);
        setImagePreview(null);
        setOpenMenuId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // Cancel without sending an update request.
    const handleCancelEdit = () => {
        setEditMsg(false);
        setEditingMessageId(null);
        setMessage("");
        setImage(null);
        setImagePreview(null);
        setOpenMenuId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleSubmit = () => {
        if (editMsg) {
            handleUpdateMessage();
        } else {
            sendMessage();
        }
    };

    // Support senderId as either a string or a populated user object.
    const isOwnMessage = (msg: any) => {
        const senderId =
            typeof msg.senderId === "string"
                ? msg.senderId
                : msg.senderId?._id;

        return Boolean(user?._id && senderId === user._id);
    };

    const handleDelMessage = (messageId: string) => {
        dispatch(delMessage(messageId));
        setOpenMenuId(null);
    };

    return selectedUser ? (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-white/5 backdrop-blur-lg">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#2B2D31] p-4">
                <Image
                    src={
                        selectedUser.profilePic ||
                        "/images/default-profile.png"
                    }
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                />

                <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium text-white md:text-base">
                        {selectedUser.name || "User"}
                    </p>

                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <Image
                        src={assets.arrow_icon || ""}
                        alt="Back"
                        width={20}
                        height={20}
                        className="cursor-pointer md:hidden"
                        onClick={() => setSelectedUser(null)}
                    />

                    <Image
                        src={assets.help_icon || ""}
                        alt="Help"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto p-4">
                {messages.map((msg: any, index: number) => {
                    const isSender = isOwnMessage(msg);

                    const hasImage =
                        typeof msg.image === "string" &&
                        msg.image.trim() !== "";

                    const hasText =
                        typeof msg.text === "string" &&
                        msg.text.trim() !== "";

                    const menuIsOpen = openMenuId === msg._id;

                    const timestamp = msg.createdAt
                        ? new Date(msg.createdAt)
                        : null;

                    return (
                        <div
                            key={msg._id || index}
                            className={`flex items-end gap-2 md:gap-3 ${!isSender ? "flex-row-reverse" : ""
                                }`}
                        >
                            {/* Message bubble and its action menu */}
                            <div
                                className={`group relative min-w-0 max-w-[75%] md:max-w-[60%] ${isSender ? "mr-2" : "ml-2"
                                    }`}
                            >
                                <div
                                    className={`overflow-hidden rounded-2xl ${isSender
                                        ? "rounded-bl-none bg-violet-500/30"
                                        : "rounded-br-none bg-gray-700"
                                        }`}
                                >
                                    {/* Display the saved message image.
                                        The edit preview belongs in the
                                        input area, not every message. */}
                                    {hasImage && (
                                        <Image
                                            src={msg.image}
                                            alt="Message attachment"
                                            width={400}
                                            height={400}
                                            unoptimized
                                            className="h-auto max-h-[300px] w-auto max-w-full object-contain"
                                        />
                                    )}

                                    {hasText && (
                                        <p className="whitespace-pre-wrap break-words px-4 py-3 text-sm text-white md:text-base">
                                            {msg.text}
                                        </p>
                                    )}
                                </div>

                                {/* Three-dot button: visible on hover
                                    or keyboard focus, and stays visible
                                    while its menu is open. */}
                                {isSender && (
                                    <div
                                        className={`absolute -right-3 top-0 z-20 ${menuIsOpen
                                            ? "visible opacity-100"
                                            : "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                                            } transition-opacity duration-150`}
                                    >
                                        <button
                                            type="button"
                                            aria-label="Message options"
                                            aria-haspopup="menu"
                                            aria-expanded={menuIsOpen}
                                            onClick={() =>
                                                setOpenMenuId(
                                                    menuIsOpen
                                                        ? null
                                                        : msg._id
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-200 shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        >
                                            <HiOutlineDotsVertical
                                                size={18}
                                            />
                                        </button>

                                        {menuIsOpen && (
                                            <div
                                                role="menu"
                                                className="absolute right-0 top-9 z-30 min-w-32 rounded-lg border border-gray-700 bg-gray-800 p-1 text-sm text-white shadow-xl"
                                            >
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() =>
                                                        handleEditClick(msg)
                                                    }
                                                    className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => handleDelMessage(msg._id)}
                                                    className="w-full rounded-md px-3 py-2 text-left text-red-300 hover:bg-gray-700"

                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Avatar and timestamp */}
                            <div className="flex shrink-0 flex-col items-center text-xs text-gray-400">
                                <Image
                                    src={
                                        (isSender
                                            ? user?.profilePic
                                            : selectedUser?.profilePic) ||
                                        "/images/default-profile.png"
                                    }
                                    alt="User"
                                    width={28}
                                    height={28}
                                    className="h-7 w-7 rounded-full object-cover"
                                />

                                <span className="mt-1 whitespace-nowrap">
                                    {timestamp &&
                                        !Number.isNaN(timestamp.getTime())
                                        ? format(timestamp, "h:mm a")
                                        : ""}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Keep the scroll target inside the scrollable area. */}
                <div ref={scrollEnd} />
            </div>

            {/* Message input */}
            <div className="border-t border-[#2B2D31] p-4">
                {editMsg && (
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm text-violet-300">
                            Editing message
                        </p>

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-xs text-gray-300 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3 rounded-2xl bg-[#1F2937] px-4 py-3">
                    <input
                        type="text"
                        placeholder={
                            editMsg
                                ? "Edit your message..."
                                : "Type a message..."
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400 md:text-base"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }

                            if (e.key === "Escape" && editMsg) {
                                handleCancelEdit();
                            }
                        }}
                    />

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        hidden
                        onChange={handleImageChange}
                    />

                    <button
                        type="button"
                        aria-label={
                            editMsg
                                ? "Choose replacement image"
                                : "Choose image"
                        }
                        onClick={() => imageInputRef.current?.click()}
                        className="shrink-0"
                    >
                        <Image
                            src={assets.gallery_icon || ""}
                            alt="Choose image"
                            width={22}
                            height={22}
                            className="cursor-pointer"
                        />
                    </button>

                    <button
                        type="button"
                        aria-label={
                            editMsg ? "Save changes" : "Send message"
                        }
                        onClick={handleSubmit}
                        disabled={
                            editMsg
                                ? !message.trim() && !imagePreview
                                : !message.trim() && !image
                        }
                        className="shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Image
                            src={assets.send_button || ""}
                            alt={editMsg ? "Save changes" : "Send"}
                            width={32}
                            height={32}
                            className="cursor-pointer"
                        />
                    </button>
                </div>

                {/* Current image or replacement image preview */}
                {imagePreview && (
                    <div className="mt-3 flex items-start gap-3">
                        <div className="relative">
                            <Image
                                src={imagePreview}
                                alt={
                                    image
                                        ? "Replacement image preview"
                                        : "Current message image"
                                }
                                width={120}
                                height={120}
                                unoptimized
                                className="h-[120px] w-[120px] rounded-lg object-cover"
                            />
                        </div>

                        <div className="min-w-0 pt-1">
                            <p className="text-sm text-gray-200">
                                {image
                                    ? "New image selected"
                                    : editMsg
                                        ? "Current image"
                                        : "Image attached"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                {editMsg
                                    ? "Choose another image to replace it."
                                    : "This image will be sent with your message."}
                            </p>

                            {image && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);

                                        if (imageInputRef.current) {
                                            imageInputRef.current.value = "";
                                        }
                                    }}
                                    className="mt-2 text-xs text-red-300 hover:text-red-200"
                                >
                                    Remove selected image
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div className="hidden h-full flex-col items-center justify-center gap-5 rounded-lg bg-white/10 md:flex">
            <Image
                src={assets.logo_icon || ""}
                alt="Logo"
                width={80}
                height={80}
                className="object-contain"
            />

            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">
                    Welcome to Chat
                </h2>

                <p className="text-sm text-gray-300">
                    Chat anytime, anywhere
                </p>
            </div>
        </div>
    );
};

export default ChatContainer;
