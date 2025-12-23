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
      <DashboardNavbar 
        role="job_seeker" 
        userName={displayName} 
        userAvatar={profile?.avatar_url || profile?.profile_picture_url} 
      />
      
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <header className="mb-8">
           <h1 className="text-3xl font-bold text-slate-900">Welcome back, {displayName}</h1>
           <p className="text-slate-500 mt-1">Here's what's happening with your job search today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 p-1 uppercase">{stat.change.includes("+") ? stat.change : ""}</span>
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                   {!stat.change.includes("+") && <p className="text-[10px] text-slate-400 font-bold max-w-[80px] text-right leading-tight">{stat.change}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Applications Section */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center border-b border-slate-200">
                {["Applied Jobs", "Saved Jobs", "Archived"].map((tab, i) => (
                  <button key={i} className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${i === 0 ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-700"}`}>
                    {tab}
                  </button>
                ))}
             </div>

             <div className="space-y-6">
                {myApplications.length > 0 ? (
                  myApplications.map((app: any, i: number) => (
                    <Card key={i} className="group hover:border-primary transition-colors">
                       <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                             <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm bg-slate-200 text-slate-600`}>
                                   {(app.job?.title || app.job_title || "J")[0]}
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{app.job?.title || app.job_title || "Unknown Job"}</h3>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                         app.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                                         app.status === "interview" ? "bg-green-100 text-green-700" :
                                         app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                                      }`}>
                                         {app.status}
                                      </span>
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium">{app.job?.company_name || app.company_name || 'Company'}</p>
                                   <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Applied {new Date(app.created_at || app.applied_at).toLocaleDateString()}
                                   </p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Link to={`/dashboard/seeker/jobs/${app.job_id}`}>
                                  <Button variant="outline" size="sm" className="font-bold">View Details</Button>
                                </Link>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-500 font-medium">You haven't applied for any jobs yet.</p>
                    <Link to="/dashboard/seeker/jobs"><Button className="mt-4">Search Jobs</Button></Link>
                  </div>
                )}
             </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
             <Card>
                <CardContent className="p-6">
                   <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                         <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                            {displayName[0]}
                         </div>
                      </div>
                      <div className="overflow-hidden">
                         <h4 className="font-bold text-slate-900 truncate">{displayName}</h4>
                         <p className="text-xs text-slate-500 truncate">{profile?.headline || 'Job Seeker'}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs mb-1">
                         <span className="font-bold text-slate-500 uppercase">Profile Completion</span>
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
                      <Link to="/settings">
                        <Button variant="outline" className="w-full mt-4 font-bold" size="sm">Edit Profile</Button>
                      </Link>
                   </div>
                </CardContent>
             </Card>

             <Card>
                <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <button className="text-[10px] font-bold text-primary uppercase hover:underline">View all</button>
                   </div>
                   <div className="space-y-6">
                   <div className="space-y-6">
                      <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">No new notifications.</p>
                      </div>
                   </div>
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


