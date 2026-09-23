import { combineReducers } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice"
import usersReducer from "./slices/usersSlice"
import messagesReducer from "./slices/messagesSlice"
import conversationsReducer from "./slices/conversationsSlice"
const rootReducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    messages: messagesReducer,
    conversations: conversationsReducer,
    /* chats: chatReducer, */
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;