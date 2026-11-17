
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchAgents } from "@/features/agents/agentThunks";

import {
  ArrowUp,
  Sparkles,
  ImagePlus,
  Bot,
  X,
  Check,
  Plus,
  Settings2,
  Loader2,
} from "lucide-react";

const ChatInput = ({ onSend, loading, onImageSelect, onSelectAgent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const { agents = [], loading: agentsLoading } = useSelector(
    (state) => state.agents
  );

  const [message, setMessage] = useState("");
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // FETCH AGENTS
  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const activeAgents = agents.filter((agent) => agent.isActive);

  // SEND MESSAGE
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    onSend(trimmedMessage);

    setMessage("");
  };

  // ENTER TO SEND
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // IMAGE SELECTION
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setSelectedImage(file);
    onImageSelect?.(file);

    // Allow selecting the same image again
    e.target.value = "";
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelect?.(null);
  };

  // SELECT AGENT
  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    onSelectAgent?.(agent);
    setIsAgentModalOpen(false);
  };

  return (
    <>
      <div className="shrink-0 border-t border-white/[0.08] bg-[#080B16] px-3 py-2.5 sm:px-5 sm:py-3">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-white/10 bg-[#111729] px-2.5 py-2 transition-colors focus-within:border-violet-400/40 sm:px-3">

            {/* IMAGE PREVIEW */}
            {selectedImage && (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] p-2">
                <ImagePlus size={16} className="shrink-0 text-violet-400" />

                <span className="min-w-0 flex-1 truncate text-xs text-slate-300">
                  {selectedImage.name}
                </span>

                <button
                  type="button"
                  onClick={removeImage}
                  className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                  aria-label="Remove selected image"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* SELECTED AGENT */}
            {selectedAgent && (
              <div className="mb-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1.5 text-xs text-violet-300">
                  <Bot size={13} />
                  <span className="max-w-[160px] truncate">
                    {selectedAgent.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgent(null);
                      onSelectAgent?.(null);
                    }}
                    className="ml-1 text-violet-300/70 hover:text-white"
                    aria-label="Remove selected agent"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* TEXTAREA */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message your AI assistant..."
              rows={1}
              disabled={loading}
              className="max-h-24 min-h-[36px] w-full resize-none bg-transparent px-1 py-1.5 text-sm leading-5 text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
            />

            {/* TOOLBAR */}
            <div className="flex items-center justify-between gap-2 pt-1">

              {/* LEFT ACTIONS */}
              <div className="flex min-w-0 items-center gap-1.5">

                {/* IMAGE UPLOAD */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  title="Upload image"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.07] hover:text-violet-400 disabled:opacity-40"
                >
                  <ImagePlus size={17} />
                </button>

                {/* SELECT AGENT */}
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(true)}
                  disabled={loading}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 text-xs font-medium text-slate-400 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300 disabled:opacity-40"
                >
                  <Bot size={15} />
                  <span className="hidden sm:inline">
                    {selectedAgent ? selectedAgent.name : "Select Agent"}
                  </span>
                  <span className="sm:hidden">Agent</span>
                </button>

                <div className="hidden items-center gap-1.5 pl-1 text-[10px] text-slate-500 sm:flex">
                  <Sparkles size={12} className="text-violet-400" />
                  Powered by AgentFlow AI
                </div>
              </div>

              {/* SEND BUTTON */}
              <Button
                type="submit"
                disabled={!message.trim() || loading}
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-md shadow-violet-500/20 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </Button>
            </div>
          </div>

          <p className="mt-1.5 text-center text-[10px] text-slate-600">
            AI can make mistakes. Verify important information.
          </p>
        </form>
      </div>

      {/* SELECT AGENT MODAL */}
      {isAgentModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsAgentModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0D1222] shadow-2xl shadow-black/50">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Bot size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-white">
                      Select an Agent
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose an AI agent for your workflow
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAgentModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="max-h-[55vh] overflow-y-auto p-5">

              {agentsLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
                  <Loader2 size={17} className="animate-spin" />
                  Loading your agents...
                </div>
              ) : activeAgents.length > 0 ? (
                <div className="space-y-2">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Your Active Agents
                    </p>
                    <span className="text-xs text-slate-500">
                      {activeAgents.length} available
                    </span>
                  </div>

                  {activeAgents.map((agent) => {
                    const isSelected = selectedAgent?._id === agent._id;

                    return (
                      <button
                        key={agent._id}
                        type="button"
                        onClick={() => handleSelectAgent(agent)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? "border-violet-500/40 bg-violet-500/10"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/10 text-violet-400">
                          <Bot size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium text-white">
                            {agent.name}
                          </h3>

                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {agent.instructions || "No instructions provided."}
                          </p>
                        </div>

                        {isSelected ? (
                          <Check size={18} className="shrink-0 text-violet-400" />
                        ) : (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-7 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <Bot size={27} />
                  </div>

                  <h3 className="font-semibold text-white">
                    No active agents yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    Create your first AI agent to give your workspace
                    specialized capabilities.
                  </p>

                  <Button
                    onClick={() => {
                      setIsAgentModalOpen(false);
                      navigate("/agents/create");
                    }}
                    className="mt-5 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90"
                  >
                    <Plus size={16} />
                    Create Your First Agent
                  </Button>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] bg-white/[0.02] px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setIsAgentModalOpen(false);
                  navigate("/agents");
                }}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
              >
                <Settings2 size={15} />
                Manage Agents
              </button>

              <button
                type="button"
                onClick={() => setIsAgentModalOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;
