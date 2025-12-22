import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Mail, Lock, User, Chrome, Briefcase } from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "../../hooks/useAuthActions";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import api from "../../api/axios";

export const SignupPage = () => {
  const [role, setRole] = useState<"job_seeker" | "recruiter">("job_seeker");
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    // Basic
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    // Employer
    company_name: "",
    industry: "",
    company_size: "",
    website_url: "",
    location: "",
    about_company: "",
    // Seeker
    headline: "",
    bio: "",
    skills: "",
    years_experience: 0,
    phone_number: "",
    linked_in_url: "",
    portfolio_url: "",
  });

  const [files, setFiles] = useState<{
    resume?: File;
    profile_picture?: File;
  }>({});

  const { signupJobSeeker, signupRecruiter, signInWithGoogle } = useAuthActions();
  const { loading: authLoading } = useAuth();

  // Check if we just signed in with Google but don't have a profile yet
  // This handles the case where the user stays on the signup page
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !user && !authLoading) {
        try {
          const { data: profile } = await api.get("/api/v1/profile/me", {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          if (profile) {
            // Already handled by AuthContext listener and LoginPage redirect if they go there
          }
        } catch (error: any) {
          if (error.response?.status === 404 || error.response?.status === 403) {
            navigate("/complete-profile");
          }
        }
      }
    };
    checkSession();
  }, [user, navigate, authLoading]);

  const handleFileChange = (field: "resume" | "profile_picture", file: File | null) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    // Common fields
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (role === "recruiter") {
      data.append("company_name", formData.company_name);
      data.append("industry", formData.industry);
      data.append("company_size", formData.company_size);
      data.append("website_url", formData.website_url);
      data.append("location", formData.location);
      data.append("about_company", formData.about_company);
      if (files.profile_picture) data.append("profile_picture", files.profile_picture);
      
      signupRecruiter.mutate(data);
    } else {
      data.append("full_name", formData.full_name);
      data.append("headline", formData.headline);
      data.append("bio", formData.bio);
      data.append("skills", formData.skills);
      data.append("years_experience", formData.years_experience.toString());
      data.append("phone_number", formData.phone_number);
      data.append("linked_in_url", formData.linked_in_url);
      data.append("portfolio_url", formData.portfolio_url);
      
      if (files.resume) data.append("resume", files.resume);
      if (files.profile_picture) data.append("profile_picture", files.profile_picture);
      
      signupJobSeeker.mutate(data);
    }
  };

  const isLoading = signupJobSeeker.isPending || signupRecruiter.isPending;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of professionals and top employers."
      quote={{
        text: "Smart Job helped us find the perfect candidates in record time. The matching algorithm is simply outstanding.",
        author: "Michael Chen",
        role: "HR Director @ TechFlow"
      }}
    >
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                  role === "job_seeker" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <User className="h-4 w-4" /> Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                  role === "recruiter" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Briefcase className="h-4 w-4" /> Employer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="w-full" onClick={() => signInWithGoogle(role)}>
                <Chrome className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or register with email</span>
              </div>
            </div>

            <div className="space-y-4">
              {role === "job_seeker" ? (
                <Input
                  label="Full Name *"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  icon={<User className="h-4 w-4" />}
                />
              ) : (
                <Input
                  label="Company Name *"
                  placeholder="Enter your company name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  icon={<Briefcase className="h-4 w-4" />}
                />
              )}
              
              <Input
                label="Email Address *"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password *"
                placeholder="Create a password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
              />
              <Input
                label="Confirm Password *"
                placeholder="Confirm your password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
              />
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => {
                  if (!formData.email || !formData.password || (role === "job_seeker" ? !formData.full_name : !formData.company_name)) {
                    toast.error("Please fill in required fields");
                    return;
                  }
                  setStep(2);
                }}
              >
                Next: Profile Details
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Profile Details</h3>
            {role === "job_seeker" ? (
              <>
                <Input
                  label="Headline"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                />
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700">Bio</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <Input
                  label="Skills"
                  placeholder="e.g. React, Node.js, Python"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                />
              </>
            ) : (
              <>
                <Input
                  label="Industry"
                  placeholder="e.g. Technology"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
                <Input
                  label="Company Size"
                  placeholder="e.g. 50-100"
                  value={formData.company_size}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                />
                <Input
                  label="Website URL"
                  placeholder="https://example.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
                <Input
                  label="Location"
                  placeholder="e.g. New York, NY"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next: Contact & Files</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSignup}>
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Contact & Files</h3>
            {role === "job_seeker" ? (
              <>
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linked_in_url}
                  onChange={(e) => setFormData({ ...formData, linked_in_url: e.target.value })}
                />
                <Input
                  label="Portfolio URL"
                  placeholder="https://portfolio.com"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                />
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700">Resume (PDF) *</label>
                  <label className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center hover:bg-slate-50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf"
                      required
                      onChange={(e) => handleFileChange("resume", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">{files.resume?.name || "Click to upload resume"}</p>
                      <p className="text-xs text-slate-500">PDF up to 5MB</p>
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700">About Company</label>
                  <textarea 
                    className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your company..."
                    value={formData.about_company}
                    onChange={(e) => setFormData({ ...formData, about_company: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5 text-left mb-6">
              <label className="text-sm font-medium text-slate-700">Profile Picture</label>
              <label className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center hover:bg-slate-50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange("profile_picture", e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900">{files.profile_picture?.name || "Click to upload picture"}</p>
                  <p className="text-xs text-slate-500">JPG, PNG up to 2MB</p>
                </div>
              </label>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-sm text-slate-500">
                I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>.
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-full font-bold" isLoading={isLoading} type="submit">Complete Signup</Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

