import Conversation from '../models/conversationModel';
import { Request, Response } from "express";

export const createNewConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        const conversation = new Conversation({
            members: [senderId, receiverId]
        });

        await conversation.save();
        console.log("senderId:", senderId);
        console.log("receiverId:", receiverId);
        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: conversation
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to create conversation"
        });
    }

};

export const getUserConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiverId]
            });

            return res.status(201).json({
                success: true,
                message: "New conversation created successfully",
                data: conversation
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversation retrieved successfully",
            data: conversation
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Failed to retrieve conversation"
        });
    }
};

export const getAllConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId as string;
        const conversations = await Conversation.find({ members: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Conversations retrieved successfully",
            data: conversations
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to retrieve conversations"
        });
    }
};