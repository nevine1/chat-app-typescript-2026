
"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import assets from "../../assets/assets"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store/store"
import { registerNewUser, userLogin } from "../../store/async/userAsync"
import { RegisterUserInfo } from "../../store/async/userAsync"
import { FaEyeSlash, FaEye } from "react-icons/fa6"
import { toast } from "react-toastify/unstyled"
import { RootState } from "../../store/rootRoducer"

const Login = () => {

    const router = useRouter()

    const user = useSelector(
        (state: RootState) => state.auth.user
    )

    const dispatch = useDispatch<AppDispatch>()


    const [currState, setCurrState] = useState<string>("Sign In")

    const [showPass, setShowPass] = useState<boolean>(false)

    const [isAgreed, setIsAgreed] = useState<boolean>(false)

    const [userInfo, setUserInfo] = useState<RegisterUserInfo>({
        name: "",
        email: "",
        password: "",
        bio: "",
    })



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target

        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }




    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault()

        if (currState === "Sign In") {

            // Login
            if (userInfo.email && userInfo.password) {

                try {

                    await dispatch(
                        userLogin({
                            email: userInfo.email,
                            password: userInfo.password
                        })
                    )

                } catch (error) {

                    toast.error(
                        "Error during login: " +
                        (error as Error).message
                    )
                }
            }

        } else {

            // Register
            if (
                userInfo.name &&
                userInfo.email &&
                userInfo.password
            ) {

                try {

                    await dispatch(
                        registerNewUser(userInfo)
                    )

                } catch (error) {

                    toast.error(
                        "Error during registration: " +
                        (error as Error).message
                    )
                }
            }
        }
    }

    // Redirect after login/register

    useEffect(() => {

        if (user) {
            router.push("/profile")
        }

    }, [user, router])


    return (

        <div className="
            min-h-screen
            bg-[#111827]
            text-white
            bg-cover
            bg-center
            flex
            items-center
            justify-center
            sm:justify-evenly
            max-sm:flex-col
            backdrop-blur-lg
        ">

            {/* LEFT SIDE */}

            <div>

                <Image
                    src={assets.logo_big}
                    alt="background image"
                    width={300}
                    height={300}
                    className="w-64 h-64 object-contain"
                />

            </div>


            {/* RIGHT SIDE */}

            <form
                onSubmit={handleSubmit}
                className="
                    flex
                    flex-col
                    text-white
                    border
                    border-gray-300
                    backdrop-blur-lg
                    rounded-lg
                    shadow-md
                    px-10
                    py-8
                    w-[80%]
                    max-w-md
                "
            >

                <h1 className="text-3xl font-bold text-white mb-6">
                    {currState}
                </h1>



                {/* SIGN IN */}


                {currState === "Sign In" && (

                    <>

                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="email"
                                className="mb-2 text-white"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={userInfo.email}
                                onChange={handleChange}
                                className="
                                    border
                                    border-gray-300
                                    rounded-md
                                    py-2
                                    px-3
                                    text-black
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-300
                                "
                            />

                        </div>




                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="password"
                                className="mb-2 text-white"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPass
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    name="password"
                                    required
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    className="
                                        border
                                        border-gray-300
                                        w-full
                                        rounded-md
                                        py-2
                                        px-3
                                        text-black
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-300
                                    "
                                />

                                {showPass ? (

                                    <FaEye
                                        onClick={() =>
                                            setShowPass(false)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            cursor-pointer
                                            text-black
                                        "
                                    />

                                ) : (

                                    <FaEyeSlash
                                        onClick={() =>
                                            setShowPass(true)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            cursor-pointer
                                            text-black
                                        "
                                    />

                                )}

                            </div>

                        </div>

                    </>
                )}



                {/* SIGN UP */}


                {currState === "Sign Up" && (

                    <>

                        {/* NAME */}

                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="name"
                                className="mb-2 text-white"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={userInfo.name}
                                onChange={handleChange}
                                className="
                                    border
                                    border-gray-300
                                    rounded-md
                                    py-2
                                    px-3
                                    text-black
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-300
                                "
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="email"
                                className="mb-2 text-white"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={userInfo.email}
                                onChange={handleChange}
                                className="
                                    border
                                    border-gray-300
                                    rounded-md
                                    py-2
                                    px-3
                                    text-black
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-300
                                "
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="password"
                                className="mb-2 text-white"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPass
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    name="password"
                                    required
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    className="
                                        border
                                        border-gray-300
                                        w-full
                                        rounded-md
                                        py-2
                                        px-3
                                        text-black
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-300
                                    "
                                />

                                {showPass ? (

                                    <FaEye
                                        onClick={() =>
                                            setShowPass(false)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            cursor-pointer
                                            text-black
                                        "
                                    />

                                ) : (

                                    <FaEyeSlash
                                        onClick={() =>
                                            setShowPass(true)
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            cursor-pointer
                                            text-black
                                        "
                                    />

                                )}

                            </div>

                        </div>


                        {/* BIO */}

                        <div className="mb-4 flex flex-col">

                            <label
                                htmlFor="bio"
                                className="mb-2 text-white"
                            >
                                Bio
                            </label>

                            <textarea
                                id="bio"
                                name="bio"
                                value={userInfo.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Add a very short bio"
                                className="
                                    border
                                    border-gray-300
                                    rounded-md
                                    py-2
                                    px-3
                                    text-black
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-300
                                "
                            />

                        </div>


                        {/* TERMS */}

                        <div className="mt-2 text-sm">

                            <input
                                type="checkbox"
                                id="terms"
                                className="mr-2"
                                checked={isAgreed}
                                onChange={() =>
                                    setIsAgreed(!isAgreed)
                                }
                            />

                            <label htmlFor="terms">
                                I agree to the terms and conditions
                            </label>

                        </div>

                    </>
                )}


                {/* SUBMIT BUTTON */}

                <button
                    type="submit"
                    className="
                        bg-blue-500
                        hover:bg-blue-700
                        text-white
                        font-bold
                        py-2
                        px-4
                        rounded-md
                        transition-all
                        duration-300
                        mt-4
                        cursor-pointer
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-300
                    "
                >

                    {currState === "Sign In"
                        ? "Sign In"
                        : "Sign Up"}

                </button>


                {/* SWITCH SIGN IN / SIGN UP */}

                {currState === "Sign In" ? (

                    <p className="mt-4 text-sm text-gray-300">

                        Do not have an account?

                        <span
                            onClick={() =>
                                setCurrState("Sign Up")
                            }
                            className="
                                text-blue-400
                                cursor-pointer
                                ml-1
                            "
                        >
                            Sign Up
                        </span>

                    </p>

                ) : (

                    <p className="mt-4 text-sm text-gray-300">

                        Already have an account?

                        <span
                            onClick={() =>
                                setCurrState("Sign In")
                            }
                            className="
                                text-blue-400
                                cursor-pointer
                                ml-1
                            "
                        >
                            Sign In
                        </span>

                    </p>

                )}

            </form>

        </div>
    )
}

export default Login

