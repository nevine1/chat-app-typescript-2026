import React from 'react'
import { imagesDummyData, User } from '../../assets/assets'
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
                <Image src={selectedUser.profilePic || "/images/avatar_icon.png"} alt="avatar" width={80} height={80}
                    className="rounded-lg object-cover w-20 aspect-[1/1]" />
                <h2 className="text-white text-sm  mt-4 flex items-center gap-2">
                    {selectedUser.fullName}
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                </h2>
                <p className={`py-4 mx-auto text-white text-xs`}>{selectedUser.bio}</p>
            </div>
            <hr className="border-gray-400 pt-4" />

            {/* media */}
            <div>
                <h2>Media</h2>
                <div className="overflow-y-scroll px-4 max-h-[300px] grid grid-cols-2 gap-2 mt-2 opacity-80">
                    {
                        imagesDummyData.map((img, index) => (
                            <div key={index} className="cursor-pointer rounded-lg overflow-hidden">
                                <Image src={img} alt={`media-${index}`} width={100} height={100} />
                            </div>
                        ))
                    }
                </div>
            </div>
            {/* logout */}
            <div className="p-4 flex justify-center items-center w-full mt-8">
                <button className=" bg-blue-500 text-white w-full py-2 px-4 rounded-full hover:bg-blue-600">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default RightSideBar