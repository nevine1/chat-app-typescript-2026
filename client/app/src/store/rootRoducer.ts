import { combineReducers } from '@reduxjs/toolkit';
// Import your slices here (placeholders used below)
import authReducer from "./slices/AuthSlice";
/* import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice'; */

const rootReducer = combineReducers({
    auth: authReducer,
    /* chats: chatReducer,
    messages: messageReducer, */
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;