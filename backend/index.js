
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import {
  getMcpTools,
  closeMcpAdapter,
} from "./mcp/mcpClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AgentFlow API is running.",
  });
});

// Graceful shutdown
let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down AgentFlow...`);

  try {
    await closeMcpAdapter();

    console.log("MCP adapter closed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exit(1);
  }
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

// Start server
const startServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDb();
    console.log("MongoDB connected successfully.");

    // 2. Initialize shared MCP tools
    const tools = await getMcpTools();

    // console.log(
    //   "Available MCP Tools:",
    //   tools.map((tool) => tool.name)
    // );

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`AgentFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    try {
      await closeMcpAdapter();
    } catch (shutdownError) {
      console.error("MCP cleanup failed:", shutdownError);
    }

    process.exit(1);
  }
};

startServer();
