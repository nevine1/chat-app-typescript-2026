import { combineReducers } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice"
import usersReducer from "./slices/usersSlice"
import messagesReducer from "./slices/messagesSlice"

const rootReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    messages: messagesReducer,
    /* chats: chatReducer, */
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;