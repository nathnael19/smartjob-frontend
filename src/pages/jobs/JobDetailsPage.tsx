import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { MapPin, Briefcase, Clock, DollarSign, Star, Bookmark, Share2, ShieldCheck, Info, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJobDetails, useApplyToJob, useJobs, useMyApplications, useToggleSaveJob, useSavedJobs } from "../../hooks/useApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: job, isLoading, error } = useJobDetails(id || "");
  const { data: jobs } = useJobs();
  const { data: myApplications } = useMyApplications();
  const { data: savedJobs } = useSavedJobs();
  const applyMutation = useApplyToJob();
  const saveToggleMutation = useToggleSaveJob();
  const [coverLetter, setCoverLetter] = useState("");
  
  const hasApplied = myApplications?.some((app: any) => 
    String(app.job_id || app.job?.id) === String(id)
  );

  const isSaved = savedJobs?.some((sj: any) => String(sj.id) === String(id));

  const handleToggleSave = () => {
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    if (user.role === "recruiter") {
      toast.error("Recruiters cannot save jobs");
      return;
    }
    saveToggleMutation.mutate(id || "");
  };

  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    
    if (user.role === "recruiter") {
      toast.error("Recruiters cannot apply to jobs");
      return;
    }

    applyMutation.mutate({ job_id: id, cover_letter: coverLetter }, {
      onSuccess: () => toast.success("Application sent successfully!"),
      onError: (err: any) => {
        const msg = err.response?.data?.detail || "Application failed. You might have already applied.";
        toast.error(msg);
      }
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error || !job) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Job not found</div>;

  const similarJobs = (jobs || []).filter((j: any) => j.id !== id).slice(0, 3).map((j: any) => ({
    title: j.title,
    company: j.company_name || "Company",
    location: j.location,
    salary: `$${(j.salary_min || 0)/1000}k - ${(j.salary_max || 0)/1000}k`,
    type: j.employment_type,
    logo: (j.company_name || "C")[0],
    color: "bg-primary/10 text-primary",
    id: j.id
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors">
             <ArrowLeft className="h-4 w-4" /> Back to Search
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Left Content */}
             <div className="lg:col-span-2 space-y-10">
                {/* Job Header Card */}
                <Card>
                   <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                         <div className="h-20 w-20 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg p-4">
                            <span className="text-2xl font-black text-white italic">{job.company_name?.[0] || 'J'}</span>
                         </div>
                         <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                               <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
                               <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                               </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                               <span className="text-slate-900 font-bold">{job.company_name || 'Company'}</span>
                               <span>•</span>
                               <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location} ({job.location_type})</span>
                               <span>•</span>
                               <span className="text-green-600 font-bold">Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Salary</p>
                                  <p className="text-sm font-bold text-slate-900">${(job.salary_min || 0)/1000}k - ${(job.salary_max || 0)/1000}k</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Job Type</p>
                                  <p className="text-sm font-bold text-slate-900">{job.employment_type}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock className="h-3 w-3" /> Experience</p>
                                  <p className="text-sm font-bold text-slate-900">{job.experience_level}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Location</p>
                                  <p className="text-sm font-bold text-slate-900">{job.location_type}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* Job Details Card */}
                <Card>
                   <CardContent className="p-10 space-y-10">
                      <section className="space-y-4">
                         <h2 className="text-2xl font-bold text-slate-900">About the Role</h2>
                         <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                         </p>
                      </section>

                      <section className="space-y-6">
                         <h2 className="text-2xl font-bold text-slate-900">Key Responsibilities</h2>
                         <ul className="space-y-4">
                            {[
                              "Lead end-to-end design projects across the entire product lifecycle and multiple product launches.",
                              "Collaborate with product management and engineering to define and implement innovative solutions for the product direction, visuals, and experience.",
                              "Create wireframes, storyboards, user flows, process flows, and site maps to effectively communicate interaction and design ideas.",
                              "Conduct user research and evaluate user feedback to enhance the usability of the product."
                            ].map((item, i) => (
                              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                                 <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                 {item}
                              </li>
                            ))}
                         </ul>
                      </section>

                      <section className="space-y-6">
                         <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
                         <ul className="space-y-4">
                            {[
                              "5+ years of experience in product design, UI/UX, or related fields.",
                              "Strong portfolio showcasing problem-solving skills and high-fidelity design execution.",
                              "Proficiency in Figma, Adobe Creative Suite, and prototyping tools.",
                              "Excellent communication skills and ability to articulate design decisions to stakeholders."
                            ].map((item, i) => (
                              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                                 <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                 </div>
                                 {item}
                              </li>
                            ))}
                         </ul>
                      </section>

                      <section className="space-y-6 pt-8 border-t border-slate-100">
                         <h2 className="text-2xl font-bold text-slate-900">Perks & Benefits</h2>
                         <div className="flex flex-wrap gap-3">
                            {[
                              { label: "Health Insurance", icon: ShieldCheck },
                              { label: "401(k) Matching", icon: Briefcase },
                              { label: "Unlimited PTO", icon: Clock },
                              { label: "Learning Budget", icon: Info }
                            ].map((perk, i) => (
                              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs ring-1 ring-blue-100">
                                 <perk.icon className="h-3.5 w-3.5" /> {perk.label}
                              </span>
                            ))}
                         </div>
                      </section>
                   </CardContent>
                </Card>

                {/* Similar Jobs Section */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-900">Similar Jobs</h2>
                      <button className="text-sm font-bold text-primary hover:underline">View All</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {similarJobs.map((j: any, i: number) => (
                        <Link to={`/jobs/${j.id}`} key={i}>
                          <Card className="group hover:border-primary transition-all cursor-pointer h-full">
                             <CardContent className="p-6 space-y-4">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${j.color}`}>
                                   {j.logo}
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-900 group-hover:text-primary truncate">{j.title}</h4>
                                   <p className="text-xs text-slate-500 font-medium truncate">{j.company} • {j.location}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                   <span className="text-[10px] font-bold text-slate-900">{j.salary}</span>
                                   <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest">{j.type}</span>
                                </div>
                             </CardContent>
                          </Card>
                        </Link>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Sidebar */}
             <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                <Card>
                   <CardContent className="p-8 space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">Interested in this job?</h3>
                      <div className="space-y-3">
                         <textarea 
                           className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none min-h-[100px]"
                           placeholder="Introduce yourself with a cover letter... (optional)"
                           value={coverLetter}
                           onChange={(e) => setCoverLetter(e.target.value)}
                           disabled={hasApplied}
                         />
                          <Button 
                            className="w-full font-black text-lg h-14" 
                            size="lg" 
                            onClick={handleApply} 
                            isLoading={applyMutation.isPending}
                            disabled={hasApplied}
                          >
                            {hasApplied ? "Already Applied" : "Apply Now"}
                          </Button>
                          <Button 
                            variant={isSaved ? "secondary" : "outline"} 
                            className="w-full font-bold h-14" 
                            size="lg"
                            onClick={handleToggleSave}
                            isLoading={saveToggleMutation.isPending}
                          >
                             <Bookmark className={`mr-2 h-5 w-5 ${isSaved ? 'fill-primary text-primary' : ''}`} /> 
                             {isSaved ? "Job Saved" : "Save Job"}
                          </Button>
                      </div>
                      <div className="flex items-center justify-center gap-4 py-2">
                         <button className="text-slate-400 hover:text-primary transition-colors"><Share2 className="h-5 w-5" /></button>
                         <button className="text-slate-400 hover:text-red-500 transition-colors"><Star className="h-5 w-5" /></button>
                      </div>
                      <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">
                         Application deadline: <span className="text-slate-900">{job.created_at ? new Date(new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'}</span>
                      </p>
                   </CardContent>
                </Card>

                <Card>
                   <CardContent className="p-8 space-y-6">
                      <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">About {job.company_name || 'Employer'}</h3>
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center italic text-lg font-black text-white shrink-0">
                             {job.company_name?.[0] || 'C'}
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900">{job.company_name}</h4>
                             <p className="text-xs text-slate-500">{job.industry || 'Technology'}</p>
                          </div>
                       </div>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          {job.company_about || 'No company information available.'}
                       </p>
                      <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
                         View Company Profile <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden mt-4">
                         <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                            <MapPin className="h-8 w-8 text-primary opacity-50" />
                         </div>
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-white/80 backdrop-blur-sm border-t border-white/50">
                             <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="h-2 w-2" /> {job.location}</p>
                          </div>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};
