import axios from "axios";

import {
    setConversationsLoading,
    setConversations,
    setSelectedConversation,
    setConversationsError
} from "../slices/conversationsSlice";

const backUrl = process.env.NEXT_PUBLIC_API_URL || "";


// getting all conversations
export const getAllConversations = () => async (dispatch: any) => {
    dispatch(setConversationsLoading(true));
    dispatch(setConversationsError(null));

    try {
        const res = await axios.get(`${backUrl}/conversations/getAllConversations`, {
            withCredentials: true
        });

        if (res.data.success) {
            dispatch(setConversations(res.data.data));
        } else {
            dispatch(setConversationsError(res.data.error));
        }

    } catch (error) {
        dispatch(
            setConversationsError(
                (error as Error).message
            )
        );
    } finally {
        dispatch(setConversationsLoading(false));
    }
};

export const getUserConversation = (senderId: string, receiverId: string) => async (dispatch: any) => {
    dispatch(setConversationsLoading(true));
    dispatch(setConversationsError(null));
    try {
        const res = await axios.get(`${backUrl}/conversations/getConversation`,
            {
                params: { senderId, receiverId },
                withCredentials: true
            }
        );
        if (res.data.success) {
            dispatch(setSelectedConversation(res.data.data));
        } else {
            dispatch(setConversationsError(res.data.error));
        }

    } catch (err) {
        dispatch(setConversationsError((err as Error).message));
    } finally {
        dispatch(setConversationsLoading(false));
    }
}

// crreate a new conversation
export const createConversation =
    (senderId: string, receiverId: string) =>
        async (dispatch: any) => {

            dispatch(setConversationsLoading(true));
            dispatch(setConversationsError(null));

            try {
                const res = await axios.post(
                    `${backUrl}/conversations/createConversation`,
                    {
                        senderId,
                        receiverId
                    },
                    {
                        withCredentials: true
                    }
                );

                if (res.data.success) {
                    dispatch(setConversations(res.data.data));
                } else {
                    dispatch(setConversationsError(res.data.error));
                }

            } catch (error) {
                dispatch(
                    setConversationsError(
                        (error as Error).message
                    )
                );
            } finally {
                dispatch(setConversationsLoading(false));
            }
        };