import express from "express";
import {
  chatAgent,
  agentChat,
  getAllChats,
  getAgentChats,
  resumeAgentChat,
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post("/", isAuthenticated, chatAgent);

router.get("/", isAuthenticated, getAllChats);

router.post("/agent", isAuthenticated, agentChat);

router.get("/agent/:agentId", isAuthenticated, getAgentChats);

router.post("/agent/resume", isAuthenticated, resumeAgentChat);

export default router;
