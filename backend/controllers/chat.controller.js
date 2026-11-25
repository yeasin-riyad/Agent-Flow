
import mongoose from "mongoose";
import { HumanMessage } from "@langchain/core/messages";

import chatGraph from "../utils/chatGraph.js";
import Agent from "../models/agent.model.js";
import { createAgentGraph } from "../utils/agentGraph.js";

// ==========================================
// GENERAL CHAT
// ==========================================

export const chatAgent = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const threadId = String(req.user._id);

    const data = await chatGraph.invoke(
      {
        messages: [new HumanMessage(message.trim())],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    const lastMessage = data.messages?.at(-1);

    return res.status(200).json({
      success: true,
      aiMessage: lastMessage?.content ?? "",
    });
  } catch (error) {
    console.error("General Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your message.",
    });
  }
};

// ==========================================
// AGENT CHAT
// ==========================================

export const agentChat = async (req, res) => {
  try {
    const { message, agentId } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Validate agent ID
    if (!agentId || !mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid agent ID is required.",
      });
    }

    const userId = req.user._id;

    // Find agent owned by authenticated user
    const existingAgent = await Agent.findOne({
      _id: agentId,
      userId,
    });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    // Separate conversation for each agent
    const threadId = `${userId}_${existingAgent._id}`;

    // Create agent-specific graph
    const graph = await createAgentGraph(existingAgent, userId);

    // Invoke graph
    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message.trim())],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    const lastMessage = result.messages?.at(-1);

    return res.status(200).json({
      success: true,
      agent: {
        _id: existingAgent._id,
        name: existingAgent.name,
      },
      aiMessage: lastMessage?.content ?? "",
    });
  } catch (error) {
    console.error("Agent Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your agent message.",
    });
  }
};

// ==========================================
// GET GENERAL CHAT HISTORY
// ==========================================

export const getAllChats = async (req, res) => {
  try {
    const threadId = String(req.user._id);

    const state = await chatGraph.getState({
      configurable: {
        thread_id: threadId,
      },
    });

    const messages = state.values?.messages || [];

    const formattedMessages = messages.map((message, index) => ({
      id: message.id || `${threadId}-${index}`,
      role:
        message.getType?.() === "human"
          ? "user"
          : message.getType?.() === "ai"
            ? "assistant"
            : "system",
      content: message.content,
    }));

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Get All Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat history.",
    });
  }
};

// ==========================================
// GET AGENT CHAT HISTORY
// ==========================================

export const getAgentChats = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid agent ID is required.",
      });
    }

    const userId = req.user._id;

    const existingAgent = await Agent.findOne({
      _id: agentId,
      userId,
    });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    const threadId = `${userId}_${existingAgent._id}`;

    const graph = await createAgentGraph(existingAgent, userId);

    const state = await graph.getState({
      configurable: {
        thread_id: threadId,
      },
    });

    const messages = state.values?.messages || [];

    const formattedMessages = messages.map((message, index) => ({
      id: message.id || `${threadId}-${index}`,
      role:
        message.getType?.() === "human"
          ? "user"
          : message.getType?.() === "ai"
            ? "assistant"
            : "system",
      content: message.content,
    }));

    return res.status(200).json({
      success: true,
      agent: {
        _id: existingAgent._id,
        name: existingAgent.name,
      },
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Get Agent Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve agent chat history.",
    });
  }
};
