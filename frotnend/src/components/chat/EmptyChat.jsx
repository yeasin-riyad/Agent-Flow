import { Bot, Sparkles, MessageSquare, Zap } from "lucide-react";

const suggestions = [
  {
    icon: MessageSquare,
    title: "Answer questions",
    description: "Get help with your everyday questions.",
  },
  {
    icon: Zap,
    title: "Automate tasks",
    description: "Explore ways to automate repetitive work.",
  },
  {
    icon: Sparkles,
    title: "Generate ideas",
    description: "Brainstorm ideas and create something new.",
  },
];

const EmptyChat = ({ onSuggestionClick }) => {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20 shadow-lg shadow-violet-500/10">
        <Bot size={34} className="text-violet-300" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        How can I help you today?
      </h2>

      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
        Ask me anything, explore ideas, or discover how AI can help automate
        your everyday tasks.
      </p>

      <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => onSuggestionClick(item.title)}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-left transition-all hover:border-violet-400/30 hover:bg-violet-500/[0.06]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-colors group-hover:bg-violet-500/20">
                <Icon size={20} />
              </div>

              <h3 className="text-sm font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyChat;