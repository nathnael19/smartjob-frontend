import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Mail, Lock, Chrome } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthActions } from "../../hooks/useAuthActions";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import api from "../../api/axios";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: loginAction, signInWithGoogle } = useAuthActions();
  const { user, loading: authLoading, login: manualLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (user) {
      navigate(from || (user.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker"), { replace: true });
    }
  }, [user, navigate, from]);

  // Check if we just signed in with Google
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !user && !authLoading) {
        try {
          // Fetch profile from our backend
          const { data: profile } = await api.get("/api/v1/profile/me", {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          
          if (profile) {
            // Profile exists, sync into AuthContext
            manualLogin(session.access_token, profile);
          }
        } catch (error: any) {
          if (error.response?.status === 404 || error.response?.status === 403) {
            // No profile found, redirect to complete profile
            navigate("/complete-profile");
          }
        }
      }
    };
    checkSession();
  }, [user, navigate, authLoading, manualLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAction.mutate({ email, password });
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to track your applications and find new opportunities."
      quote={{
        text: "I found my current role at a tech unicorn within 2 weeks of joining Smart Job. The process was seamless!",
        author: "Sarah Jenkins",
        role: "Product Designer @ TechFlow"
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Button variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
            <Chrome className="mr-2 h-4 w-4" /> Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or login with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-4 w-4" />}
          />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Link to="/forgot-password" title="Forgot Password" className="text-xs font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Input
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock className="h-4 w-4" />}
            />
          </div>

          <Button className="w-full" size="lg" isLoading={loginAction.isPending}>
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-xs text-slate-400 leading-relaxed px-4">
          By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  );
};

// Simple Linkedin component for the button icon
