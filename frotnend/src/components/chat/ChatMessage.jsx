
import { Bot, User, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ==========================================
// MARKDOWN COMPONENTS
// ==========================================

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-5 text-xl font-bold text-white">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-5 text-lg font-semibold text-white">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold text-white">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mb-3 break-words leading-7 text-slate-300 last:mb-0">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="mb-3 ml-5 list-disc space-y-2 text-slate-300">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-2 text-slate-300">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="pl-1 leading-7">
      {children}
    </li>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-white">
      {children}
    </strong>
  ),

  em: ({ children }) => (
    <em className="text-violet-300">
      {children}
    </em>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-violet-500/60 bg-violet-500/[0.06] py-2 pl-4 text-slate-300">
      {children}
    </blockquote>
  ),

  code: ({ children, className }) => {
    const isCodeBlock = Boolean(className);

    return (
      <code
        className={
          isCodeBlock
            ? "font-mono text-xs leading-6 text-violet-200"
            : "rounded-md border border-white/[0.08] bg-[#080B16] px-1.5 py-0.5 font-mono text-xs text-violet-300"
        }
      >
        {children}
      </code>
    );
  },

  pre: ({ children }) => (
    <pre className="my-4 max-w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-[#080B16] p-4 text-xs leading-6">
      {children}
    </pre>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-violet-400 underline decoration-violet-400/40 underline-offset-4 transition hover:text-violet-300"
    >
      {children}
    </a>
  ),

  hr: () => (
    <hr className="my-5 border-white/10" />
  ),

  table: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full min-w-[400px] border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-white/[0.06] text-white">
      {children}
    </thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/[0.06]">
      {children}
    </tbody>
  ),

  tr: ({ children }) => (
    <tr className="border-b border-white/[0.06] last:border-0">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="whitespace-nowrap px-4 py-3 font-semibold">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 leading-6 text-slate-300">
      {children}
    </td>
  ),
};

// ==========================================
// CHAT MESSAGE
// ==========================================

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  const messageContent =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content, null, 2);

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI AVATAR */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <Bot size={19} />
        </div>
      )}

      {/* MESSAGE CONTENT */}
      <div
        className={`min-w-0 max-w-[85%] sm:max-w-[75%] ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`min-w-0 rounded-2xl px-4 py-3 text-sm leading-7 ${
            isUser
              ? "rounded-br-sm bg-gradient-to-br from-violet-600 to-blue-600 text-white"
              : "rounded-bl-sm border border-white/[0.08] bg-[#111729] text-slate-200"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">
              {messageContent}
            </p>
          ) : (
            <div className="min-w-0 break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {messageContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* FAILED MESSAGE */}
        {isUser && message.status === "failed" && (
          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-red-400">
            <AlertCircle size={13} />
            Message failed to send
          </div>
        )}

        {/* SENDING MESSAGE */}
        {isUser && message.status === "sending" && (
          <p className="mt-1 text-right text-[11px] text-slate-500">
            Sending...
          </p>
        )}
      </div>

      {/* USER AVATAR */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
