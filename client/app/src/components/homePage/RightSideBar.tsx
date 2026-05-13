import React from 'react'
import { User } from '../../assets/assets'
import Image from 'next/image'
import assets from '../../assets/assets'
type Props = {
    selectedUser: User | null
}

const RightSideBar = ({ selectedUser }: Props) => {
    return selectedUser && (
        <div className={`bg-[#8185B2/10] text-white w-full relative overflow-y-scroll 
        ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className="flex flex-col items-center p-4">
                <Image src={selectedUser.profilePic || assets.avatar_icon || ""} alt="avatar" width={80} height={80}
                    className="rounded-lg object-cover w-20 aspect-[1/1]" />
                <h2 className="text-white text-sm  mt-4 flex items-center gap-2">
                    {selectedUser.fullName}
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                </h2>
                <p className={`py-4 mx-auto text-white text-xs`}>{selectedUser.bio}</p>
            </div>
        </div>
    )
}

export default RightSideBar