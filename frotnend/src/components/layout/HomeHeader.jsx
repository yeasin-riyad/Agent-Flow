
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Workflow,
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  CreditCard,
  LogOut,
  Bot,
  Plus,
  Settings2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/auth/authThunks";
import { toast } from "sonner";

const HomeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navigation = [
    {
      title: "WORKSPACE",
      items: [
        { name: "Home", path: "/", icon: MessageSquare },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "AGENTS",
      items: [
        { name: "My Agents", path: "/agents", icon: Bot },
        { name: "Create Agent", path: "/agents/create", icon: Plus },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
        { name: "Integrations", path: "/integrations", icon: Settings2 },
        { name: "Profile", path: "/profile", icon: UserRound },
        { name: "Billing", path: "/billing", icon: CreditCard },
      ],
    },
  ];

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
            <Workflow size={22} />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Agent<span className="text-violet-400">Flow</span>
          </span>
        </Link>

        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            className="text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={21} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">

        {navigation.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        isActive
                          ? "border border-violet-400/15 bg-violet-500/10 text-violet-300"
                          : "border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            size={17}
                            className={
                              isActive
                                ? "text-violet-400"
                                : "text-slate-500 group-hover:text-slate-300"
                            }
                          />
                          <span>{item.name}</span>
                        </div>

                        {isActive && (
                          <ChevronRight
                            size={15}
                            className="text-violet-400"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

      </nav>

      {/* Bottom Account Section */}
      <div className="shrink-0 border-t border-white/[0.08] p-3">

        <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">
            {getInitials()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || "My Account"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {user?.email || "AgentFlow User"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={17} />
          Logout
        </button>

        <p className="mt-3 text-center text-[10px] text-slate-600">
          © 2026 AgentFlow. All rights reserved.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.08] bg-[#0C1120] lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Topbar */}
      <header className="sticky top-0 z-40 flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#080B16]/95 px-4 backdrop-blur-xl lg:hidden">

        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600">
            <Workflow size={19} />
          </div>

          <span className="text-lg font-bold text-white">
            Agent<span className="text-violet-400">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-[11px] font-bold">
            {getInitials()}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white hover:bg-white/10"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        >
          <aside
            className="h-full w-[280px] max-w-[85vw] animate-in slide-in-from-left duration-200 border-r border-white/10 bg-[#0C1120]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent mobile />
          </aside>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
