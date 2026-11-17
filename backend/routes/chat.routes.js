import express from "express";
import { chatAgent, getAllChats } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, chatAgent);
router.get("/", isAuthenticated, getAllChats);


export default router;