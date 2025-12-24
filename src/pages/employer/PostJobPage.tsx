import { MapPin, FileText, DollarSign, List, Lightbulb, Info, X, Lock } from "lucide-react";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { useState } from "react";

import { useCreateJob, useMyProfile } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  EMPLOYMENT_TYPES, 
  EXPERIENCE_LEVELS, 
  JOB_CATEGORIES, 
  LOCATION_TYPES, 
  JOB_PERKS 
} from "../../lib/constants";

export const PostJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    employment_type: "Full-time",
    experience_level: "Mid-Senior",
    location_type: "On-site",
    location: "",
    description: "",
    salary_min: 0,
    salary_max: 0,
    deadline: "",
    category: "",
  });

  const createJob = useCreateJob();

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(skill => skill !== s));

  const { data: profile } = useMyProfile();

  // Determine verification status
  // We check profile first (fresh data), then nested profile (if needed), then fallback to user context
  const isVerified = profile?.is_verified ?? profile?.profile?.is_verified ?? user?.is_verified;

  const handlePublish = () => {
    if (!isVerified) {
      toast.error("You must verify your company before posting jobs.");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    // Transform data to match backend schema
    const jobPayload = {
      title: formData.title,
      desc: formData.description,
      location: formData.location,
      location_type: formData.location_type,
      is_remote: formData.location_type === "Remote",
      job_type: formData.employment_type,
      experience_level: formData.experience_level,
      category: formData.category,
      salary_min: formData.salary_min || null,
      salary_max: formData.salary_max || null,
      currency: "USD",
      requirements: skills,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      status: "open",
    };


    createJob.mutate(jobPayload, {
      onSuccess: () => {
        toast.success("Job published successfully!");
        navigate("/dashboard/employer/jobs");
      },
      onError: (error: any) => {
        console.error("[PostJobPage] Error creating job:", error);
        // Error is already handled in useCreateJob hook
      }
    });
  };

  const handleSaveDraft = () => {
    // Basic validation for draft (maybe less strict, but let's keep it similar for now or minimal)
    if (!formData.title.trim()) {
      toast.error("Draft must have at least a title");
      return;
    }

    const jobPayload = {
      title: formData.title,
      desc: formData.description,
      location: formData.location,
      location_type: formData.location_type,
      is_remote: formData.location_type === "Remote",
      job_type: formData.employment_type,
      experience_level: formData.experience_level,
      category: formData.category,
      salary_min: formData.salary_min || null,
      salary_max: formData.salary_max || null,
      currency: "USD",
      requirements: skills,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      status: "draft", // STATUS IS DRAFT
    };

    createJob.mutate(jobPayload, {
      onSuccess: () => {
        toast.success("Job saved as draft!");
        navigate("/dashboard/employer/jobs");
      },
       onError: (error: any) => {
        console.error("[PostJobPage] Error saving draft:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <div className="mx-auto">
          <header className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Post a New Job</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
            <p className="text-slate-500">Fill in the details below to find your next great hire.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                    <List className="h-5 w-5 text-primary" /> Basic Information
                  </div>
                  
                  <Input 
                    label="Job Title *" 
                    placeholder="e.g. Senior Product Designer" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Employment Type *</label>
                      <select 
                        value={formData.employment_type}
                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="">Select type</option>
                        {EMPLOYMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Experience Level *</label>
                      <select 
                        value={formData.experience_level}
                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="">Select level</option>
                        {EXPERIENCE_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Category *</label>
                      <select 
                        value={formData.category} // Assuming category is added to state
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="">Select category</option>
                        {JOB_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700">Location Type *</label>
                      <div className="flex items-center gap-6">
                        {LOCATION_TYPES.map(type => (
                          <label key={type} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input 
                              type="radio" 
                              name="locType" 
                              value={type}
                              checked={formData.location_type === type}
                              onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                              className="h-4 w-4 border-slate-300 text-primary focus:ring-primary" 
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Office Location" 
                      icon={<MapPin className="h-4 w-4" />} 
                      placeholder="e.g. San Francisco, CA" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Application Deadline *</label>
                      <input 
                        type="datetime-local" 
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.deadline}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description & Requirements */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                    <FileText className="h-5 w-5 text-primary" /> Description & Requirements
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Job Description *</label>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                       <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
                          {["B", "I", "U", "L"].map(btn => (
                            <button key={btn} className="h-8 w-8 rounded hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600">{btn}</button>
                          ))}
                       </div>
                       <textarea 
                         rows={8} 
                         placeholder="Describe the role responsibilities and what you are looking for..."
                         className="w-full p-4 text-sm outline-none resize-none"
                         value={formData.description}
                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Key Skills (Press enter to add)</label>
                    <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-slate-200 min-h-[44px]">
                       {skills.map(skill => (
                         <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                            {skill} <button onClick={() => removeSkill(skill)}><X className="h-3 w-3 hover:text-red-500" /></button>
                         </span>
                       ))}
                       <input 
                         type="text" 
                         value={newSkill}
                         onChange={(e) => setNewSkill(e.target.value)}
                         onKeyDown={handleAddSkill}
                         placeholder="Add a skill..." 
                         className="flex-1 min-w-[120px] outline-none text-sm px-2"
                       />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary & Benefits */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                    <DollarSign className="h-5 w-5 text-primary" /> Salary & Benefits
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Salary Range (Min)" placeholder="0" icon={<span>$</span>} />
                    <Input label="Salary Range (Max)" placeholder="0" icon={<span>$</span>} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">Currency & Period</label>
                       <div className="flex gap-2">
                          <select className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                             <option>USD ($)</option>
                          </select>
                          <select className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                             <option>Per Year</option>
                             <option>Per Month</option>
                          </select>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-700">Perks & Benefits</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {JOB_PERKS.map(perk => (
                        <label key={perk} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30 cursor-pointer hover:bg-slate-100 transition-colors">
                           <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                           <span className="text-sm text-slate-700">{perk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24 overflow-hidden">
                {!isVerified && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                        <div className="h-14 w-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-7 w-7" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Publishing Locked</h4>
                        <p className="text-xs text-slate-500 mb-6">Verify your company identity to start posting jobs.</p>
                        <Link to="/dashboard/employer/company-settings" className="w-full">
                            <Button className="w-full font-bold">Verify Now</Button>
                        </Link>
                    </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-xl text-slate-900">Publishing</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 font-bold" 
                      size="lg"
                      onClick={handlePublish}
                      isLoading={createJob.isPending}
                      disabled={!isVerified}
                    >
                      Publish Job Now
                    </Button>
                    <Button 
                       variant="outline" 
                       className="w-full font-bold" 
                       size="lg" 
                       disabled={!isVerified}
                       onClick={handleSaveDraft}
                       isLoading={createJob.isPending}
                    >
                       Save as Draft
                    </Button>
                    <button className="w-full text-sm font-bold text-slate-400 py-2 hover:text-slate-600">Cancel</button>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl flex gap-3 items-start border border-slate-100">
                    <Info className="h-5 w-5 text-slate-400 shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your job post will be reviewed before going live. This typically takes 2-4 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                 <div className="flex items-center gap-2 text-blue-900 font-bold mb-4">
                    <Lightbulb className="h-5 w-5 text-blue-600" /> Pro Tips
                 </div>
                 <ul className="space-y-4">
                    {[
                      "Be specific about the role's responsibilities to attract relevant candidates.",
                      "Including a salary range increases applications by up to 30%.",
                      "Use bullet points for readability in the description section."
                    ].map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs text-blue-800/80 leading-relaxed">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
