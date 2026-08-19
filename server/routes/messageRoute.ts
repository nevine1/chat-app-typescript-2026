import express from "express";
import { createNewMessage } from "../controller/messageController";

const messageRouter = express.Router();

messageRouter.post("/send", createNewMessage);


export default messageRouter;