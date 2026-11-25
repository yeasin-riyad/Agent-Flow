import mongoose from "mongoose";
import { HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
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
      },
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

    const config = {
      configurable: {
        thread_id: threadId,
      },
    };

    // Invoke graph
    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message.trim())],
      },
      config,
    );

    // Check whether graph is waiting for approval
    if (result.__interrupt__?.length) {
      return res.status(200).json({
        success: true,
        requiresApproval: true,
        approval: result.__interrupt__[0].value,
      });
    }

    const lastMessage = result.messages?.at(-1);

    return res.status(200).json({
      success: true,
      requiresApproval: false,
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





export const resumeAgentChat = async (req, res) => {
  try {
    const { agentId, approved } = req.body;

    if (
      !mongoose.isValidObjectId(agentId) ||
      typeof approved !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid agentId and approval decision are required.",
      });
    }

    const userId = req.user._id;

    // Verify ownership again
    const agent = await Agent.findOne({
      _id: agentId,
      userId,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    const graph = await createAgentGraph(agent, userId);

    const threadId = `${userId}_${agent._id}`;

    const result = await graph.invoke(
      new Command({
        resume: { approved },
      }),
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    // Another approval may be required if the agent
    // requests a different write action.
    if (result.__interrupt__?.length) {
      return res.status(200).json({
        success: true,
        requiresApproval: true,
        approval: result.__interrupt__[0].value,
      });
    }

    return res.status(200).json({
      success: true,
      requiresApproval: false,
      aiMessage: result.messages?.at(-1)?.content ?? "",
    });
  } catch (error) {
    console.error("Resume Agent Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resume agent execution.",
    });
  }
};
