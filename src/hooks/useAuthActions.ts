import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const useAuthActions = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Step 1: Login to get token
      const { data: authData } = await api.post("/api/v1/auth/login", {
        email: credentials.email,
        password: credentials.password
      });
      
      // Step 2: Store token temporarily to make authenticated request
      const token = authData.access_token;
      
      // Step 3: Fetch user profile with the token
      const { data: userData } = await api.get("/api/v1/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      
      return { token, user: userData };
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Welcome back!");
      // Navigation is handled by LoginPage useEffect after user state updates
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    },
  });

  const signupJobSeekerMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/api/v1/auth/signup/job_seeker", formData);
      return data;
    },
    onSuccess: (_, variables) => {
      const email = variables.get("email") as string;
      toast.success("Account created! Please check your inbox for verification.");
      navigate("/check-inbox", { state: { email } });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Signup failed.");
    },
  });

  const signupRecruiterMutation = useMutation({
    mutationFn: async (recruitData: FormData) => {
      const { data } = await api.post("/api/v1/auth/signup/recruiter", recruitData);
      return data;
    },
    onSuccess: (_, variables) => {
      const email = variables.get("email") as string;
      toast.success("Account created! Please check your inbox for verification.");
      navigate("/check-inbox", { state: { email } });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Signup failed.");
    },
  });

  const completeOAuthProfileMutation = useMutation({
    mutationFn: async (profileData: { role: string; full_name?: string; company_name?: string }) => {
      await api.post("/api/v1/auth/oauth/complete-profile", profileData);
      
      // After completion, fetch the full profile to sync state
      const { data: userData } = await api.get("/api/v1/profile/me");
      const token = localStorage.getItem("token") || "";
      
      return { token, user: userData };
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Profile completed! Welcome to Smart Job.");
      navigate(data.user.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to complete profile.");
    },
  });

  const signInWithGoogle = async (role?: "job_seeker" | "recruiter") => {
    try {
      if (role) {
        localStorage.setItem("pending_role", role);
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google Sign-In failed.");
    }
  };

  return {
    login: loginMutation,
    signupJobSeeker: signupJobSeekerMutation,
    signupRecruiter: signupRecruiterMutation,
    completeOAuthProfile: completeOAuthProfileMutation,
    signInWithGoogle,
    logout,
  };
};
