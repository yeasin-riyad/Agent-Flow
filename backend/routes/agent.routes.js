
import express from "express";
import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  toggleAgentStatus,
} from "../controllers/agent.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/create", createAgent);
router.get("/", getAllAgents);
router.get("/:agentId", getAgentById);
router.put("/:agentId", updateAgent);
router.delete("/:agentId", deleteAgent);
router.patch("/:agentId/toggle-status", toggleAgentStatus);

export default router;
