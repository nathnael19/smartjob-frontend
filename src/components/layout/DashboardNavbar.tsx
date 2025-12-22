import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "../../hooks/useAuthActions";

interface DashboardNavbarProps {
  role: "job_seeker" | "recruiter";
  userName: string;
  userAvatar?: string;
  companyName?: string;
}

export const DashboardNavbar = ({ role, userName, userAvatar, companyName }: DashboardNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const targetPath = role === "recruiter" ? "/dashboard/employer/jobs" : "/dashboard/seeker/jobs";
    navigate(`${targetPath}?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const seekerLinks = [
    { label: "Companies", href: "/companies" },
    { label: "Find Jobs", href: "/dashboard/seeker/jobs" },
    { label: "My Applications", href: "/dashboard/seeker/applications" },
    { label: "Saved Jobs", href: "/dashboard/seeker/saved" },
  ];

  const employerLinks = [
    { label: "Companies", href: "/companies" },
    { label: "Dashboard", href: "/dashboard/employer" },
    { label: "My Jobs", href: "/dashboard/employer/jobs" },
    { label: "Candidates", href: "/dashboard/employer/candidates" },
    { label: "Post a Job", href: "/dashboard/employer/post-job" },
  ];

  const links = role === "job_seeker" ? seekerLinks : employerLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-12">
          <Link 
            to={role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker"} 
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="Smart Job" className="h-10 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary font-bold"
                    : "text-slate-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search jobs, companies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-lg bg-slate-100 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </form>

          <button className="relative text-slate-500 hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 pl-2 group outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                <p className="text-xs text-slate-500 mt-1">{role === "recruiter" ? companyName : "Job Seeker"}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200 group-hover:border-primary transition-colors">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                    {userName[0]}
                  </div>
                )}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white shadow-lg p-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-100 mb-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
                      {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-white font-bold text-lg">
                          {userName[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-wider">
                        {role === "recruiter" ? companyName : "Job Seeker"}
                      </p>
                    </div>
                  </div>
                  
                  {role === 'recruiter' && (
                    <Link 
                      to="/dashboard/employer/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                    >
                      <User className="h-4 w-4 text-slate-400 group-hover:text-primary" /> Company Profile
                    </Link>
                  )}
                  
                  <Link 
                    to="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <Settings className="h-4 w-4 text-slate-400 group-hover:text-primary" /> Settings
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
              </div>
            )}
          </div>
          
          </div>
      </div>
    </nav>
  );
};
