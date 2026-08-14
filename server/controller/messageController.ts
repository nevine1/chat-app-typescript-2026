import Message from '../models/messageModel';
import { Request, Response } from "express";


const createNewMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender, receiver, text } = req.body;

        const newMessage = new Message({
            sender,
            receiver,
            text
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create message' });
    }
}