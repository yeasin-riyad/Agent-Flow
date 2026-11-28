
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";

import ChatLayout from "@/components/chat/ChatLayout";

import {
  getAgentChats,
  sendAgentChatMessage,
  resumeAgentChat,
} from "@/features/chat/chatThunks";

import { clearAgentChat } from "@/features/chat/chatSlice";

const EMPTY_AGENT_CHAT = {
  agent: null,
  messages: [],
  loading: false,
  historyLoading: false,
  error: null,
  approval: null,
};

const AgentChat = () => {
  const { agentId } = useParams();
  const dispatch = useDispatch();

  const agentChat = useSelector(
    (state) => state.chat.agents[agentId] || EMPTY_AGENT_CHAT
  );

  const {
    agent,
    messages,
    loading,
    historyLoading,
    error,
    approval,
  } = agentChat;

  // Load this Agent's conversation
  useEffect(() => {
    if (agentId) {
      dispatch(getAgentChats(agentId));
    }
  }, [dispatch, agentId]);

  const handleSendMessage = (message) => {
    dispatch(
      sendAgentChatMessage({
        agentId,
        message,
      })
    );
  };

  const handleApproval = (approved) => {
    if (loading || !approval) return;

    dispatch(
      resumeAgentChat({
        agentId,
        approved,
      })
    );
  };

  const handleClearChat = () => {
    if (loading || !messages.length) return;

    dispatch(clearAgentChat(agentId));
  };

  // Invalid route parameter
  if (!agentId) {
    return <Navigate to="/agents" replace />;
  }

  return (
    <ChatLayout
      title={agent?.name || "Your AI Agent"}
      subtitle="Your dedicated AI assistant"
      badge="AGENT CHAT"
      messages={messages}
      loading={loading}
      historyLoading={historyLoading}
      error={error}
      approval={approval}
      onApproval={handleApproval}
      onSendMessage={handleSendMessage}
      onClearChat={handleClearChat}
      showAgentSelector={false}
      welcomeLabel="Your Personal AI Agent"
      welcomeTitle={`Chat with ${agent?.name || "your agent"}`}
      welcomeDescription={
        "Your Agent uses its own instructions, knowledge base, and assigned tools."
      }
    />
  );
};

export default AgentChat;
