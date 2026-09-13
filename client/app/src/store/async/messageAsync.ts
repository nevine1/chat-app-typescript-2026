import axios from 'axios';
import {
    setMessagesLoading,
    setMessages,
    addNewMessage,
    setMessagesError
} from '../slices/messagesSlice';

import { Message } from '../../imports/types';

const backURL = process.env.NEXT_PUBLIC_API_URL;

export const createNewMessage =
    (messageData: Message, conversationId: string) => async (dispatch, getState) => {

        dispatch(setMessagesLoading(true));

        try {
            const res = await axios.post(
                `${backURL}/messages/sendMessage/${conversationId}`,
                messageData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(addNewMessage(res.data.data));
            }

        } catch (err) {

            dispatch(
                setMessagesError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to create new message'
                )
            );

        } finally {

            dispatch(setMessagesLoading(false));

        }
    };


export const getAllMessages = (conversationId: string) => async (dispatch, getState) => {
    try {
        dispatch(setMessagesLoading(true));
        const res = await axios.get(`${backURL}/messages/getMessages/conversation/${conversationId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        dispatch(setMessages(res.data.data));
    } catch (err) {
        dispatch(setMessagesError(
            err instanceof Error
                ? err.message
                : 'Failed to retrieve messages'
        ));
    }
}