import { AppDispatch, RootState } from '../store'
import { setUser, setIsUserLoading } from "../slices/authSlice"
import axios from 'axios';
import { UserData } from '../../imports/types';
const backUrl = process.env.NEXT_PUBLIC_API_URL || '';

// Define a type for what this function returns
interface AuthResponse {
    isAuthenticated: boolean;
    user: UserData | null;
}





export const isUserAuthenticated = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(setIsUserLoading(true));
        const res = await axios.get(`${backUrl}/users/check`, {
            method: 'GET',
            withCredentials: true // Include cookies in the request
        });
        console.log('response from auth check:', res);

        if (res.data.isAuthenticated === true) {
            dispatch(setUser(res.data.data));
            return true
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    } finally {
        dispatch(setIsUserLoading(false));
    }
}

export const registerNewUser = (userInfo: UserData) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {

        try {
            dispatch(setIsUserLoading(true));

            const res = await axios.post(`${backUrl}/users/register`, userInfo, {

                withCredentials: true // Include cookies in the request
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
            }

        } catch (err) {
            console.error("Error registering new user:", err);

        } finally {
            dispatch(setIsUserLoading(false));
        }
    }

export const getUserProfile = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(setIsUserLoading(true));

        const res = await axios.get(`${backUrl}/users/userProfile`, {
            withCredentials: true // Include cookies in the request
        });
        if (res.data.success) {
            dispatch(setUser(res.data.data));
        }
    } catch (err) {
        console.error("Error fetching user profile:", err);
    } finally {
        dispatch(setIsUserLoading(false));
    }
}

export const updateUserProfile = (data: UserData) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(setIsUserLoading(true));
        const state = getState();
        const userId = state.auth.user?._id; // Assuming user ID is stored in auth slice

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("bio", data.bio);

        if (data.profilePic) {
            formData.append("profilePic", data.profilePic);
        }
        const res = await axios.put(`${backUrl}/users/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch(setUser(res.data.data));
    } catch (err) {
        console.error("Error updating user profile:", err);
    }
}


