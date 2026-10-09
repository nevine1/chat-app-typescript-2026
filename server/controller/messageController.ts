
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

        const newMessage = await Message.create({
            conversationId,
            senderId,
            receiverId,
            text,
            image: imageFile ? imageFile.path : undefined
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



export const editMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const file = req.file;

        //  Validate the message ID
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
            return;
        }

        const userId = (req as any).userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        //  Build the fields that should be updated
        const updateData: { text?: string; image?: string } = {};

        if (text !== undefined) {
            updateData.text = text;
        }

        if (file) {
            updateData.image = file.path;
        }

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: "No changes provided",
            });
            return;
        }

        //  Update only a message sent by the logged-in user
        const updatedMessage = await Message.findOneAndUpdate(
            {
                _id: messageId,
                senderId: userId,
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            res.status(404).json({
                success: false,
                message: "Message not found or you cannot edit this message",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage,
        });
    } catch (err) {
        console.error("Failed to update message:", err);

        res.status(500).json({
            success: false,
            message: "Failed to update message",
        });
    }
};
