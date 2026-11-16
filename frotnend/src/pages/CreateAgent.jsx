
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createAgent } from "@/features/agents/agentThunks";

import {
  ArrowLeft,
  Workflow,
  Sparkles,
  Bot,
  Check,
  Calculator,
  Search,
  Mail,
  Send,
  Loader2,
  AlertCircle,
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

  // TOGGLE TOOLS
  const toggleTool = (toolId) => {
    setTools((prevTools) =>
      prevTools.includes(toolId)
        ? prevTools.filter((tool) => tool !== toolId)
        : [...prevTools, toolId]
    );
  };

  // CREATE AGENT
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
    <div className="min-h-screen bg-[#080B16] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080B16]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/25 transition-all duration-300 group-hover:scale-105">
              <Workflow size={23} />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                Agent<span className="text-violet-400">Flow</span>
              </span>

              <span className="text-[9px] font-semibold tracking-[0.22em] text-slate-500">
                AI AUTOMATION PLATFORM
              </span>
            </div>
          </Link>

          {/* PAGE TITLE */}
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 sm:flex">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-xs font-medium text-slate-300">
              Create New Agent
            </span>
          </div>

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate("/agents")}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="hidden sm:inline">Back to Agents</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">

        {/* PAGE INTRO */}
        <div className="mb-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <Bot size={28} className="text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create an Agent
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Configure your AI agent, define its behavior, and choose the
            tools it can use to complete tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* BASIC CONFIGURATION */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5 sm:p-7">

            <div className="mb-7">
              <h2 className="text-lg font-semibold">
                General Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Give your agent an identity and define its purpose.
              </p>
            </div>

            {/* AGENT NAME */}
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
                className="h-12 border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
              />

              <p className="text-right text-xs text-slate-600">
                {name.length}/100
              </p>
            </div>

            {/* INSTRUCTIONS */}
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
                rows={6}
                maxLength={5000}
                required
                className="resize-y border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
              />

              <p className="text-right text-xs text-slate-600">
                {instructions.length}/5000
              </p>
            </div>

            {/* KNOWLEDGE BASE */}
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
                rows={5}
                className="resize-y border-white/10 bg-[#080B16] text-white placeholder:text-slate-600 focus-visible:ring-violet-500"
              />

              <p className="text-xs text-slate-500">
                Provide additional context or information for your agent.
              </p>
            </div>
          </section>

          {/* TOOLS CONFIGURATION */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5 sm:p-7">

            <div className="mb-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Agent Tools
                </h2>

                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                  {tools.length} Selected
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
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
                    className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                      selected
                        ? "border-violet-500/50 bg-violet-500/[0.08]"
                        : "border-white/[0.08] bg-[#080B16] hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        selected
                          ? "bg-violet-500/20 text-violet-300"
                          : "bg-white/[0.05] text-slate-400 group-hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
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

          {/* ERROR MESSAGE */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => navigate("/")}
              className="h-12 border-white/10 bg-white/[0.03] px-7 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500 disabled:opacity-60"
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
      </main>
    </div>
  );
};

export default CreateAgent;
