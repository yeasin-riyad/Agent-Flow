
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios";

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/chat", {
        message: message.trim(),
      });

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return { aiMessage: data.aiMessage };
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

      return data.messages;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load chat history."
      );
    }
  }
);
