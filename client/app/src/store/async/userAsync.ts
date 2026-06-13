import { AppDispatch, RootState } from '../store'
import { setUser, setIsUserLoading } from "../slices/authSlice"
import axios from 'axios';
const backUrl = process.env.NEXT_PUBLIC_API_URL || '';

// Define a type for what this function returns
interface AuthResponse {
    isAuthenticated: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
}

export const isUserAuthenticated = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(setIsUserLoading(true));
        const res = await axios.get(`${backUrl}/users/check`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('response from auth check:', res);

        if (res.data.isAuthenticated === true) {
            dispatch(setUser(res.data.user));
        }

    } catch (error) {
        console.error("Error checking authentication:", error);
        return { isAuthenticated: false, user: null };
    } finally {
        dispatch(setIsUserLoading(false));
    }
}



