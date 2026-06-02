import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserData {
    id: string;
    email: string;
    name?: string;
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
        userError: null,
        isUserLoading: false,
    },
    reducers: {
        setUserError: (state, action: PayloadAction<string>) => {
            state.userError = action.payload;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setIsUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isUserLoading = action.payload;
        },
        clearUser: (state) => {
            state.user = {};
            state.userError = null;
            state.isUserLoading = false;
        },
    },
});



export const { setUser, clearUser, setUserError, setIsUserLoading } = authSlice.actions;
export default authSlice.reducer;