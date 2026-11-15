
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, initialized } = useSelector(
    (state) => state.auth
  );

  // Wait until backend authentication check completes
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B16]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <p className="mt-4 text-sm text-slate-400">
            Loading AgentFlow...
          </p>
        </div>
      </div>
    );
  }

  // Only authenticated users can access protected routes
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
