"use client"

import { useState } from "react"
import RightSideBar from "./src/components/homePage/RightSideBar"
import SideBar from "./src/components/homePage/SideBar"
import ChatContainer from "./src/components/homePage/ChatContainer"
import assets from "./src/assets/assets"

export type User = {
    id: string
    name: string
    avatar?: string
}

const Page = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    return (
        <main className="w-full h-screen bg-[#111827] sm:p-4 lg:px-[10%] lg:py-[3%]">

            <div className={`h-full grid bg-[#1E1F22] border border-[#2B2D31] rounded-2xl overflow-hidden transition-all duration-300
        ${selectedUser
                    ? "grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr]"
                    : "grid-cols-1 md:grid-cols-2"
                }`}>

                {/* Sidebar */}
                <div className={`${selectedUser ? "hidden md:block" : "block"}`}>
                    <SideBar
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                    />
                </div>

                {/* Chat Container */}
                <div className={`${!selectedUser ? "hidden md:block" : "block"}`}>
                    <ChatContainer selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                </div>

                {/* Right Sidebar */}
                {selectedUser && (
                    <div className="hidden lg:block border-l border-[#2B2D31]">
                        <RightSideBar selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    </div>
                )}

            </div>
        </main>

    )
}

export default Page