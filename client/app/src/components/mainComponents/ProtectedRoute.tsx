"use client"
import { useRouter, RootState, useEffect, isUserAuthenticated, useSelector } from '@/imports'


type Props = {}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user, isUserLoading } = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        if (!user && !isUserAuthenticated()) {
            router.push("/login")
        }
    }, [user, router])

    useEffect(() => {
        if (isUserLoading === false && !user) {
            return null;
        }
    }, [isUserLoading, user])

    return (
        <div>{children}</div>
    )
}