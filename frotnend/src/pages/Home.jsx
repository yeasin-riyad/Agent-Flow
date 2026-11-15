
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
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
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

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
      navigate("/login");
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#080B16] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080B16]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* LOGO */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
              <Workflow size={22} className="text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Agent<span className="text-violet-400">Flow</span>
            </span>
          </Link>

      

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      className="h-11 gap-2 border-white/10 bg-white/[0.04] px-3 text-white hover:bg-white/10 hover:text-white"
                    />
                  }
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">
                    {getInitials()}
                  </div>

                  <span className="max-w-28 truncate text-sm">
                    {user?.name || "My Account"}
                  </span>

                  <ChevronDown size={15} />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60 border-white/10 bg-[#111729] text-white"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-slate-400">
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <UserRound className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("/billing")}
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Log in
                </Button>

                <Button
                  onClick={() => navigate("/login")}
                  className="h-10 bg-violet-600 px-5 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500"
                >
                  Get Started
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-2 md:hidden">

            {isAuthenticated && (
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold">
                    {getInitials()}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 border-white/10 bg-[#111729] text-white"
                >
                  <DropdownMenuLabel className="text-slate-400">
                    {user?.name || "My Account"}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </Button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.08] bg-[#0D1222] px-5 py-5 md:hidden">

            {!isAuthenticated && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  Log in
                </Button>

                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-violet-600 text-white hover:bg-violet-500"
                >
                  Get Started
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* YOUR HOME PAGE CONTENT GOES HERE */}
      <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        {/* Add your landing page sections here */}
      </main>
    </div>
  );
};

export default Home;
