"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import { isUserAuthenticated } from "../../store/async/userAsync";
import { RootState } from "../../store/rootRoducer";
import { useRouter } from "next/navigation";


export default function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { isUserLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await dispatch(isUserAuthenticated());

            if (loggedIn) {
                router.push('/profile')
            } else {
                router.push('/auth/login')
            }
        }
        checkAuth();
    }, [dispatch, router]);


    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-white">
                <p className="text-xl animate-pulse">
                    Loading Chat App...
                </p>
            </div>
        );
    }

    return children;
}