
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import agentReducer from "../features/agents/agentSlice";
import chatReducer from "../features/chat/chatSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    agents: agentReducer,
    chat: chatReducer,

  },
});
