
import mongoose from "mongoose";
import Agent from "../models/agent.model.js";

// CREATE AGENT
export const createAgent = async (req, res) => {
  try {
    const { name, knowledgeBase, instructions, tools } = req.body;

    if (!name || !instructions) {
      return res.status(400).json({
        success: false,
        message: "Agent name and instructions are required.",
      });
    }

    const agent = await Agent.create({
      userId: req.user._id,
      name,
      knowledgeBase: knowledgeBase || "",
      instructions,
      tools: Array.isArray(tools) ? tools : [],
    });

    return res.status(201).json({
      success: true,
      message: "Agent created successfully.",
      agent,
    });
  } catch (error) {
    console.error("Create Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create agent.",
    });
  }
};

// GET ALL USER AGENTS
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalAgents: agents.length,
      agents,
    });
  } catch (error) {
    console.error("Get All Agents Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch agents.",
    });
  }
};

// GET SINGLE AGENT
export const getAgentById = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent ID.",
      });
    }

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

    return res.status(200).json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error("Get Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch agent.",
    });
  }
};

// UPDATE AGENT
export const updateAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { name, knowledgeBase, instructions, tools } = req.body;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent ID.",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (knowledgeBase !== undefined) updates.knowledgeBase = knowledgeBase;
    if (instructions !== undefined) updates.instructions = instructions;

    if (tools !== undefined) {
      if (!Array.isArray(tools)) {
        return res.status(400).json({
          success: false,
          message: "Tools must be an array.",
        });
      }

      updates.tools = tools;
    }

    const agent = await Agent.findOneAndUpdate(
      {
        _id: agentId,
        userId: req.user._id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agent updated successfully.",
      agent,
    });
  } catch (error) {
    console.error("Update Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update agent.",
    });
  }
};

// DELETE AGENT
export const deleteAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent ID.",
      });
    }

    const agent = await Agent.findOneAndDelete({
      _id: agentId,
      userId: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agent deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete agent.",
    });
  }
};

// TOGGLE AGENT STATUS
export const toggleAgentStatus = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent ID.",
      });
    }

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

    agent.isActive = !agent.isActive;
    await agent.save();

    return res.status(200).json({
      success: true,
      message: `Agent ${agent.isActive ? "activated" : "deactivated"} successfully.`,
      agent,
    });
  } catch (error) {
    console.error("Toggle Agent Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change agent status.",
    });
  }
};
