import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserData {
    _id: string;
    email: string;
    name: string;
    profilePic?: string;
    bio?: string;
}

interface AuthState {
    user: UserData | null;
    userError: string | null;
    isUserLoading: boolean;
}
const initialState: AuthState = {
    user: null,
    userError: null,
    isUserLoading: false,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserError: (state, action: PayloadAction<string>) => {
            state.userError = action.payload;
        },
        setUser: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
        },
        setIsUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isUserLoading = action.payload;
        },
        login: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
            state.userError = null;
            state.isUserLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.userError = null;
            state.isUserLoading = false;
        },
    },
});



export const { setUser, logout, setUserError, setIsUserLoading, login } = authSlice.actions;
export default authSlice.reducer;