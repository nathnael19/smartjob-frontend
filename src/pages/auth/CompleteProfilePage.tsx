import { useState, useEffect } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { User, Building2, Briefcase } from "lucide-react";
import { useAuthActions } from "../../hooks/useAuthActions";
import { supabase } from "../../lib/supabase";

export const CompleteProfilePage = () => {
  const [role, setRole] = useState<"job_seeker" | "recruiter">(() => {
    const pending = localStorage.getItem("pending_role");
    return (pending === "recruiter" ? "recruiter" : "job_seeker") as "job_seeker" | "recruiter";
  });
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const { completeOAuthProfile } = useAuthActions();

  // Clear pending role after initialization
  useEffect(() => {
    localStorage.removeItem("pending_role");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Proactively update Supabase metadata so the "auth table" shows the role
    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: role }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Failed to update Supabase metadata:", err);
    }

    completeOAuthProfile.mutate({
      role,
      full_name: role === "job_seeker" ? fullName : undefined,
      company_name: role === "recruiter" ? companyName : undefined,
    });
  };

  return (
    <AuthLayout
      title="Complete Your Profile"
      subtitle="Just one last step to get you started with Smart Job."
      quote={{
        text: "I love how easy it was to bridge my Google profile into a professional recruitment tool.",
        author: "Alex Rivers",
        role: "Recruiter @ Orbit"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Choose your role</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("job_seeker")}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                role === "job_seeker" 
                  ? "border-primary bg-primary/5 text-primary shadow-md" 
                  : "border-slate-100 hover:border-slate-200 text-slate-500"
              }`}
            >
              <Briefcase className="h-6 w-6" />
              <span className="text-sm font-bold">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                role === "recruiter" 
                  ? "border-primary bg-primary/5 text-primary shadow-md" 
                  : "border-slate-100 hover:border-slate-200 text-slate-500"
              }`}
            >
              <Building2 className="h-6 w-6" />
              <span className="text-sm font-bold">Recruiter</span>
            </button>
          </div>
        </div>

        {role === "job_seeker" ? (
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            icon={<User className="h-4 w-4" />}
          />
        ) : (
          <Input
            label="Company Name"
            placeholder="Acme Corp"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            icon={<Building2 className="h-4 w-4" />}
          />
        )}

        <Button 
          className="w-full" 
          size="lg" 
          isLoading={completeOAuthProfile.isPending}
        >
          Finish Setup
        </Button>
      </form>
    </AuthLayout>
  );
};
