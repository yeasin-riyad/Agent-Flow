
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeHeader from "@/components/layout/HomeHeader";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createAgent } from "@/features/agents/agentThunks";

import {
  Sparkles,
  Bot,
  Check,
  Calculator,
  Search,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const availableTools = [
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations.",
    icon: Calculator,
  },
  {
    id: "web.search",
    name: "Web Search",
    description: "Search the internet for real-time information.",
    icon: Search,
  },
  {
    id: "gmail.read",
    name: "Read Gmail",
    description: "Read and search your Gmail messages.",
    icon: Mail,
  },
  {
    id: "gmail.send",
    name: "Send Gmail",
    description: "Compose and send Gmail messages.",
    icon: Send,
  },
];

const CreateAgent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.agents);

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [tools, setTools] = useState([]);
  const [error, setError] = useState("");

  // Toggle selected tools
  const toggleTool = (toolId) => {
    setTools((prevTools) =>
      prevTools.includes(toolId)
        ? prevTools.filter((tool) => tool !== toolId)
        : [...prevTools, toolId]
    );
  };

  // Create agent
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter an agent name.");
      return;
    }

    if (!instructions.trim()) {
      setError("Please provide instructions for your agent.");
      return;
    }

    try {
      const newAgent = await dispatch(
        createAgent({
          name: name.trim(),
          instructions: instructions.trim(),
          knowledgeBase: knowledgeBase.trim(),
          tools,
        })
      ).unwrap();

      navigate(`/agents/${newAgent._id}`);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-dvh bg-[#080B16] text-white">

      {/* Sidebar */}
      <HomeHeader />

      {/* Main Content */}
      <main className="min-h-[calc(100dvh-60px)] lg:ml-64 lg:min-h-dvh">

        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

          {/* Page Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 sm:h-14 sm:w-14 sm:rounded-2xl">
                <Bot size={25} className="text-violet-400" />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400 sm:text-xs">
                  <Sparkles size={12} />
                  Agent Configuration
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Create an Agent
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/agents")}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white sm:px-4 sm:text-sm"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Agents
            </button>
          </div>

          <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-400 sm:mb-10 sm:text-base">
            Configure your AI agent, define its behavior, and choose the
            tools it can use to complete tasks.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* General Configuration */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-4 sm:p-6 lg:p-7">

              <div className="mb-6">
                <h2 className="text-base font-semibold sm:text-lg">
                  General Configuration
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Give your agent an identity and define its purpose.
                </p>
              </div>

              {/* Agent Name */}
              <div className="mb-6 space-y-2">
                <label
                  htmlFor="agentName"
                  className="text-sm font-medium text-slate-200"
                >
                  Agent Name <span className="text-red-400">*</span>
                </label>

                <Input
                  id="agentName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Research Assistant"
                  maxLength={100}
                  required
                  className="h-11 border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                />

                <p className="text-right text-xs text-slate-600">
                  {name.length}/100
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-6 space-y-2">
                <label
                  htmlFor="instructions"
                  className="text-sm font-medium text-slate-200"
                >
                  Instructions <span className="text-red-400">*</span>
                </label>

                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="You are a helpful AI assistant. Your job is to..."
                  rows={5}
                  maxLength={5000}
                  required
                  className="min-h-32 resize-y border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                />

                <p className="text-right text-xs text-slate-600">
                  {instructions.length}/5000
                </p>
              </div>

              {/* Knowledge Base */}
              <div className="space-y-2">
                <label
                  htmlFor="knowledgeBase"
                  className="text-sm font-medium text-slate-200"
                >
                  Knowledge Base
                </label>

                <Textarea
                  id="knowledgeBase"
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  placeholder="Add information your agent should know about..."
                  rows={4}
                  className="min-h-28 resize-y border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
                />

                <p className="text-xs text-slate-500">
                  Provide additional context or information for your agent.
                </p>
              </div>
            </section>

            {/* Tools Configuration */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-4 sm:p-6 lg:p-7">

              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-base font-semibold sm:text-lg">
                    Agent Tools
                  </h2>

                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                    {tools.length} Selected
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Select the capabilities available to your agent.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {availableTools.map((tool) => {
                  const selected = tools.includes(tool.id);
                  const Icon = tool.icon;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      aria-pressed={selected}
                      className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:gap-4 sm:p-4 ${
                        selected
                          ? "border-violet-500/50 bg-violet-500/[0.08]"
                          : "border-white/[0.08] bg-[#080B16] hover:border-white/20 hover:bg-white/[0.02]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11 ${
                          selected
                            ? "bg-violet-500/20 text-violet-300"
                            : "bg-white/[0.05] text-slate-400 group-hover:text-white"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-200">
                          {tool.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {tool.description}
                        </p>
                      </div>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          selected
                            ? "border-violet-500 bg-violet-500 text-white"
                            : "border-white/20 bg-transparent"
                        }`}
                      >
                        {selected && <Check size={13} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 text-xs text-slate-500">
                You can change your agent's tools later.
              </p>
            </section>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-400">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => navigate("/agents")}
                className="h-11 border-white/10 bg-white/[0.03] px-7 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Create Agent
                  </>
                )}
              </Button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
};

export default CreateAgent;
