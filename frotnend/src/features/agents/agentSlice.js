
import { createSlice } from "@reduxjs/toolkit";

import {
  createAgent,
  fetchAgents,
  fetchAgentById,
  updateAgent,
  deleteAgent,
  toggleAgentStatus,
} from "./agentThunks";

const initialState = {
  agents: [],
  currentAgent: null,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agents",
  initialState,

  reducers: {
    clearAgentError: (state) => {
      state.error = null;
    },

    clearCurrentAgent: (state) => {
      state.currentAgent = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE AGENT
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.agents.unshift(action.payload);
        state.currentAgent = action.payload;
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL AGENTS
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE AGENT
      .addCase(fetchAgentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAgent = action.payload;
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE AGENT
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false;

        const updatedAgent = action.payload;

        state.agents = state.agents.map((agent) =>
          agent._id === updatedAgent._id ? updatedAgent : agent
        );

        if (state.currentAgent?._id === updatedAgent._id) {
          state.currentAgent = updatedAgent;
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE AGENT
      .addCase(deleteAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.loading = false;

        const deletedAgentId = action.payload;

        state.agents = state.agents.filter(
          (agent) => agent._id !== deletedAgentId
        );

        if (state.currentAgent?._id === deletedAgentId) {
          state.currentAgent = null;
        }
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TOGGLE AGENT STATUS
      .addCase(toggleAgentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAgentStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedAgent = action.payload;

        state.agents = state.agents.map((agent) =>
          agent._id === updatedAgent._id ? updatedAgent : agent
        );

        if (state.currentAgent?._id === updatedAgent._id) {
          state.currentAgent = updatedAgent;
        }
      })
      .addCase(toggleAgentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAgentError,
  clearCurrentAgent,
} = agentSlice.actions;

export default agentSlice.reducer;
