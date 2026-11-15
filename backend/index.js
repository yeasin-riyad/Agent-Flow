
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

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
