import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface UserData {
    id: string;
    email: string;
    name?: string;
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        userError: null,
        userLoading: false,
    },
    reducers: {
        setUserError: (state, action: PayloadAction<string>) => {
            state.userError = action.payload;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.userLoading = action.payload;
        },
        clearUser: (state) => {
            state.user = {};
            state.userError = null;
            state.userLoading = false;
        },
    },
});



export const { setUser, clearUser, setUserError, setUserLoading } = userSlice.actions;
export default userSlice.reducer;