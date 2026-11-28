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

    // 1. Validate request
    if (!agentId || !mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid agent ID is required.",
      });
    }

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Approval decision must be true or false.",
      });
    }

    const userId = String(req.user._id);

    // 2. Verify agent ownership
    const agent = await Agent.findOne({
      _id: agentId,
      userId: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    // 3. Generate the original thread ID
    const threadId = `${userId}_${agent._id}`;

    const config = {
      configurable: {
        thread_id: threadId,
      },
    };

    // 4. Recreate the same graph
    // It must use the same persistent checkpointer.
    const graph = await createAgentGraph(agent, userId);

    // 5. Retrieve current checkpoint state
    const snapshot = await graph.getState(config);

    // 6. Find pending interrupts
    const pendingInterrupts = (snapshot.tasks || [])
      .flatMap((task) => task.interrupts || []);

    // 7. Verify this is actually a pending approval
    const pendingApproval = pendingInterrupts.find(
      (item) =>
        item.value?.type === "tool_approval" &&
        item.value?.agentId === String(agent._id) &&
        item.value?.userId === userId
    );

    if (!pendingApproval) {
      return res.status(409).json({
        success: false,
        message:
          "No pending approval found. This action may already be processed.",
      });
    }

    // 8. Resume the interrupted workflow
    const result = await graph.invoke(
      new Command({
        resume: {
          approved,
        },
      }),
      config
    );

    // 9. Check if another approval is required
    if (result.__interrupt__?.length) {
      return res.status(200).json({
        success: true,
        requiresApproval: true,
        approval: result.__interrupt__[0].value,
      });
    }

    // 10. Get final AI response
    const lastMessage = result.messages?.at(-1);

    return res.status(200).json({
      success: true,
      requiresApproval: false,
      aiMessage: lastMessage?.content ?? "",
    });

  } catch (error) {
    console.error("Resume Agent Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resume agent execution.",
    });
  }
};



