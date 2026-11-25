import express from "express";
import { agentChat, chatAgent, getAllChats } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, chatAgent);
router.post("/agent", isAuthenticated, agentChat);

router.get("/", isAuthenticated, getAllChats);


export default router;