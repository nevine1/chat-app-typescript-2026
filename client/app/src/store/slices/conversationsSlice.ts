import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "../../imports/types";

interface ConversationState {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    conversationLoading: boolean;
    conversationError: string | null;
}

const initialState: ConversationState = {
    conversations: [],
    selectedConversation: null,
    conversationLoading: false,
    conversationError: null
};

const conversationsSlice = createSlice({
    name: "conversations",
    initialState,

    reducers: {
        setConversationsLoading: (state, action: PayloadAction<boolean>) => {
            state.conversationLoading = action.payload;
        },

        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setSelectedConversation: (state, action: PayloadAction<Conversation | null>) => {
            state.selectedConversation = action.payload;
        },
        setConversationsError: (state, action: PayloadAction<string | null>) => {
            state.conversationError = action.payload;
        }
    }
});

export const { setConversationsLoading, setConversations, setSelectedConversation, setConversationsError } = conversationsSlice.actions;

export default conversationsSlice.reducer;