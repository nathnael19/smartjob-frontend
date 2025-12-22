import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  
  const dashboardLink = user?.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Smart Job" className="h-10 w-auto" />
          </Link>
          
          <div className="ml-8 hidden items-center gap-6 md:flex">
            <Link to="/jobs" className="text-sm font-medium text-slate-600 hover:text-primary">Find Jobs</Link>
            <Link to="/companies" className="text-sm font-medium text-slate-600 hover:text-primary">Companies</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardLink}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" onClick={logout} variant="outline">Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
