import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  role: "job_seeker" | "recruiter";
  full_name?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();

    // Listen for Supabase auth changes (Google Sign-In)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem("token", session.access_token);
        // User data will be fully synced after profile check/completion in UI
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
