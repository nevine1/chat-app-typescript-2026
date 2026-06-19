"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import { isUserAuthenticated } from "../../store/async/userAsync";
import { RootState } from "../../store/rootRoducer";

export default function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();

    const { isUserLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(isUserAuthenticated());
    }, [dispatch]);


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