import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { MapPin, Briefcase, Clock, DollarSign, ShieldCheck, Info, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useJobDetails, useMyProfile } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";

export const EmployerJobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: job, isLoading, error } = useJobDetails(id || "");

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error || !job) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Job not found</div>;

  const companyName = profile?.company_name || user?.company || job?.company_name || "Company";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard/employer/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary mb-8 transition-colors">
             <ArrowLeft className="h-4 w-4" /> Back to My Jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Left Content */}
             <div className="lg:col-span-2 space-y-10">
                {/* Job Header Card */}
                <Card>
                   <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                         <div className="h-20 w-20 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg overflow-hidden border-2 border-white">
                            {(profile?.avatar_url || profile?.profile_picture_url) ? (
                              <img src={profile?.avatar_url || profile?.profile_picture_url} alt={companyName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-2xl font-black text-white italic">{companyName[0]}</span>
                            )}
                         </div>
                         <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                               <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
                               <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                               </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                               <span className="text-slate-900 font-bold">{job.company_name || 'Your Company'}</span>
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
                                  <p className="text-sm font-bold text-slate-900">{job.employment_type || job.job_type}</p>
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
                            {job.desc || job.description}
                         </p>
                      </section>

                      {job.requirements && job.requirements.length > 0 && (
                        <section className="space-y-6">
                           <h2 className="text-2xl font-bold text-slate-900">Requirements / Skills</h2>
                           <div className="flex flex-wrap gap-2">
                              {job.requirements.map((item: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                                   {item}
                                </span>
                              ))}
                           </div>
                        </section>
                      )}

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
             </div>

             {/* Right Sidebar */}
             <div className="space-y-6">
                <Card className="sticky top-24">
                   <CardContent className="p-8 space-y-6">
                      <h3 className="text-xl font-bold text-slate-900">Job Management</h3>
                      <div className="space-y-3">
                          <Link to={`/dashboard/employer/jobs/${job.id}/edit`}>
                             <Button className="w-full font-black text-lg h-14" size="lg">Edit Job</Button>
                          </Link>
                          <p className="text-xs text-center text-slate-400 mt-2">
                             Use the 'Edit' page to update job details.
                          </p>
                      </div>
                      <div className="pt-6 border-t border-slate-100">
                         <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">
                             Status: <span className="text-slate-900">{job.status}</span>
                         </p>
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
