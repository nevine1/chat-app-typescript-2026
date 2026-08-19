import axios from 'axios';
import { setMessagesLoading, setMessages, setMessagesError } from '../slices/messagesSlice';

const backURL = process.env.NEXT_PUBLIC_API_URL;
export const createNewMessage = (dispatch, getState) => async () => {

    try {
        const res = await axios.post(`${backURL}/messages`, {
            header: {
                'Content-Type': 'application/json',
            }
        })
    } catch (err) {

    } finally {
        dispatch(setMessagesLoading(false));
    }

}