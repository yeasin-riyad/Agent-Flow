import { useEffect, useRef } from "react";
import { Bot, LoaderCircle, AlertCircle } from "lucide-react";

import ChatMessage from "./ChatMessage";
import EmptyChat from "./EmptyChat";

const ChatWindow = ({
  messages,
  loading,
  error,
  onSuggestionClick,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <EmptyChat onSuggestionClick={onSuggestionClick} />
        ) : (
          <div className="flex flex-col gap-7">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                  <Bot size={19} />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/[0.08] bg-[#111729] px-4 py-3">
                  <LoaderCircle
                    size={16}
                    className="animate-spin text-violet-400"
                  />
                  <span className="text-xs text-slate-400">
                    AgentFlow is thinking...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-300">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;