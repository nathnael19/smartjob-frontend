import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { MapPin, DollarSign, List, FileText, ArrowLeft, Save, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useJobDetails, useUpdateJob, useMyProfile } from "../../hooks/useApi"; // Ensure useUpdateJob is exported
import { useAuth } from "../../context/AuthContext";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { toast } from "react-hot-toast";

export const EditJobPage = () => {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  
  // Fetch existing job data
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: job, isLoading, error } = useJobDetails(id || "");
  const updateJob = useUpdateJob();

  // Form State
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
    currency: "USD",
    deadline: "",
    status: "open",
  });

  // Populate form when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        employment_type: job.job_type || "Full-time", // Mapping job_type to employment_type
        experience_level: job.experience_level || "Mid-Senior", // Default if missing
        location_type: job.is_remote ? "Remote" : (job.location_type || "On-site"),
        location: job.location || "",
        description: job.desc || job.description || "", // Handle both usages
        salary_min: job.salary_min || 0,
        salary_max: job.salary_max || 0,
        currency: job.currency || "USD",
        deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 16) : "",
        status: job.status || "open",
      });
      setSkills(job.requirements || []);
    }
  }, [job]);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(skill => skill !== s));

  const handleSave = () => {
    if (!id) return;
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    const payload = {
        title: formData.title,
        desc: formData.description,
        location: formData.location,
        is_remote: formData.location_type === "Remote",
        job_type: formData.employment_type,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
        currency: formData.currency,
        requirements: skills,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        status: formData.status,
    };

    updateJob.mutate({ id, data: payload }, {
      onSuccess: () => {
        // toast.success("Job updated!"); - Handled in hook
        navigate("/dashboard/employer/jobs");
      },
      onError: (err: any) => {
        console.error("Update failed", err);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-bold">Job not found or error loading.</p>
        <Button onClick={() => navigate("/dashboard/employer/jobs")}>Back to My Jobs</Button>
      </div>
    );
  }

  const companyName = profile?.company_name || user?.company || job?.company_name || "Company";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar 
        role="recruiter" 
        userName={profile?.full_name || user?.email?.split('@')[0] || "Recruiter"} 
        userAvatar={profile?.avatar_url || profile?.profile_picture_url}
        companyName={companyName} 
      />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back Link */}
          <Link to="/dashboard/employer/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors">
             <ArrowLeft className="h-4 w-4" /> Back to My Jobs
          </Link>

          <header className="mb-8 flex items-center justify-between">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Job: {job.title}</h1>
                <p className="text-slate-500">Update the details of your job posting.</p>
             </div>
             <Button onClick={handleSave} isLoading={updateJob.isPending} className="font-bold">
                <Save className="mr-2 h-4 w-4" /> Save Changes
             </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Left Content - Form Fields */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* Basic Info Card */}
                <Card>
                   <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                        <List className="h-5 w-5 text-primary" /> Basic Information
                      </div>
                      
                      <Input 
                        label="Job Title" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Employment Type</label>
                          <select 
                             className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                             value={formData.employment_type}
                             onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                          >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Experience Level</label>
                          <select 
                             className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                             value={formData.experience_level}
                             onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                           >
                            <option>Entry Level</option>
                            <option>Mid-Senior</option>
                            <option>Director</option>
                            <option>Executive</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-slate-700">Location Type</label>
                          <div className="flex items-center gap-4">
                            {["On-site", "Hybrid", "Remote"].map(type => (
                              <label key={type} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="locType" 
                                  value={type}
                                  checked={formData.location_type === type}
                                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                                  className="h-4 w-4 text-primary focus:ring-primary" 
                                />
                                {type}
                              </label>
                            ))}
                          </div>
                        </div>
                        <Input 
                          label="Location" 
                          icon={<MapPin className="h-4 w-4" />} 
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
                        <label className="text-sm font-medium text-slate-700">Job Description</label>
                        <textarea 
                          rows={12} 
                          className="w-full p-4 rounded-lg border border-slate-200 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/20"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Skills (Press Enter to add)</label>
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-slate-200 min-h-[48px] bg-white">
                           {skills.map(skill => (
                             <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold ring-1 ring-blue-100">
                                {skill} <button onClick={() => removeSkill(skill)}><X className="h-3 w-3 hover:text-red-500" /></button>
                             </span>
                           ))}
                           <input 
                             type="text" 
                             value={newSkill}
                             onChange={(e) => setNewSkill(e.target.value)}
                             onKeyDown={handleAddSkill}
                             placeholder="Add skill..." 
                             className="flex-1 min-w-[100px] outline-none text-sm bg-transparent"
                           />
                        </div>
                      </div>
                   </CardContent>
                </Card>

                {/* Salary */}
                <Card>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                      <DollarSign className="h-5 w-5 text-primary" /> Compensation
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Min Salary (Annual)" 
                        type="number"
                        icon={<span className="text-slate-400 font-bold">$</span>} 
                        value={formData.salary_min}
                        onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                      />
                      <Input 
                        label="Max Salary (Annual)" 
                        type="number"
                        icon={<span className="text-slate-400 font-bold">$</span>}
                        value={formData.salary_max}
                        onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </CardContent>
                </Card>
             </div>

             {/* Right Sidebar - Status & Actions */}
             <div className="space-y-6">
                <Card className="sticky top-24">
                   <CardContent className="p-6 space-y-6">
                      <h3 className="font-bold text-xl text-slate-900">Publishing Status</h3>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="text-sm font-medium text-slate-600">Current Status</span>
                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            job.status === "Active" || job.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                         }`}>
                            {job.status?.toUpperCase() || "UNKNOWN"}
                         </span>
                      </div>

                      <div className="space-y-3 pt-2">
                         <div className="space-y-1.5 mb-4">
                            <label className="text-sm font-medium text-slate-700">Update Status</label>
                            <select 
                               className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                               value={formData.status}
                               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                               <option value="open">Open (Public)</option>
                               <option value="closed">Closed</option>
                               <option value="draft">Draft</option>
                               <option value="Active">Active</option>
                            </select>
                         </div>
                         <Button className="w-full font-bold" onClick={handleSave} isLoading={updateJob.isPending}>
                            Update Job
                         </Button>
                         <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/employer/jobs")}>
                            Cancel
                         </Button>
                      </div>

                      <p className="text-xs text-slate-400 text-center">
                         Last updated: {new Date(job.updated_at || job.created_at).toLocaleDateString()}
                      </p>
                   </CardContent>
                </Card>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};
