import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Briefcase, Users, MessageSquare, Eye, ArrowUpRight } from "lucide-react";
import { VerifiedBadge } from "../../components/ui/VerifiedBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Label } from 'recharts';
import { Link } from "react-router-dom";
import { useMyJobs, useMyProfile } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

export const EmployerDashboard = () => {
  const { user } = useAuth();
  const { data: myJobs, isLoading: isJobsLoading } = useMyJobs();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();

  const totalInterviews = myJobs?.reduce((acc: number, j: any) => acc + (j.status_breakdown?.interview || 0), 0) || 0;

  const stats = [
    { label: "Active Jobs", value: myJobs?.filter((j: any) => j.status === 'open' || j.status === 'Active').length.toString() || "0", change: "Current", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Applicants", value: myJobs?.reduce((acc: number, j: any) => acc + (j.applicants_count || 0), 0).toString() || "0", change: "Across all", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Interviews", value: totalInterviews.toString(), change: "Scheduled", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Profile Views", value: "0", change: "N/A", icon: Eye, color: "text-green-600", bg: "bg-green-100" },
  ];

  if (isProfileLoading || isJobsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const companyName = profile?.company_name || user?.company || "Company";
  const recentJobs = myJobs?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <header className="mb-10 flex flex-col md:flex-row md:items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="h-24 w-24 rounded-3xl bg-slate-900 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden border-4 border-white">
              {(profile?.avatar_url || profile?.profile_picture_url) ? (
                <img src={profile?.avatar_url || profile?.profile_picture_url} alt={companyName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white italic">{companyName[0]}</span>
              )}
           </div>
           <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
                </h1>
                {user?.is_verified && <VerifiedBadge className="scale-125 ml-2" />}
              </div>
              <p className="text-slate-500 mt-1 text-lg">Here's what's happening with your job postings today.</p>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes("+") ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <Card>
              <CardContent className="p-6">
                 <h3 className="font-bold text-slate-900 mb-6">Applicants per Job</h3>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={myJobs?.slice(0, 5).map((j: any) => ({ name: j.title.substring(0, 15) + (j.title.length>15?"...":""), applicants: j.applicants_count || 0 })) || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                          />
                          <Bar dataKey="applicants" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           <Card>
              <CardContent className="p-6">
                 <h3 className="font-bold text-slate-900 mb-6">Job Status Distribution</h3>
                 <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={[
                                { name: 'Active', value: myJobs?.filter((j: any) => j.status === 'open' || j.status === 'Active').length || 0, fill: '#22c55e' },
                                { name: 'Closed', value: myJobs?.filter((j: any) => j.status === 'closed' || j.status === 'Closed').length || 0, fill: '#ef4444' },
                                { name: 'Draft', value: myJobs?.filter((j: any) => j.status === 'draft' || j.status === 'Draft').length || 0, fill: '#94a3b8' },
                             ].filter(d => d.value > 0)}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                          >
                            <Label value={myJobs?.length || 0} position="center" className="font-bold text-2xl fill-slate-900" />
                          </Pie>
                          <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Recent Job Postings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Job Postings</h2>
              <Link to="/dashboard/employer/jobs" className="text-sm font-semibold text-primary hover:underline flex items-center">
                View All Jobs <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Applicants</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Posted Date</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentJobs.map((job: any) => (
                      <tr key={job.id || job.title} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.location}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            job.status === "Active" ? "bg-green-100 text-green-700" :
                            job.status === "Draft" ? "bg-slate-100 text-slate-600" : "bg-red-100 text-red-700"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              job.status === "Active" ? "bg-green-500" :
                              job.status === "Draft" ? "bg-slate-400" : "bg-red-500"
                            }`} />
                            {job.status}
                          </span>
                        </td>
                         <td className="px-6 py-4 text-sm text-slate-600">
                           {job.applicants_count > 0 ? (
                             <div className="flex -space-x-2">
                               {[1, 2, 3].map(i => (
                                 <div key={i} className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">U</div>
                               ))}
                               {job.applicants_count > 3 && (
                                 <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                   +{job.applicants_count - 3}
                                 </div>
                               )}
                             </div>
                           ) : (
                             "No applicants"
                           )}
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-500">{new Date(job.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/dashboard/employer/jobs/${job.id}`} className="text-slate-400 hover:text-slate-600 text-sm font-bold">Manage</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
             <Card>
                <CardContent className="p-6">
                   <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
                   <div className="space-y-6">
                   <div className="space-y-6">
                      <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">No recent activity.</p>
                      </div>
                   </div>
                   </div>
                   <Button variant="outline" className="w-full mt-6" size="sm">View All Activity</Button>
                </CardContent>
             </Card>

             <div className="rounded-2xl bg-slate-900 p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary uppercase">
                      Premium Plan
                   </div>
                   <h3 className="text-xl font-bold mb-2">Boost your visibility</h3>
                   <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Get 3x more applicants by promoting your job posts to the top of search results.
                   </p>
                   <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none font-bold">Upgrade Now</Button>
                </div>
                <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/10 rounded-full blur-3xl" />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};
