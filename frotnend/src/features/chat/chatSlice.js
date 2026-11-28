
import { createSlice } from "@reduxjs/toolkit";

import {
  sendChatMessage,
  getAllChats,
  sendAgentChatMessage,
  getAgentChats,
  resumeAgentChat,
} from "./chatThunks";

const createConversationState = () => ({
  agent: null,
  messages: [],
  loading: false,
  historyLoading: false,
  error: null,
  approval: null,
});

const initialState = {
  general: createConversationState(),
  agents: {},
};

const getAgentState = (state, agentId) => {
  if (!state.agents[agentId]) {
    state.agents[agentId] = createConversationState();
  }

  return state.agents[agentId];
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    // Clear only the General Chat screen
    clearChat: (state) => {
      state.general.messages = [];
      state.general.error = null;
    },

    // Clear a particular Agent Chat screen
    clearAgentChat: (state, action) => {
      const agentId = action.payload;
      const agentState = state.agents[agentId];

      if (agentState) {
        agentState.messages = [];
        agentState.error = null;
      }
    },

    clearChatError: (state) => {
      state.general.error = null;
    },

    clearAgentChatError: (state, action) => {
      const agentState = state.agents[action.payload];

      if (agentState) {
        agentState.error = null;
      }
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // GENERAL CHAT HISTORY
    // ==========================================

    builder
      .addCase(getAllChats.pending, (state) => {
        state.general.historyLoading = true;
        state.general.error = null;
      })

      .addCase(getAllChats.fulfilled, (state, action) => {
        state.general.historyLoading = false;
        state.general.messages = action.payload;
      })

      .addCase(getAllChats.rejected, (state, action) => {
        state.general.historyLoading = false;
        state.general.error = action.payload;
      });

    // ==========================================
    // GENERAL CHAT MESSAGE
    // ==========================================

    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.general.loading = true;
        state.general.error = null;

        state.general.messages.push({
          id: action.meta.requestId,
          role: "user",
          content: action.meta.arg.trim(),
          status: "sending",
        });
      })

      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.general.loading = false;

        const userMessage = state.general.messages.find(
          (message) =>
            message.id === action.meta.requestId
        );

        if (userMessage) {
          userMessage.status = "sent";
        }

        state.general.messages.push({
          id: `${action.meta.requestId}-ai`,
          role: "assistant",
          content: action.payload.aiMessage || "",
          status: "sent",
        });
      })

      .addCase(sendChatMessage.rejected, (state, action) => {
        state.general.loading = false;
        state.general.error =
          action.payload || "Failed to send message.";

        const userMessage = state.general.messages.find(
          (message) =>
            message.id === action.meta.requestId
        );

        if (userMessage) {
          userMessage.status = "failed";
        }
      });

    // ==========================================
    // AGENT CHAT HISTORY
    // ==========================================

    builder
      .addCase(getAgentChats.pending, (state, action) => {
        const agentState = getAgentState(
          state,
          action.meta.arg
        );

        agentState.historyLoading = true;
        agentState.error = null;
      })

      .addCase(getAgentChats.fulfilled, (state, action) => {
        const { agentId, agent, messages } = action.payload;

        const agentState = getAgentState(state, agentId);

        agentState.historyLoading = false;
        agentState.agent = agent;
        agentState.messages = messages;
      })

      .addCase(getAgentChats.rejected, (state, action) => {
        const agentState = getAgentState(
          state,
          action.meta.arg
        );

        agentState.historyLoading = false;
        agentState.error = action.payload;
      });

    // ==========================================
    // AGENT CHAT MESSAGE
    // ==========================================

    builder
      .addCase(sendAgentChatMessage.pending, (state, action) => {
        const { agentId, message } = action.meta.arg;

        const agentState = getAgentState(state, agentId);

        agentState.loading = true;
        agentState.error = null;

        agentState.messages.push({
          id: action.meta.requestId,
          role: "user",
          content: message.trim(),
          status: "sending",
        });
      })

      .addCase(sendAgentChatMessage.fulfilled, (state, action) => {
        const {
          agentId,
          aiMessage,
          requiresApproval,
          approval,
        } = action.payload;

        const agentState = getAgentState(state, agentId);

        agentState.loading = false;

        const userMessage = agentState.messages.find(
          (message) =>
            message.id === action.meta.requestId
        );

        if (userMessage) {
          userMessage.status = "sent";
        }

        if (requiresApproval) {
          agentState.approval = approval;
          return;
        }

        agentState.messages.push({
          id: `${action.meta.requestId}-ai`,
          role: "assistant",
          content: aiMessage || "",
          status: "sent",
        });
      })

      .addCase(sendAgentChatMessage.rejected, (state, action) => {
        const { agentId } = action.meta.arg;

        const agentState = getAgentState(state, agentId);

        agentState.loading = false;
        agentState.error =
          action.payload || "Failed to send agent message.";

        const userMessage = agentState.messages.find(
          (message) =>
            message.id === action.meta.requestId
        );

        if (userMessage) {
          userMessage.status = "failed";
        }
      });

    // ==========================================
    // RESUME AGENT CHAT / APPROVAL
    // ==========================================

    builder
      .addCase(resumeAgentChat.pending, (state, action) => {
        const agentState = getAgentState(
          state,
          action.meta.arg.agentId
        );

        agentState.loading = true;
        agentState.error = null;
      })

      .addCase(resumeAgentChat.fulfilled, (state, action) => {
        const {
          agentId,
          aiMessage,
          requiresApproval,
          approval,
        } = action.payload;

        const agentState = getAgentState(state, agentId);

        agentState.loading = false;

        if (requiresApproval) {
          agentState.approval = approval;
          return;
        }

        agentState.approval = null;

        agentState.messages.push({
          id: `${action.meta.requestId}-ai`,
          role: "assistant",
          content: aiMessage || "",
          status: "sent",
        });
      })

      .addCase(resumeAgentChat.rejected, (state, action) => {
        const agentState = getAgentState(
          state,
          action.meta.arg.agentId
        );

        agentState.loading = false;
        agentState.error =
          action.payload || "Failed to process approval.";
      });
  },
});

export const {
  clearChat,
  clearAgentChat,
  clearChatError,
  clearAgentChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
