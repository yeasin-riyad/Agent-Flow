
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeHeader from "@/components/layout/HomeHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  fetchAgents,
  deleteAgent,
  toggleAgentStatus,
} from "@/features/agents/agentThunks";

import {
  Plus,
  Search,
  Bot,
  Trash2,
  Power,
  PowerOff,
  Sparkles,
  Layers3,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Settings2,
  Calculator,
  Globe,
  Mail,
  Send,
  FileText,
} from "lucide-react";

const toolDetails = {
  calculator: {
    name: "Calculator",
    icon: Calculator,
  },
  "web.search": {
    name: "Web Search",
    icon: Globe,
  },
  "gmail.read": {
    name: "Gmail Read",
    icon: Mail,
  },
  "gmail.send": {
    name: "Gmail Send",
    icon: Send,
  },
};

const formatDate = (date) => {
  if (!date) return "Recently created";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently created";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Agents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { agents = [], loading, error } = useSelector(
    (state) => state.agents
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");

  // FETCH AGENTS
  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  // FILTER AND SEARCH
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch = agent.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && agent.isActive) ||
        (filter === "inactive" && !agent.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [agents, search, filter]);

  const activeCount = agents.filter((agent) => agent.isActive).length;
  const inactiveCount = agents.length - activeCount;

  // TOGGLE AGENT STATUS
  const handleToggleStatus = async (agent) => {
    setActionError("");
    setActionLoadingId(agent._id);

    try {
      await dispatch(toggleAgentStatus(agent._id)).unwrap();
    } catch (err) {
      setActionError(
        typeof err === "string"
          ? err
          : "Failed to update agent status."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE AGENT
  const handleDeleteAgent = async (agent) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${agent.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionError("");
    setActionLoadingId(agent._id);

    try {
      await dispatch(deleteAgent(agent._id)).unwrap();
    } catch (err) {
      setActionError(
        typeof err === "string"
          ? err
          : "Failed to delete agent."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-dvh bg-[#080B16] text-white">
      {/* SHARED SIDEBAR / MOBILE HEADER */}
      <HomeHeader />

      {/* MAIN CONTENT */}
      <main className="min-h-dvh lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

          {/* PAGE INTRO */}
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-400">
                <Sparkles size={15} />
                <span>YOUR WORKSPACE</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Agents
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your AI agents, configure their capabilities, and
                automate your workflow from one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Layers3 size={17} />
                <span>{agents.length} total agents</span>
              </div>

              <Button
                onClick={() => navigate("/agents/create")}
                className="h-10 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 px-4 font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500"
              >
                <Plus size={17} />
                Create Agent
              </Button>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* TOTAL */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Agents</p>
                  <h2 className="mt-2 text-3xl font-bold tabular-nums">
                    {agents.length}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Bot size={23} />
                </div>
              </div>
            </div>

            {/* ACTIVE */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Agents</p>
                  <h2 className="mt-2 text-3xl font-bold tabular-nums">
                    {activeCount}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={23} />
                </div>
              </div>
            </div>

            {/* INACTIVE */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Inactive Agents</p>
                  <h2 className="mt-2 text-3xl font-bold tabular-nums">
                    {inactiveCount}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <PowerOff size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your agents..."
                className="h-11 border-white/10 bg-[#0D1222] pl-10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Agents" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Inactive" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    filter === item.id
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                      : "border-white/10 bg-[#0D1222] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION ERROR */}
          {actionError && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-400">
              <AlertCircle size={17} />
              {actionError}
            </div>
          )}

          {/* FETCH ERROR */}
          {error && !loading && agents.length === 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-8 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-400" size={28} />

              <p className="font-medium text-white">
                Couldn't load your agents
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {error}
              </p>

              <Button
                onClick={() => dispatch(fetchAgents())}
                className="mt-5 gap-2 bg-violet-600 hover:bg-violet-500"
              >
                <RefreshCw size={15} />
                Try Again
              </Button>
            </div>
          )}

          {/* LOADING */}
          {loading && agents.length === 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-white/[0.08] bg-[#0D1222]"
                />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && agents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D1222]/60 px-5 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <Bot size={30} className="text-violet-400" />
              </div>

              <h2 className="text-xl font-semibold">
                No agents yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Create your first AI agent and start automating your
                everyday tasks.
              </p>

              <Button
                onClick={() => navigate("/agents/create")}
                className="mt-6 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90"
              >
                <Plus size={17} />
                Create Your First Agent
              </Button>
            </div>
          )}

          {/* NO SEARCH RESULTS */}
          {!loading && agents.length > 0 && filteredAgents.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D1222] px-5 py-14 text-center">
              <Search size={28} className="mx-auto mb-4 text-slate-500" />

              <h2 className="font-semibold text-white">
                No agents found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Try another search or change your filter.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 text-sm font-medium text-violet-400 hover:text-violet-300"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* AGENT CARDS */}
          {filteredAgents.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => {
                const isBusy = actionLoadingId === agent._id;

                return (
                  <div
                    key={agent._id}
                    className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#0D1222] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/[0.05]"
                  >
                    {/* CARD HEADER */}
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-blue-500/10 text-violet-400">
                        <Bot size={24} />
                      </div>

                      <div
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                          agent.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            agent.isActive
                              ? "bg-emerald-400"
                              : "bg-slate-500"
                          }`}
                        />
                        {agent.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {/* NAME AND DESCRIPTION */}
                    <div className="mb-5 flex-1">
                      <h3 className="truncate text-lg font-semibold text-white">
                        {agent.name}
                      </h3>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-400">
                        {agent.instructions || "No instructions provided."}
                      </p>
                    </div>

                    {/* TOOLS */}
                    <div className="mb-5">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <Settings2 size={13} />
                        Enabled Tools
                      </div>

                      <div className="flex min-h-7 flex-wrap gap-2">
                        {agent.tools?.length > 0 ? (
                          agent.tools.map((tool) => {
                            const details = toolDetails[tool];
                            const Icon = details?.icon || Settings2;

                            return (
                              <span
                                key={tool}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300"
                              >
                                <Icon size={12} />
                                {details?.name || tool}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-600">
                            No tools selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CREATED DATE */}
                    <div className="mb-5 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-slate-500">
                      <Clock size={13} />
                      Created {formatDate(agent.createdAt)}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleStatus(agent)}
                        variant="outline"
                        className="h-10 flex-1 gap-2 border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
                      >
                        {agent.isActive ? (
                          <PowerOff size={15} />
                        ) : (
                          <Power size={15} />
                        )}

                        {isBusy
                          ? "Processing..."
                          : agent.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => handleDeleteAgent(agent)}
                        className="h-10 w-10 border-white/10 bg-white/[0.03] p-0 text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Delete ${agent.name}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FOOTER */}
          {agents.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredAgents.length} of {agents.length} agents
              </span>

              <span className="flex items-center gap-1.5">
                <FileText size={13} />
                AgentFlow Workspace
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Agents;
