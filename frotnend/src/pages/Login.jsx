import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/features/auth/authThunks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Workflow, Sparkles, Bot, Zap } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleGoogleLogin = async () => {
    try {
      await dispatch(loginUser()).unwrap();
      toast.success("Welcome to AgentFlow!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Google login failed");
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#080B16] flex items-center justify-center p-3 sm:p-5 md:p-6">
      <div className="w-full max-w-5xl h-full max-h-[720px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">

        {/* BRANDING */}
        <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#111B3D] via-[#151A3C] to-[#27114B] p-8 xl:p-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-500">
              <Workflow className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Agent<span className="text-blue-400">Flow</span>
            </span>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              The future of AI automation
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
              Build smarter.
              <br />
              Automate faster.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Achieve more.
              </span>
            </h1>

            <p className="mt-4 text-sm xl:text-base leading-6 text-slate-300">
              Create intelligent AI agents, connect your favorite tools,
              and automate complex workflows — all from one platform.
            </p>

            <div className="mt-6 xl:mt-8 space-y-4">
              <Feature
                icon={<Bot className="h-5 w-5 text-blue-400" />}
                title="Custom AI Agents"
                description="Build your own intelligent assistants."
              />
              <Feature
                icon={<Workflow className="h-5 w-5 text-violet-400" />}
                title="Smart Workflows"
                description="Automate repetitive tasks effortlessly."
              />
              <Feature
                icon={<Zap className="h-5 w-5 text-yellow-400" />}
                title="MCP Integrations"
                description="Connect AI with powerful external tools."
              />
            </div>
          </div>

        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex flex-col items-center justify-center bg-[#0D1222] px-5 py-8 sm:px-10 sm:py-10 overflow-hidden">
          <div className="w-full max-w-md flex flex-col justify-between h-full">

            <div className="flex flex-col justify-center flex-1">
              <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
                <Workflow className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  Agent<span className="text-blue-400">Flow</span>
                </span>
              </div>

              <div className="mb-6 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                  Welcome Back
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Sign in to AgentFlow
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Your AI automation workspace is waiting for you.
                  Sign in with Google to continue.
                </p>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="h-12 w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </Button>

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} AgentFlow. All rights reserved.
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                Build Agents. Connect Tools. Automate Workflows.
              </p>
              <p className="mt-2 text-[11px] text-slate-400">
                Made with <span className="text-red-400">♥</span> by{" "}
                <span className="font-semibold text-blue-400">Yeasin Riyad</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable feature item
const Feature = ({ icon, title, description }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  </div>
);

// Google icon
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="mr-3 h-5 w-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.91 46.98 31.71 46.98 24.55z"/>
    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default Login;