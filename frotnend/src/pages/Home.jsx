
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ChatLayout from "@/components/chat/ChatLayout";

import {
  sendChatMessage,
  getAllChats,
} from "@/features/chat/chatThunks";

import { clearChat } from "@/features/chat/chatSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    messages,
    loading,
    historyLoading,
    error,
  } = useSelector((state) => state.chat.general);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllChats());
    }
  }, [dispatch, user?._id]);

  const handleSendMessage = (message) => {
    dispatch(sendChatMessage(message));
  };

  const handleSelectAgent = (agent) => {
    if (!agent?._id) return;

    navigate(`/agents/${agent._id}/chat`);
  };

  const handleClearChat = () => {
    if (loading || !messages.length) return;

    dispatch(clearChat());
  };

  return (
    <ChatLayout
      title="AgentFlow Assistant"
      subtitle="Ready to help"
      badge="GENERAL CHAT"
      messages={messages}
      loading={loading}
      historyLoading={historyLoading}
      error={error}
      onSendMessage={handleSendMessage}
      onClearChat={handleClearChat}
      onSelectAgent={handleSelectAgent}
      showAgentSelector={true}
      welcomeLabel="Your AI Workspace"
      welcomeTitle={
        `Welcome back, ${user?.name?.split(" ")[0] || "User"}`
      }
      welcomeDescription="Ask questions, explore ideas, and automate your workflow."
    />
  );
};

export default Home;
