"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import assets from '../../assets/assets'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { registerNewUser, userLogin } from '../../store/async/userAsync'
import { RegisterUserInfo } from '../../store/async/userAsync'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'
import { toast } from 'react-toastify/unstyled'
import { RootState } from '../../store/rootRoducer'

const Login = () => {
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user)
    const [currState, setCurrState] = useState<string>("Sign Up")
    const [showPass, setShowPass] = useState<boolean>(false);
    const [isAgreed, setIsAgreed] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<RegisterUserInfo>({
        name: "",
        email: "",
        password: "",
        bio: "",

    })
    const dispatch = useDispatch<AppDispatch>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currState === "Sign Up") {
            if (userInfo.name && userInfo.email && userInfo.password) {
                try {

                    await dispatch(registerNewUser(userInfo));
                } catch (error) {
                    /* console.log("Error during registration:", error); */
                    alert("Error during registration: " + (error as Error).message);
                }
            }
        } else {
            if (userInfo.email && userInfo.password) {
                try {
                    await dispatch(userLogin({
                        email: userInfo?.email,
                        password: userInfo?.password
                    }));
                } catch (error) {
                    /* console.log("Error during login:", error); */
                    toast.error("Error during login: " + (error as Error).message);
                }
            }
        }
    };

    useEffect(() => {
        if (user) {
            router.push("/profile")
        }
    }, [user])
    return (
        <div className="min-h-screen bg-[#111827] text-white bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-lg">
            {/*  left side */}
            <div>
                <Image
                    src={assets.logo_big} alt="background iage "
                    width={300} height={300}
                    className="w-64 h-64 object-contain"
                />
            </div>
            {/*  right side */}

            <form onSubmit={handleSubmit} className="flex flex-col text-white border border-gray-300    backdrop-blur-lg rounded-lg shadow-md px-10 py-8 w-[80%] max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6">{currState}</h1>
                {
                    currState === "Sign Up" && (
                        <div className="mb-4 flex flex-col text-white">
                            <label htmlFor="name" className="block text-gray-700 mb-2 text-white">Name</label>
                            <input type="text"
                                id="name"
                                name="name"
                                required
                                value={userInfo.name}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                    )
                }
                <div className="mb-4 flex flex-col text-white">
                    <label htmlFor="email" className="block text-gray-700 mb-2 text-white">Email</label>
                    <input type="email"
                        id="email"
                        name="email"
                        required
                        value={userInfo.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="mb-4 flex flex-col text-white">
                    <label htmlFor="password" className="w-full text-gray-700 mb-2 text-white">Password</label>
                    <div className="relative flex flex-row items-center w-full ">
                        <input
                            type={showPass ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            value={userInfo.password}
                            onChange={handleChange}
                            className="border border-gray-300 w-full rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        {
                            showPass ?
                                <FaEye onClick={() => setShowPass(false)} className="absolute right-3 cursor-pointer" /> :
                                <FaEyeSlash onClick={() => setShowPass(true)} className="absolute right-3 cursor-pointer" />
                        }
                    </div>


                </div>
                {
                    currState === "Sign Up" && (
                        <div className="mb-4 flex flex-col text-white">
                            <label htmlFor="bio" className="w-full text-gray-700 mb-2 text-white">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                required
                                value={userInfo.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder='Add a very short bio'
                                className="border border-gray-300 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300" ></textarea>
                        </div>
                    )
                }
                <div className="mt-4 text-sm text-gray-600">
                    <input type='checkbox' id='terms' className="mr-2"
                        checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)}
                    />
                    <label htmlFor="terms" className="text-white">
                        I agree to the terms and conditions
                    </label>
                </div>
                <button type="submit"
/*                     disabled={currState === "Sign Up" && (!userInfo.name || !userInfo.email || !userInfo.password || !isAgreed)}
 */                    className="bg-blue-500 hover:bg-blue-700 text-white
                     font-bold py-2 px-4 rounded-md transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed mt-4
                     cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
                     ">
                    {currState === "Sign Up" ? "Sign Up" : "Login"}
                </button>

                <div>
                    {currState === "Sign Up" ? (
                        <p className="mt-4 text-sm text-white">
                            Already have an account? <span onClick={() => setCurrState("Login")} className="text-blue-500 cursor-pointer">Login</span>
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-gray-600">
                            Do not have an account? <span onClick={() => setCurrState("Sign Up")} className="text-blue-500 cursor-pointer">Sign Up</span>
                        </p>
                    )}
                </div>
            </form>

        </div>
    )
}

export default Login 