import React from 'react'
import Profile from '../src/components/profile/Profile';

type Props = {}

const page = (props: Props) => {
    return (
        <div className="min-h-screen bg-[#111827] text-white bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-lg
            bg-[url('/profile-bg.jpg')]
        ">
            <Profile />
        </div>
    )
}

export default page;