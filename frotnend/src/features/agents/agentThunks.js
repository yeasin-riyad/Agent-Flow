import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios";

// Common API error handler
const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || error.message || fallback;
};

// CREATE AGENT
export const createAgent = createAsyncThunk(
  "agents/createAgent",
  async (agentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/agents/create", agentData);
      return data.agent;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create agent.")
      );
    }
  }
);

// FETCH ALL AGENTS
export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/agents");
      return data.agents;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch agents.")
      );
    }
  }
);

// FETCH SINGLE AGENT
export const fetchAgentById = createAsyncThunk(
  "agents/fetchAgentById",
  async (agentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/agents/${agentId}`);
      return data.agent;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch agent.")
      );
    }
  }
);

// UPDATE AGENT
export const updateAgent = createAsyncThunk(
  "agents/updateAgent",
  async ({ agentId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/agents/${agentId}`,
        updates
      );

      return data.agent;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update agent.")
      );
    }
  }
);

// DELETE AGENT
export const deleteAgent = createAsyncThunk(
  "agents/deleteAgent",
  async (agentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/agents/${agentId}`);
      return agentId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete agent.")
      );
    }
  }
);

// TOGGLE AGENT STATUS
export const toggleAgentStatus = createAsyncThunk(
  "agents/toggleAgentStatus",
  async (agentId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/api/agents/${agentId}/toggle-status`
      );

      return data.agent;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to change agent status.")
      );
    }
  }
);