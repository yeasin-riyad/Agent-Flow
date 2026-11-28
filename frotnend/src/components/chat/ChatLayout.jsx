
import { RotateCcw, Sparkles, Bot, LoaderCircle } from "lucide-react";

import HomeHeader from "@/components/layout/HomeHeader";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

const ChatLayout = ({
    approval = null,
  onApproval,
  title = "AgentFlow Assistant",
  subtitle = "Ready to help",
  badge = "AI CHAT",
  messages = [],
  loading = false,
  historyLoading = false,
  error = null,
  onSendMessage,
  onClearChat,
  onSelectAgent,
  showAgentSelector = true,
  welcomeLabel = "Your AI Workspace",
  welcomeTitle = "Your AI Workspace",
  welcomeDescription = "Ask questions, explore ideas, and automate your workflow.",
}) => {
  const hasMessages = messages.length > 0;
  const showWelcome = !historyLoading && !hasMessages;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#080B16] text-white lg:flex-row">
      <HomeHeader />

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-3 pt-4 sm:px-6 lg:ml-64 lg:px-10 lg:pt-6">

        {showWelcome && (
          <section className="mb-4 shrink-0">
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400 sm:text-xs">
              <Sparkles size={14} />
              {welcomeLabel}
            </div>

            <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {welcomeTitle}
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {welcomeDescription}
            </p>
          </section>
        )}

        <section className="mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0C1120] shadow-2xl shadow-black/20 sm:mb-5 sm:rounded-2xl">

          {/* Chat Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <Bot size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xs font-semibold text-white sm:text-sm">
                  {title}
                </h2>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-500 sm:text-[11px]">
                    {subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {hasMessages && onClearChat && (
                <button
                  onClick={onClearChat}
                  disabled={loading}
                  title="Clear messages from screen"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-xs"
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">Clear screen</span>
                </button>
              )}

              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[9px] font-medium text-violet-300 sm:px-3 sm:text-[10px]">
                {badge}
              </span>
            </div>
          </div>

          {/* Messages */}
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
              onSuggestionClick={onSendMessage}
              approval={approval}
            onApproval={onApproval}
            />
          )}

          {/* Input */}
          <div className="shrink-0">
            <ChatInput
              onSend={onSendMessage}
              loading={loading || historyLoading}
              onSelectAgent={onSelectAgent}
              showAgentSelector={showAgentSelector}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatLayout;
