import Conversation from '../models/conversationModel';
import { Request, Response } from "express";

export const createNewConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        const conversation = new Conversation({
            members: [senderId, receiverId]
        });

        await conversation.save();

        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({
            error: "Failed to create conversation"
        });
    }

};

export const getUserConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        const conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        }).sort({ createdAt: -1 });

        if (!conversation) {
            const converesation = new Conversation({
                members: [req.body.senderId, req.body.receiverId]
            });
            await converesation.save();
            return res.status(201).json({
                success: true,
                message: "New conversation created successfully",
                data: converesation
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Conversation retrieved successfully",
                data: conversation
            });
        }

    } catch (err) {
        res.status(500).json({
            error: "Failed to retrieve conversation"
        });
    }

};