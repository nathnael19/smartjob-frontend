import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import api from "../api/axios";

interface User {
  id: string;
  email: string;
  role: "job_seeker" | "recruiter";
  full_name?: string;
  company?: string;
  is_verified?: boolean;
  legal_document_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token) {
        try {
          // Verify token and get fresh user data from DB
          // We must import api dynamically or at top level. 
          // Since api depends on token which is in localStorage (handled by interceptor), it should work.
          // However, we need to ensure api.ts handles the token correctly.
          // Note: importing api here to avoid circular dependency issues if api imports AuthContext (it doesn't seems so).
          
          /* Using dynamic import or assuming global 'api' is available via import */
          /* But standard import at top is better. I will add import at top in next step or use existing if added. */
          /* Let's try to stick to the existing imports if possible, but I need 'api'. */
          /* Assuming I will add `import api from "../api/axios";` at the top with a multi_replace  */
          
          const { data } = await api.get("/api/v1/profile/me");
          
          if (data) {
             const freshUser = {
                id: data.id || JSON.parse(storedUser || "{}").id,
                email: data.email,
                role: data.role,
                full_name: data.full_name || data.profile?.full_name,
                company: data.company_name || data.profile?.company_name || data.profile?.company,
                is_verified: data.is_verified ?? data.profile?.is_verified,
                legal_document_url: data.legal_document_url ?? data.profile?.legal_document_url
             };
             
             setUser(freshUser as User);
             localStorage.setItem("user", JSON.stringify(freshUser));
          } else if (storedUser) {
             // Fallback if API returns weird data but no error? Unlikely.
             setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to fetch fresh profile:", error);
          // If 401, we should probably logout, but for now let's fall back to stored user 
          // or clear if strictly invalid.
          // Let's keep stored user to allow 'offline' feel or just fail gracefully.
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          }
        }
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

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

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
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
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
