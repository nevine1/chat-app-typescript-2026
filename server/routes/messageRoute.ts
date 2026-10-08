import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewMessage, getAllMessages } from "../controller/messageController";
import uploadChatImages from "../middleware/chatImges.ts";
const messageRouter = express.Router();

messageRouter.post("/sendMessage/:conversationId", uploadChatImages.single("image"), authMiddleware, createNewMessage);
messageRouter.get("/getMessages/conversation/:conversationId", authMiddleware, getAllMessages);

export default messageRouter;