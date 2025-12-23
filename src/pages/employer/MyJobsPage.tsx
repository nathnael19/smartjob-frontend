
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Edit2, Trash2, Eye, Briefcase, Plus, Search, ArrowUpRight } from "lucide-react";
import { AlertDialog } from "../../components/ui/AlertDialog";
import { useState } from "react";

import { useMyJobs, useMyProfile, useDeleteJob } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const MyJobsPage = () => {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: myJobs, isLoading, error } = useMyJobs();
  const deleteJob = useDeleteJob();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const queryTerm = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryTerm);

  useEffect(() => {
    if (queryTerm && queryTerm !== searchTerm) {
      setSearchTerm(queryTerm);
    }
  }, [queryTerm]);

  const handleDelete = () => {
     if (jobToDelete) {
        deleteJob.mutate(jobToDelete);
        setJobToDelete(null);
     }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Load Jobs</h2>
            <p className="text-slate-600 mb-4">
              {(error as any)?.response?.data?.detail || "Unable to fetch your jobs. Please check your connection and try again."}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [filterStatus, setFilterStatus] = useState("All");

  const companyName = profile?.company_name || user?.company || "Company";
  const jobs = myJobs || [];

  // Calculate counts
  const counts = {
    All: jobs.length,
    Active: jobs.filter((j: any) => j.status === "Active" || j.status === "open").length,
    Draft: jobs.filter((j: any) => j.status === "Draft").length,
    Closed: jobs.filter((j: any) => j.status === "Closed" || j.status === "closed").length,
  };

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === "Active") matchesStatus = job.status === "Active" || job.status === "open";
    else if (filterStatus === "Draft") matchesStatus = job.status === "Draft";
    else if (filterStatus === "Closed") matchesStatus = job.status === "Closed" || job.status === "closed";
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-slate-900 font-medium">My Jobs</span>
              </nav>
              <h1 className="text-3xl font-bold text-slate-900">My Jobs Listing</h1>
              <p className="text-slate-500">Manage your job postings and view applicant stats.</p>
            </div>
            <Link to="/dashboard/employer/post-job">
              <Button className="font-bold">
                <Plus className="mr-2 h-4 w-4" /> Create New Job
              </Button>
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
             <div className="lg:col-span-3 space-y-6">
                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-xl border border-slate-200">
                   <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {[
                        { label: "All Jobs", key: "All", count: counts.All },
                        { label: "Active", key: "Active", count: counts.Active },
                        { label: "Draft", key: "Draft", count: counts.Draft },
                        { label: "Closed", key: "Closed", count: counts.Closed }
                      ].map((tab) => (
                        <button 
                          key={tab.key} 
                          onClick={() => setFilterStatus(tab.key)}
                          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            filterStatus === tab.key 
                              ? "bg-slate-100 text-slate-900" 
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                           {tab.label} ({tab.count})
                        </button>
                      ))}
                   </div>
                   <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                             <input 
                         type="text" 
                         placeholder="Search by title..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="h-10 w-full pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                       />

                   </div>
                </div>

                {/* Jobs Cards */}
                <div className="space-y-6">
                   {filteredJobs.map((job: any, i: number) => (
                     <Card key={i} className="group hover:border-primary transition-colors">
                        <CardContent className="p-6">
                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                              <div className="flex-1 space-y-4">
                                 <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                       job.status === "Active" ? "bg-green-100 text-green-700" :
                                       job.status === "Draft" ? "bg-slate-100 text-slate-600" : "bg-orange-100 text-orange-700"
                                    }`}>
                                       {job.status}
                                    </span>
                                 </div>
                                 <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.location}</span>
                                    <span className="flex items-center gap-1.5"><span className="h-4 w-4 flex items-center justify-center font-bold text-xs">$</span> {job.salary}</span>
                                    <span className="flex items-center gap-1.5"><span className="h-4 w-4 bg-slate-200 rounded-full" /> {job.type}</span>
                                 </div>
                                  <div className="pt-4 flex gap-8 border-t border-slate-100">
                                     <div>
                                        <p className="text-2xl font-bold text-slate-900">{job.applicants_count || 0}</p>
                                        <p className="text-xs text-slate-500 font-medium">APPLICANTS</p>
                                     </div>
                                     <div>
                                        <p className="text-2xl font-bold text-slate-900">0</p>
                                        <p className="text-xs text-slate-500 font-medium">VIEWS</p>
                                     </div>
                                     <div className="flex-1" />
                                     <div className="self-end text-right">
                                        <p className="text-xs text-slate-400 italic">Posted {new Date(job.created_at).toLocaleDateString()}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex md:flex-col gap-2 shrink-0">
                                  <Link to={`/dashboard/employer/jobs/${job.id}`}><Button variant="outline" size="icon" className="h-9 w-9"><Eye className="h-4 w-4" /></Button></Link>
                                  <Link to={`/dashboard/employer/jobs/${job.id}/edit`}><Button variant="outline" size="icon" className="h-9 w-9"><Edit2 className="h-4 w-4" /></Button></Link>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-9 w-9 hover:text-red-600 hover:border-red-200"
                                    onClick={() => setJobToDelete(job.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                               </div>
                           </div>
                        </CardContent>
                     </Card>
                   ))}
                </div>
                
                {/* Pagination */}
                 <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-slate-500">Showing {jobs.length} jobs</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                   </div>
                </div>
             </div>

             {/* Right Column - Overview Stats */}
             <div className="space-y-6">
                <Card>
                   <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900">Overview Stats</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Last 30 Days</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Applicants</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{jobs.reduce((acc: number, j: any) => acc + (j.applicants_count || 0), 0)}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Job Views</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">0</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Open Jobs</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{jobs.filter((j: any) => j.status === 'open' || j.status === 'Active').length}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Closed</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{jobs.filter((j: any) => j.status === 'closed' || j.status === 'Closed').length}</p>
                         </div>
                      </div>
                      <Button variant="outline" className="w-full mt-6 text-xs font-bold" size="sm">
                         <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" /> View Detailed Analytics
                      </Button>
                   </CardContent>
                </Card>

                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white overflow-hidden relative">
                   <div className="relative z-10">
                      <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Boost your hiring</h3>
                      <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                        Get up to 3x more applicants by promoting your active listings.
                      </p>
                      <Button className="w-full bg-white text-blue-600 hover:bg-white/90 border-none font-bold">Promote Jobs</Button>
                   </div>
                   <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
                </div>
             </div>
          </div>
        </div>
      </main>

      <AlertDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete Job"
        variant="danger"
        isLoading={deleteJob.isPending}
      />
    </div>
  );
};
