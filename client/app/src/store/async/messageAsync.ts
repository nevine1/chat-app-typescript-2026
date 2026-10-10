import axios from 'axios';
import {
    setMessagesLoading,
    setMessages,
    addNewMessage,
    setMessagesError,
    updateMessage
} from '../slices/messagesSlice';

import { Message } from '../../imports/types';

const backURL = process.env.NEXT_PUBLIC_API_URL;

export const createNewMessage =
    (messageData: Message, conversationId: string) => async (dispatch, getState) => {

        dispatch(setMessagesLoading(true));

        try {
            const formData = new FormData();
            formData.append('senderId', messageData.senderId);
            formData.append('receiverId', messageData.receiverId);

            if (messageData.text) {
                formData.append('text', messageData.text);
            }
            if (messageData.image instanceof File) {
                formData.append('image', messageData.image);
            }
            const res = await axios.post(
                `${backURL}/messages/sendMessage/${conversationId}`,
                formData,
                {

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

//upateing message 
export const editMessage = (messageId: string, text: string, image: File | null) => async (dispatch, getState) => {
    try {
        dispatch(setMessagesLoading(true));
        const formData = new FormData();
        formData.append('text', text);

        if (image) {
            formData.append('image', image);
        }
        const res = await axios.put(`${backURL}/messages/updateMessage/${messageId}`, formData, {

            withCredentials: true,
        });
        dispatch(updateMessage(res.data.data));

    } catch (err) {
        dispatch(setMessagesError(
            err instanceof Error
                ? err.message
                : 'Failed to update message'
        ));
    }
}
