
import Conversation from '../models/conversationModel';
import Message from '../models/messageModel';
import { Request, Response } from "express";


export const createNewMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const { senderId, receiverId, text } = req.body;
        const imageFile = req.file; // Assuming you're using multer for file uploads


        //saving the image file path if an image is uploaded
        if (imageFile) {
            newMessage.image = imageFile.path; // Save the file path to the message document
        }
        const newMessage = await Message.create({
            conversationId,
            senderId,
            receiverId,
            text
        });
        /* const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            text
        }); */


        await newMessage.save();

        console.log(
            `Created message: conversationId: ${conversationId}, senderId: ${senderId}, receiverId: ${receiverId}, text: ${text}`
        );

        return res.status(201).json({
            success: true,
            message: "Message created successfully",
            data: newMessage
        });

    } catch (err) {
        console.error("Failed to create message:", err);

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