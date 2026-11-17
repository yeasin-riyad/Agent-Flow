
import { createSlice } from "@reduxjs/toolkit";
import {
  sendChatMessage,
  getAllChats,
} from "./chatThunks";

const initialState = {
  messages: [],
  loading: false,
  historyLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.loading = false;
    },

    clearChatError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get chat history
      .addCase(getAllChats.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.messages = action.payload;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })

      // Send message
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        state.messages.push({
          id: action.meta.requestId,
          role: "user",
          content: action.meta.arg.trim(),
          status: "sending",
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;

        const userMessage = state.messages.find(
          (message) => message.id === action.meta.requestId
        );

        if (userMessage) userMessage.status = "sent";

        state.messages.push({
          id: `${action.meta.requestId}-ai`,
          role: "assistant",
          content: action.payload.aiMessage,
          status: "sent",
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send message.";

        const userMessage = state.messages.find(
          (message) => message.id === action.meta.requestId
        );

        if (userMessage) userMessage.status = "failed";
      });
  },
});

export const { clearChat, clearChatError } = chatSlice.actions;

export default chatSlice.reducer;
