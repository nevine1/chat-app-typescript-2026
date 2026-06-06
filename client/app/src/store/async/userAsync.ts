import { AppDispatch, RootState } from '../store'
import { setUser, setIsUserLoading } from './slices/authSlice';
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
        const response = await fetch(`${backUrl}/auth/check`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.isAuthenticated) {
            dispatch(setUser(data.user));
        }

    } catch (error) {
        console.error("Error checking authentication:", error);
        return { isAuthenticated: false, user: null };
    } finally {
        dispatch(setIsUserLoading(false));
    }
}



export const isUserAuthenticated2 = async (): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${backUrl}/auth/check`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        // If authenticated, return the status and the user object
        if (data.isAuthenticated) {
            return {
                isAuthenticated: true,
                user: data.user
            };
        }

        return { isAuthenticated: false, user: null };

    } catch (error) {
        console.error("Error checking authentication:", error);
        return { isAuthenticated: false, user: null };
    }
};