import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewMessage, getAllMessages } from "../controller/messageController";

const messageRouter = express.Router();

messageRouter.post("/sendMessage/:conversationId", authMiddleware, createNewMessage);
messageRouter.get("/getMessages/conversation/:conversationId", authMiddleware, getAllMessages);

export default messageRouter;