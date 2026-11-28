
import { useEffect, useRef } from "react";

import {
  Bot,
  LoaderCircle,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import ChatMessage from "./ChatMessage";
import EmptyChat from "./EmptyChat";

const ChatWindow = ({
  messages = [],
  loading,
  error,
  approval,
  onApproval,
  onSuggestionClick,
}) => {
  const bottomRef = useRef(null);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, approval, error]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-6">

        {/* EMPTY CHAT */}
        {messages.length === 0 ? (
          <EmptyChat
            onSuggestionClick={onSuggestionClick}
          />
        ) : (
          <div className="flex flex-col gap-7">

            {/* CHAT MESSAGES */}
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
              />
            ))}

            {/* LOADING INDICATOR */}
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

            {/* ERROR MESSAGE */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-300">
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {/* HUMAN APPROVAL */}
        {approval && (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-4 sm:p-5">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">
                  {approval.title || "Action approval required"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {approval.message ||
                    "This Agent wants to perform an action. Review it before continuing."}
                </p>
              </div>
            </div>

            {/* ACTION DETAILS */}
            {approval.actions?.length > 0 && (
              <div className="mt-4 space-y-3">
                {approval.actions.map((action, index) => (
                  <div
                    key={action.id || index}
                    className="rounded-xl border border-white/[0.08] bg-[#080B16] p-3"
                  >
                    <p className="text-xs font-semibold text-violet-300">
                      {action.name}
                    </p>

                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-slate-400">
                      {JSON.stringify(
                        action.arguments ?? action.args ?? {},
                        null,
                        2
                      )}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* APPROVAL BUTTONS */}
            <div className="mt-5 flex flex-wrap justify-end gap-2">

              {/* REJECT */}
              <button
                type="button"
                onClick={() => onApproval?.(false)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={14} />
                Reject
              </button>

              {/* APPROVE */}
              <button
                type="button"
                onClick={() => onApproval?.(true)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={14} />
                )}

                Approve & Continue
              </button>
            </div>
          </div>
        )}

        {/* AUTO SCROLL TARGET */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
