import express from "express";
import authMiddleware from '../middleware/authMiddleware.ts'
import { createNewConversation } from "../controller/conversationController";

const conversationRoute = express.Router();

conversationRoute.post("/createConversation", authMiddleware, createNewConversation);

export default conversationRoute;