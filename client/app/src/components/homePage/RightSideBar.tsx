import React from 'react'
import { User } from '../../assets/assets'
import Image from 'next/image'
import assets from '../../assets/assets'
type Props = {
    selectedUser: User | null
}

const RightSideBar = ({ selectedUser }: Props) => {
    return selectedUser && (
        <div>
            <div>
                <Image src={selectedUser.profilePic || assets.avatar_icon || ""} alt="avatar" width={80} height={80}
                    className="rounded-full object-cover w-20 aspect-[1/1]" />
                <h2 className="text-white text-sm  mt-4">{selectedUser.fullName}</h2>
            </div>
        </div>
    )
}

export default RightSideBar