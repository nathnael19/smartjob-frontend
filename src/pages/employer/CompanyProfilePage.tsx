import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { MapPin, Globe, Mail, Phone, Briefcase, ExternalLink, Edit2, Twitter, Linkedin, Github, MoreHorizontal } from "lucide-react";

import { useMyProfile, useMyJobs } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: myJobs, isLoading: isJobsLoading } = useMyJobs();

  if (isProfileLoading || isJobsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

   const company = profile?.profile || profile || {};
   const companyName = company.company_name || company.company || user?.company || "Company";
   const activeJobs = myJobs?.filter((j: any) => j.status === 'open' || j.status === 'Active') || [];
 
   const isVerified = company.is_verified ?? user?.is_verified;

   return (
     <div className="min-h-screen bg-slate-50">
       <DashboardNavbar />
       
       <main className="container mx-auto px-4 py-8 lg:px-8">
         <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Card */}
            <Card>
               <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                     <div className="h-32 w-32 rounded-2xl bg-slate-900 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0">
                        {company.profile_picture_url || company.profile_picture ? (
                           <img 
                              src={company.profile_picture_url || company.profile_picture} 
                              alt={companyName} 
                              className="h-full w-full object-cover" 
                           />
                        ) : (
                           <span className="text-4xl font-black text-white italic">{companyName.substring(0, 2).toUpperCase()}</span>
                        )}
                     </div>
                     <div className="flex-1 space-y-4">
                       <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                          <div>
                             <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold text-slate-900">{companyName}</h1>
                                {isVerified && (
                                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                                )}
                             </div>
                             <p className="text-lg text-slate-500 mt-1">{company.industry}</p>
                          </div>
                          <div className="flex gap-3">
                             <Button variant="outline" size="sm">Public View</Button>
                             <Link to="/dashboard/employer/company-settings">
                                <Button size="sm"><Edit2 className="mr-2 h-4 w-4" /> Edit Profile</Button>
                             </Link>
                          </div>
                       </div>
                       
                        <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                           <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {company.location || 'N/A'}</span>
                           <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {company.industry || 'N/A'}</span>
                           <span className="flex items-center gap-2 font-bold text-slate-900"><span className="h-2 w-2 rounded-full bg-green-500" /> {activeJobs.length > 0 ? 'Hiring' : 'Not Hiring'}</span>
                        </div>

                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-6 border-t border-slate-100">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Founded</p>
                              <p className="text-lg font-bold text-slate-900">{company.founded_year || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Company Size</p>
                              <p className="text-lg font-bold text-slate-900">{company.company_size || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Type</p>
                              <p className="text-lg font-bold text-slate-900">Private</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Open Jobs</p>
                              <p className="text-lg font-bold text-slate-900">{activeJobs.length}</p>
                           </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <CardContent className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">About {companyName}</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                           <p className="whitespace-pre-wrap">
                              {company.about_company || 'No company information provided.'}
                           </p>
                        </div>
                       
                       {/* Mission and Benefits sections removed as they were hardcoded placeholders */}
                    </CardContent>
                 </Card>

                  {/* Active Listings Section */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Active Listings <span className="ml-2 text-sm font-normal text-slate-400">{activeJobs.length} Open</span></h2>
                        <Link to="/dashboard/employer/jobs" className="text-sm font-bold text-primary hover:underline">Manage All</Link>
                     </div>
                     <div className="grid sm:grid-cols-2 gap-4">
                        {activeJobs.slice(0, 4).map((job: any, i: number) => (
                          <Link to={`/jobs/${job.id}`} key={i}>
                            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                               <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                     <h4 className="font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                                     <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal className="h-5 w-5" /></button>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">{job.location}</p>
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                     <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase">{job.employment_type}</span>
                                     <span className="text-[10px] text-slate-400 uppercase">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                  </div>
                               </CardContent>
                            </Card>
                          </Link>
                        ))}
                     </div>
                  </div>
              </div>

              {/* Sticky Right Sidebar */}
              <div className="space-y-6">
                 <Card className="sticky top-24">
                    <CardContent className="p-8 space-y-8">
                       <div>
                          <div className="flex items-center justify-between mb-4">
                             <h3 className="font-bold text-slate-900">Contact Information</h3>
                             <button className="text-xs font-bold text-slate-400 uppercase hover:text-primary">Edit</button>
                          </div>
                          <div className="space-y-4">
                             <a href={company.website_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group transition-colors hover:border-primary/20">
                                <Globe className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                                 <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Website</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{company.website_url || 'N/A'}</p>
                                 </div>
                                 <ExternalLink className="h-4 w-4 text-slate-300" />
                              </a>
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                 <Mail className="h-5 w-5 text-slate-400" />
                                 <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                    <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                 <Phone className="h-5 w-5 text-slate-400" />
                                 <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                                    <p className="text-sm font-bold text-slate-700">{company.phone_number || 'N/A'}</p>
                                 </div>
                              </div>
                          </div>
                       </div>

                       <div>
                          <h3 className="font-bold text-slate-900 mb-4">Social Profiles</h3>
                          <div className="flex gap-4">
                             {[Twitter, Linkedin, Github].map((Icon, i) => (
                               <button key={i} className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                                  <Icon className="h-5 w-5" />
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="pt-8 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                             <h3 className="font-bold text-slate-900">Headquarters</h3>
                             <button className="text-xs font-bold text-slate-400 uppercase hover:text-primary">Edit</button>
                          </div>
                          <div className="relative h-48 rounded-2xl bg-slate-200 overflow-hidden mb-4">
                             <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                                <MapPin className="h-10 w-10 text-primary drop-shadow-md" />
                             </div>
                              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-sm border border-white/50">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">{companyName} HQ</p>
                                 <p className="text-xs font-bold text-slate-700 leading-tight">{company.location || 'Location N/A'}</p>
                              </div>
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
