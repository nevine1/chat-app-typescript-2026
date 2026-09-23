import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewConversation, getUserConversation, getAllConversations } from "../controller/conversationController";

const conversationRoute = express.Router();

conversationRoute.post("/createConversation", authMiddleware, createNewConversation);
conversationRoute.post("/getConversation", authMiddleware, getUserConversation);
conversationRoute.get("/getAllConversations", authMiddleware, getAllConversations);
export default conversationRoute;