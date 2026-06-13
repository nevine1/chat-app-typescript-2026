import { combineReducers } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice"


const rootReducer = combineReducers({
    auth: authReducer,
    /* chats: chatReducer,
    messages: messageReducer, */
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;