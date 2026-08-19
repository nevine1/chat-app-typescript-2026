import { createSlice, PayloadAction } from '@reduxjs/toolkit';


import { Message } from '../../imports/types';
import { RootState } from '../rootRoducer';

interface MesssagesState {
    messages: Message[];
    isMessagesLoading: boolean;
    error: string | null;
}

const initialState: MesssagesState = {
    messages: [],
    isMessagesLoading: false,
    error: null,
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessagesLoading: (state: MesssagesState, action: PayloadAction<boolean>) => {
            state.isMessagesLoading = action.payload;
        },
        setMessages: (state: MesssagesState, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setMessagesError: (state: MesssagesState, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
})

export default messagesSlice.reducer;
export const { setMessagesLoading, setMessages, setMessagesError } = messagesSlice.actions;