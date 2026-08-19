import Message from '../models/messageModel';
import { Request, Response } from "express";


export const createNewMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender, receiver, text } = req.body;

        const newMessage = await Message.create({
            senderId: sender,
            receiverId: receiver,
            text
        });

        res.status(201).json(newMessage);

    } catch (err) {
        res.status(500).json({
            error: "Failed to create message"
        });
    }
};