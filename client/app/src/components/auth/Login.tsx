"use client"
import React, { useState } from 'react'
import Image from "next/image"
import assets from '../../assets/assets'
type UserInfo = {
    name: string,
    email: string,
    password: string,
    bio: string
}

const Login = (props: UserInfo) => {
    const [currState, setCurrState] = useState<string>("Sign Up")
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: "",
        email: "",
        password: "",
        bio: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-lg">
            {/*  left side */}
            <div>
                <Image
                    src={assets.logo_big} alt="background iage "
                    width={300} height={300}
                    className="w-64 h-64 object-contain"
                />
            </div>
            {/*  right side */}

            <form action="" className="flex flex-col bg-white/8 bg-opacity-80 backdrop-blur-lg rounded-lg shadow-md px-10 py-8 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6">{currState}</h1>
                {
                    currState === "Sign Up" && !isFormSubmitted && (
                        <div className="mb-4 flex flex-col">
                            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                            <input type="text"
                                id="name"
                                required
                                value={userInfo.name}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                    )
                }
                <div className="mb-4 flex flex-col">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input type="email"
                        id="email"
                        required
                        value={userInfo.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="mb-4 flex flex-col">
                    <label htmlFor="password" className="w-full text-gray-700 mb-2">Password</label>
                    <input type="password"
                        id="password"
                        required
                        value={userInfo.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                {
                    currState === "Sign UP" && (
                        <div className="mb-4 flex flex-col">
                            <label htmlFor="bio" className="w-full text-gray-700 mb-2">Bio</label>
                            <textarea
                                id="bio"
                                required
                                value={userInfo.bio}
                                onChange={handleChange}
                                rows={4}
                                placeholder='Add a very short bio'
                                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" ></textarea>
                        </div>
                    )
                }
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300">
                    {currState === "Sign Up" ? "Sign Up" : "Login"}
                </button>
                <div className="mt-4 text-sm text-gray-600">
                    <input type='checkbox' id='terms' className="mr-2" />
                    <label htmlFor="terms" className="text-gray-500">I agree to the terms and conditions</label>
                </div>
                <div>
                    {currState === "Sign Up" ? (
                        <p className="mt-4 text-sm text-gray-600">
                            Already have an account? <span onClick={() => setCurrState("Login")} className="text-blue-500 cursor-pointer">Login</span>
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-gray-600">
                            Don't have an account? <span onClick={() => setCurrState("Sign Up")} className="text-blue-500 cursor-pointer">Sign Up</span>
                        </p>
                    )}
                </div>
            </form>

        </div>
    )
}

export default Login