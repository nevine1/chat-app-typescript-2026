import { combineReducers } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice"
import usersReducer from "./slices/usersSlice"


const rootReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    /* chats: chatReducer,
    messages: messageReducer, */
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;