
import Message from '../models/messageModel';
import { Request, Response } from "express";


export const createNewMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const { senderId, text } = req.body;

        const newMessage = await Message.create({
            conversationId,
            senderId,
            text
        });

        return res.status(200).json({
            success: true,
            message: "Message created successfully",
            data: newMessage
        });

    } catch (err) {
        res.status(500).json({
            error: "Failed to create message"
        });
    }
};

export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {

        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        return res.status(200).json({
            success: true,
            message: "All messages retrieved successfully",
            data: messages
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve messages"
        })
    }

};