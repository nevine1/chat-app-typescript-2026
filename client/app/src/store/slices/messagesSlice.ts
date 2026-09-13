import { createSlice, PayloadAction } from '@reduxjs/toolkit';


import { Message } from '../../imports/types';
import { RootState } from '../rootRoducer';

interface MessagesState {
    messages: Message[];
    isMessagesLoading: boolean;
    error: string | null;
}

const initialState: MessagesState = {
    messages: [],
    isMessagesLoading: false,
    error: null,
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addNewMessage: (state: MessagesState, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setMessagesLoading: (state: MessagesState, action: PayloadAction<boolean>) => {
            state.isMessagesLoading = action.payload;
        },
        setMessages: (state: MessagesState, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setMessagesError: (state: MessagesState, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
})

export default messagesSlice.reducer;
export const { setMessagesLoading, setMessages, setMessagesError, addNewMessage } = messagesSlice.actions;