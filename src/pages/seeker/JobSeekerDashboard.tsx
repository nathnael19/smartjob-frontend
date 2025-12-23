import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Send, Calendar, Bookmark, Eye, ArrowUpRight, Clock } from "lucide-react";
import { useMyApplications, useMyProfile, useSavedJobs } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const { data: apps, isLoading: isAppsLoading } = useMyApplications();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: savedJobs } = useSavedJobs();

  const stats = [
    { label: "Applications Sent", value: apps?.length.toString() || "0", change: "Total", icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Interviews", value: apps?.filter((a: any) => a.status === 'interview').length.toString() || "0", change: "Scheduled", icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Saved Jobs", value: savedJobs?.length.toString() || "0", change: "Current", icon: Bookmark, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Profile Views", value: "0", change: "N/A", icon: Eye, color: "text-green-600", bg: "bg-green-100" },
  ];

  if (isProfileLoading || isAppsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || "User";
  const myApplications = apps || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        {/* Welcome Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back, {displayName}</h1>
             <p className="text-slate-500 mt-2 text-lg">Here's what's happening with your job search today.</p>
           </div>
           
           <div className="flex gap-3">
             <Link to="/dashboard/seeker/jobs">
                <Button className="font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
                  Find Jobs <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {stats.map((stat, i) => (
            <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden relative">
              <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                <stat.icon className="h-16 w-16" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 p-1 uppercase tracking-wider">{stat.change && stat.change !== "N/A" ? stat.change : "Total"}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Applications Section - Main Content */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" /> Recent Applications
                </h2>
                <Link to="/dashboard/seeker/applications" className="text-sm font-bold text-primary hover:underline">
                  View All
                </Link>
             </div>

             <div className="space-y-4">
                {myApplications.length > 0 ? (
                  myApplications.slice(0, 5).map((app: any, i: number) => (
                    <Card key={i} className="group hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer border-slate-200/60">
                       <CardContent className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xl text-white shrink-0 shadow-sm bg-gradient-to-br from-slate-700 to-slate-900`}>
                                   {(app.job?.title || app.job_title || "J")[0]}
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">
                                        {app.job?.title || app.job_title || "Unknown Job"}
                                      </h3>
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                         app.status === "reviewed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                         app.status === "interview" ? "bg-green-50 text-green-700 border-green-200" :
                                         app.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-50 text-slate-600 border-slate-200"
                                      }`}>
                                         {app.status}
                                      </span>
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                     {app.job?.company_name || app.company_name || 'Company'}
                                     <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                     <span className="flex items-center gap-1 text-slate-400 text-xs">
                                      <Clock className="h-3 w-3" /> {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                                     </span>
                                   </p>
                                </div>
                             </div>
                             
                             <Button variant="outline" size="sm" className="shrink-0 font-bold border-slate-200 hover:border-primary hover:text-primary transition-colors">
                               View Details
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                     <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Send className="h-8 w-8" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900">No applications yet</h3>
                     <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">Start your journey by applying to jobs that match your skills.</p>
                     <Link to="/dashboard/seeker/jobs">
                        <Button className="mt-6 font-bold" variant="outline">Browse Jobs</Button>
                     </Link>
                  </div>
                )}
             </div>
          </div>
          
          {/* Right Sidebar - Profile & Saved Jobs Preview */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="border-slate-200/60 overflow-hidden">
               <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5"></div>
               <CardContent className="px-6 pb-6 pt-0 relative">
                  <div className="flex justify-between items-end mb-4 -mt-10">
                     <div className="h-20 w-20 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                        {profile?.avatar_url || profile?.profile_picture_url ? (
                           <img src={profile?.avatar_url || profile?.profile_picture_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                           <span className="text-3xl font-bold text-slate-300">{displayName[0]}</span>
                        )}
                     </div>
                     <Link to="/dashboard/seeker/settings">
                        <Button variant="outline" size="sm" className="font-bold text-xs h-8">Edit Profile</Button> 
                     </Link>
                  </div>
                  
                  <div>
                     <h3 className="text-lg font-bold text-slate-900">{displayName}</h3>
                     <p className="text-slate-500 text-sm font-medium">{profile?.headline || "Add your headline..."}</p>
                     
                     <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500 font-medium">Profile Completion</span>
                           <span className="font-bold text-primary">{
                             Math.round(
                                 ((profile?.full_name ? 1 : 0) + 
                                 (profile?.headline ? 1 : 0) + 
                                 (profile?.resume_url ? 1 : 0) + 
                                 (profile?.skills?.length ? 1 : 0)) / 4 * 100
                             )
                         }%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${
                             Math.round(
                                 ((profile?.full_name ? 1 : 0) + 
                                 (profile?.headline ? 1 : 0) + 
                                 (profile?.resume_url ? 1 : 0) + 
                                 (profile?.skills?.length ? 1 : 0)) / 4 * 100
                             )
                         }%` }} />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Saved Jobs Preview */}
            <Card className="border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     <Bookmark className="h-4 w-4 text-orange-500" /> Saved Jobs
                   </h3>
                   <Link to="/dashboard/seeker/saved" className="text-xs font-bold text-primary hover:underline">View All</Link>
                </div>
                
                <div className="space-y-3">
                   {savedJobs?.slice(0, 3).map((job: any, i: number) => (
                      <Link key={i} to={`/dashboard/seeker/jobs/${job.id}`} className="block group">
                         <div className="flex gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 text-sm">
                               {(job.company_name || 'C')[0]}
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{job.title}</p>
                               <p className="text-xs text-slate-500 truncate">{job.company_name}</p>
                            </div>
                         </div>
                      </Link>
                   ))}
                   {(!savedJobs || savedJobs.length === 0) && (
                      <p className="text-sm text-slate-400 italic text-center py-4">No saved jobs yet.</p>
                   )}
                </div>
              </CardContent>    
            </Card>

            <div className="rounded-2xl bg-primary p-6 text-white relative overflow-hidden text-center">
                <div className="relative z-10">
                   <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                     <ArrowUpRight className="h-6 w-6" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">Boost your profile</h3>
                   <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                     Get 3x more views from recruiters with Premium.
                   </p>
                   <Button className="w-full bg-white text-primary hover:bg-slate-50 border-none font-bold">Upgrade Now</Button>
                </div>
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-white/20 blur-2xl" />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};


