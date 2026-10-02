import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewConversation, getUserConversations, getAllConversations } from "../controller/conversationController";

const conversationRoute = express.Router();

conversationRoute.post("/createConversation", authMiddleware, createNewConversation);
conversationRoute.post("/getConversation", authMiddleware, getUserConversations);
conversationRoute.get("/getAllConversations", authMiddleware, getAllConversations);
export default conversationRoute;