import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewConversation, getUserConversation } from "../controller/conversationController";

const conversationRoute = express.Router();

conversationRoute.post("/createConversation", authMiddleware, createNewConversation);
conversationRoute.post("/getConversation", authMiddleware, getUserConversation);

export default conversationRoute;