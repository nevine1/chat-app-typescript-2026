import React from 'react'
import Image from 'next/image'
import { CiMenuKebab, CiSearch } from "react-icons/ci";

import assets, { User, userDummyData } from '../../assets/assets'

type Props = {
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
}

const SideBar = ({ selectedUser, setSelectedUser }: Props) => {
    return (
        <div
            className={`
                bg-[#1E1F22]
                text-white
                h-full
                rounded-xl
                p-4
                overflow-y-auto
                transition-all duration-300
                ${selectedUser ? "hidden md:block" : ""}
            `}
        >

            {/* Top Section */}
            <div className="flex justify-between items-center pb-5">

                <Image
                    src={assets.logo || ""}
                    alt="logo"
                    width={100}
                    height={100}
                    className="max-w-40"
                />

                {/* Menu */}
                <div className="relative group">

                    <button
                        className=" p-2 rounded-lg hover:bg-[#2B2D31]
                            transition-all duration-200 " >
                        <CiMenuKebab className="text-2xl text-gray-300" />
                    </button>

                    {/* Dropdown */}
                    <div
                        className=" absolute top-12 right-0 w-44 bg-[#2B2D31] border border-gray-700
                            rounded-xl shadow-lg opacity-0 invisible  group-hover:opacity-100
                            group-hover:visible transition-all duration-200  z-50  " >
                        <p className="px-4 py-2 hover:bg-[#3A3C42] cursor-pointer rounded-t-xl">
                            Edit Profile
                        </p>

                        <hr className="border-gray-700" />

                        <p className="px-4 py-2 hover:bg-[#3A3C42] cursor-pointer rounded-b-xl text-red-400">
                            Logout
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mt-2 mb-4">
                <div className="relative flex items-center">

                    <CiSearch className=" absolute left-4 text-gray-400 w-5 h-5  " />

                    <input type="text" placeholder="Search messages or users..."
                        className=" w-full bg-[#2B2D31] border border-[#3A3C42]
                            text-white placeholder-gray-400 rounded-xl py-3 pl-11 pr-4 outline-none
                            focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 " />
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-2">

                {
                    userDummyData.map((user, index) => (

                        <div
                            key={index}
                            onClick={() => setSelectedUser(user)}
                            className={`relative  flex items-center gap-3 p-3 rounded-xl cursor-pointer
                                transition-all duration-200 max-sm:text-sm
                                ${selectedUser?._id === user._id ? "bg-[#2B2D31]" : "hover:bg-[#2B2D31]"}
                            `} >

                            {/* Profile Image */}
                            <Image
                                src={user?.profilePic || assets.avatar_icon}
                                alt={user.fullName}
                                width={30}
                                height={30}
                                className="rounded-full object-cover "
                            />

                            {/* User Info */}
                            <div className="flex-1 min-w-0">

                                <p className="text-sm truncate">
                                    {user.fullName}
                                </p>

                                {
                                    index < 3 ? (
                                        <span className="text-green-500 text-xs">
                                            Online
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">
                                            Offline
                                        </span>
                                    )
                                }
                            </div>

                            {/* Unread messages */}
                            {
                                index > 2 && (
                                    <p className="absolute top-2 right-2  flex items-center justify-center w-5 h-5  rounded-full
                                            bg-teal-500 text-[10px] text-white  " >
                                        {index}
                                    </p>
                                )
                            }

                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default SideBar