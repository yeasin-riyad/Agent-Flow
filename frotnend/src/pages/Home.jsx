
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RotateCcw, Sparkles, LoaderCircle } from "lucide-react";

import HomeHeader from "@/components/layout/HomeHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

import {
  sendChatMessage,
  getAllChats,
} from "@/features/chat/chatThunks";

import { clearChat } from "@/features/chat/chatSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    messages,
    loading,
    historyLoading,
    error,
  } = useSelector((state) => state.chat);

  const hasMessages = messages.length > 0;
  const showWelcome = !historyLoading && !hasMessages;

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllChats());
    }
  }, [dispatch, user?._id]);

  const handleSendMessage = (message) => {
    dispatch(sendChatMessage(message));
  };

  const handleClearChat = () => {
    if (loading || !hasMessages) return;

    dispatch(clearChat());
  };

  return (
<div className="flex h-dvh w-full flex-col overflow-hidden bg-[#080B16] text-white lg:flex-row">
      {/* Header */}
      <HomeHeader />

      {/* Main Content */}
  <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-3 pt-4 sm:px-6 lg:ml-64 lg:px-10 lg:pt-6">

        {/* Welcome Section - Only when there are no messages */}
        {showWelcome && (
          <section className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 sm:mb-5 sm:gap-4">

            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
                <Sparkles size={14} />
                Your AI Workspace
              </div>

              <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Welcome back,{" "}
                <span className="text-violet-400">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </h1>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Ask questions, explore ideas, and automate your workflow.
              </p>
            </div>

          </section>
        )}

        {/* Chat Workspace */}
        <section className="mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0C1120] shadow-2xl shadow-black/20 sm:mb-5 sm:rounded-2xl">

          {/* Chat Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-3 py-3 sm:px-5 sm:py-4">

            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <Sparkles size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xs font-semibold text-white sm:text-sm">
                  AgentFlow Assistant
                </h2>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-500 sm:text-[11px]">
                    Ready to help
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">

              {hasMessages && (
                <button
                  onClick={handleClearChat}
                  disabled={loading}
                  title="Clear messages from screen"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-xs"
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">Clear screen</span>
                </button>
              )}

              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[9px] font-medium text-violet-300 sm:px-3 sm:text-[10px]">
                AI CHAT
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          {historyLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoaderCircle
                size={25}
                className="animate-spin text-violet-400"
              />
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              loading={loading}
              error={error}
              onSuggestionClick={handleSendMessage}
            />
          )}

          {/* Chat Input */}
          <div className="shrink-0">
            <ChatInput
              onSend={handleSendMessage}
              loading={loading || historyLoading}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
