import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MapPin, Star, Loader2, BookmarkX, ArrowRight } from "lucide-react";
import { useSavedJobs, useMyProfile } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const SavedJobsPage = () => {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: savedJobs, isLoading } = useSavedJobs();

  const displayName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || "User";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Saved Jobs</h1>
            <p className="text-slate-500 mt-1">Manage all the opportunities you've bookmarked.</p>
        </header>

        <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-10 w-12 animate-spin text-primary" />
              </div>
            ) : savedJobs && savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {savedJobs.map((job: any) => (
                  <Link to={`/dashboard/seeker/jobs/${job.id}`} key={job.id}>
                    <Card className="group cursor-pointer hover:border-primary transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="h-16 w-16 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 bg-primary/10 text-primary">
                                {(job.company_name || 'C')[0]}
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                        <p className="text-slate-500 font-medium">{job.company_name || "Company"}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">Saved</span>
                                       <button className="text-primary hover:text-primary/80 transition-colors">
                                          <Star className="h-5 w-5 fill-primary" />
                                       </button>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{job.employment_type || 'Full-time'}</span>
                                    <span className="flex items-center gap-1.5 text-green-600 font-bold">
                                       ${(job.salary_min || 0)/1000}k - ${(job.salary_max || 0)/1000}k
                                    </span>
                                </div>

                                <div className="flex items-center justify-end">
                                   <Button variant="ghost" size="sm" className="text-primary font-bold group-hover:translate-x-1 transition-transform">
                                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                                   </Button>
                                </div>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <BookmarkX className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No saved jobs yet</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Bookmark jobs you're interested in to view them later.</p>
                    <Link to="/dashboard/seeker/jobs">
                       <Button className="mt-8 px-8 font-bold">Browse Jobs</Button>
                    </Link>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};
