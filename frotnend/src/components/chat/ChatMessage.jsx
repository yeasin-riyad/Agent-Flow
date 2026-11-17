import { Bot, User, AlertCircle } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <Bot size={19} />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
            isUser
              ? "rounded-br-sm bg-gradient-to-br from-violet-600 to-blue-600 text-white"
              : "rounded-bl-sm border border-white/[0.08] bg-[#111729] text-slate-200"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">
            {typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content)}
          </p>
        </div>

        {isUser && message.status === "failed" && (
          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-red-400">
            <AlertCircle size={13} />
            Message failed to send
          </div>
        )}

        {isUser && message.status === "sending" && (
          <p className="mt-1 text-right text-[11px] text-slate-500">
            Sending...
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;