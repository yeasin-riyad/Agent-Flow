
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios";

// ==========================================
// GENERAL CHAT
// ==========================================

export const sendChatMessage = createAsyncThunk(
  "chat/sendGeneralMessage",
  async (message, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/chat", {
        message: message.trim(),
      });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/chat");

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.messages || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load chat history."
      );
    }
  }
);

// ==========================================
// AGENT CHAT
// ==========================================

export const sendAgentChatMessage = createAsyncThunk(
  "chat/sendAgentMessage",
  async ({ agentId, message }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/chat/agent", {
        agentId,
        message: message.trim(),
      });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return {
        agentId,
        aiMessage: data.aiMessage,
        requiresApproval: data.requiresApproval || false,
        approval: data.approval || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send agent message."
      );
    }
  }
);

export const getAgentChats = createAsyncThunk(
  "chat/getAgentChats",
  async (agentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/chat/agent/${agentId}`
      );

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return {
        agentId,
        agent: data.agent,
        messages: data.messages || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load agent conversation."
      );
    }
  }
);

// ==========================================
// HUMAN APPROVAL
// ==========================================

export const resumeAgentChat = createAsyncThunk(
  "chat/resumeAgentChat",
  async ({ agentId, approved }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/chat/agent/resume",
        {
          agentId,
          approved,
        }
      );

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return {
        agentId,
        aiMessage: data.aiMessage,
        requiresApproval: data.requiresApproval || false,
        approval: data.approval || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to process approval."
      );
    }
  }
);
