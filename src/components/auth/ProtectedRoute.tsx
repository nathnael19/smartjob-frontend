import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRole?: "job_seeker" | "recruiter";
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Role doesn't match, redirect to their own dashboard or home
    const redirectPath = user.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker";
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and role matches (or no role required), render the children
  return <Outlet />;
};
