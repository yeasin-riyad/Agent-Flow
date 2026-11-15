import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Workflow,
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  CreditCard,
  LogOut,
  ChevronDown,
  Bot,
  Plus,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logoutUser } from "@/features/auth/authThunks";
import { toast } from "sonner";

const Home = () => {
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
    } catch (error) {
      toast.error(error || "Logout failed");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#080B16] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080B16]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* LOGO */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
              <Workflow size={22} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Agent<span className="text-violet-400">Flow</span>
            </span>
          </Link>

          {/* DESKTOP USER DROPDOWN */}
          <div className="hidden items-center md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11 gap-2 border-white/10 bg-white/[0.04] px-3 text-white hover:bg-white/10 hover:text-white"
                  />
                }
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold">
                  {getInitials()}
                </div>

                <span className="max-w-32 truncate text-sm">
                  {user?.name || "My Account"}
                </span>

                <ChevronDown size={15} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 border-white/10 bg-[#111729] text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/agents")}>
                    <Bot className="mr-2 h-4 w-4" />
                    My Agents
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/agents/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Agent
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/integrations")}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    Integration
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                  />
                }
              >
                <span className="text-xs font-bold">{getInitials()}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-[#111729] text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-slate-400">
                    {user?.name || "My Account"}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/agents")}>
                    <Bot className="mr-2 h-4 w-4" />
                    My Agents
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/agents/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Agent
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/integrations")}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    Integration
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="h-10 w-10 text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.08] bg-[#0D1222] px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => goTo("/")}
                className="rounded-lg px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5"
              >
                Home
              </button>

              <button
                onClick={() => goTo("/agents")}
                className="rounded-lg px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5"
              >
                My Agents
              </button>

              <button
                onClick={() => goTo("/integrations")}
                className="rounded-lg px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/5"
              >
                Integrations
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* HOME PAGE CONTENT */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold">
          Welcome back,{" "}
          <span className="text-violet-400">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your AI agents and automations from one place.
        </p>
      </main>
    </div>
  );
};

export default Home;
