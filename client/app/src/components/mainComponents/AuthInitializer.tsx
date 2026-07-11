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

    // Pull authentication details and loading state from Redux
    const { isUserLoading, user } = useSelector((state: RootState) => state.auth);

    // 1. First effect: Trigger the auth check when the component mounts
    useEffect(() => {
        dispatch(isUserAuthenticated());
    }, [dispatch]);

    // 2. Second effect: Redirect once loading has finished and state is determined
    useEffect(() => {
        if (!isUserLoading) {
            if (!user) {
                router.push('/auth');
            } else {
                router.push("/profile")
            }
        }
    }, [isUserLoading, user, router]);

    // Show loading screen until the server verification returns a response
    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-slate-900 text-white">
                <p className="text-xl animate-pulse">
                    Loading Chat App...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}