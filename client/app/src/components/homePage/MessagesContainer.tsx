import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import assets from '../../assets/assets'
import { User } from '../../assets/assets'

const MessagesContainer = ({ messages, selectedUser, setEditMsg }: { messages: any[]; selectedUser: User | null; setEditMsg: (edit: boolean) => void }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);


    const scrollEnd = useRef<HTMLDivElement>(null);


    //scroll to the end of the chat when new message is added
    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);





    return (
        <div
            key={index}
            className={`flex items-end gap-2 md:gap-3 ${!isSender ? "flex-row-reverse" : ""
                }`}
        >

            {/* Message Content */}
            <div
                className={`max-w-[75%] md:max-w-[60%] overflow-hidden rounded-2xl
                                        ${isSender
                        ? "bg-violet-500/30 rounded-bl-none"
                        : "bg-gray-700 rounded-br-none"
                    }`}
            >
                {/* Image */}
                {msg?.image && (
                    <Image
                        src={typeof msg.image === "string" ? msg.image : ""}
                        alt="message image"
                        width={300}
                        height={300}
                        className="w-full max-w-[300px] max-h-[300px] object-cover"
                    />
                )}

                {/* Text */}
                <div className="group relative hover:bg-gray-600/20 transition-all duration-300">
                    {msg?.text && (
                        <p className="px-4 py-3 text-sm md:text-base text-white break-words">
                            {msg.text}
                        </p>
                    )}
                    <div className="absolute z-100 -bottom-4 -right-4 w-auto h-auto  mt-4 p-1 text-xs bg-white  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p onClick={() => setEditMsg(true)}>Edit</p>
                        <p>Delete</p>
                    </div>
                </div>
            </div>

            {/* Avatar + Time */}
            <div className="flex flex-col items-center text-xs text-gray-400">

                <Image
                    src={
                        (isSender ? user?.profilePic : selectedUser?.profilePic)
                        || "/images/default-profile.png"
                    }
                    alt="user"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                />

                <span className="mt-1 whitespace-nowrap">
                    {format(new Date(msg.createdAt), "h:mm a")

                    }


                </span>
            </div>
        </div>
    )



};


export default MessagesContainer;