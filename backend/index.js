
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getMcpTools } from "./mcp/mcpClient.js";

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin:process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/chat", chatRoutes);

const tools = await getMcpTools();

console.log("Available MCP Tools:", tools);

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`AgentFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
