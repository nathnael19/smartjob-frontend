import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Search, MapPin, Star, Loader2, Filter } from "lucide-react";
import { VerifiedBadge } from "../../components/ui/VerifiedBadge";
import { useJobs, useMyProfile } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from "../../lib/constants";

export const SeekerJobsPage = () => {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: jobs, isLoading } = useJobs();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTerm = searchParams.get("q") || "";

  // Filter States
  const [searchTerm, setSearchTerm] = useState(queryTerm);
  const [locationTerm, setLocationTerm] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [isRemote, setIsRemote] = useState(false);
  const [datePosted, setDatePosted] = useState<string>("all"); // all, 24h, 7d, 30d

  // Sync searchTerm with URL query param if needed
  useEffect(() => {
    if (queryTerm && queryTerm !== searchTerm) {
      setSearchTerm(queryTerm);
    }
  }, [queryTerm]);

  const displayName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || "User";

  // Filter Options
  const jobTypes = EMPLOYMENT_TYPES;
  const experienceLevels = EXPERIENCE_LEVELS;

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    return jobs.filter((job: any) => {
      // 1. Search Term
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Location Term
      const matchesLocation = locationTerm === "" || 
        job.location?.toLowerCase().includes(locationTerm.toLowerCase());

      // 3. Job Type
      const matchesJobType = selectedJobTypes.length === 0 || 
        selectedJobTypes.includes(job.employment_type);

      // 4. Experience Level
      const matchesExperience = selectedExperience.length === 0 || 
        selectedExperience.includes(job.experience_level);

      // 5. Remote
      const matchesRemote = !isRemote || (job.location_type === "Remote" || job.is_remote);

      // 6. Date Posted
      let matchesDate = true;
      if (datePosted !== "all" && job.created_at) {
        const jobDate = new Date(job.created_at).getTime();
        const now = new Date().getTime();
        const diffDays = (now - jobDate) / (1000 * 3600 * 24);
        
        if (datePosted === "24h") matchesDate = diffDays <= 1;
        else if (datePosted === "7d") matchesDate = diffDays <= 7;
        else if (datePosted === "30d") matchesDate = diffDays <= 30;
      }

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesRemote && matchesDate;
    }).map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company_name || "Company",
      location: job.location,
      type: job.employment_type,
      salary: `$${(job.salary_min || 0)/1000}k - ${(job.salary_max || 0)/1000}k`,
      posted: new Date(job.created_at).toLocaleDateString(),
      logo: (job.company_name || "C")[0],
      color: "bg-primary/10 text-primary",
      is_verified: job.is_verified // Assuming backend returns this
    }));
  }, [jobs, searchTerm, locationTerm, selectedJobTypes, selectedExperience, isRemote, datePosted]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setIsRemote(false);
    setDatePosted("all");
    setSearchParams({}); // Clear URL params too
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar 
        role="job_seeker" 
        userName={displayName} 
        userAvatar={profile?.avatar_url || profile?.profile_picture_url} 
      />
      
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Find Your Dream Job</h1>
            <p className="text-slate-500 mt-1">Browse thousands of job openings to find the perfect role for you.</p>
        </header>

        {/* Top Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Job title, keywords, or company" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Location (City, State, Zip)" 
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                <Button size="lg" className="h-12 px-8 font-bold">Search Jobs</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="space-y-8">
                <div className="flex items-center justify-between lg:hidden mb-4">
                   <h2 className="font-bold text-lg">Filters</h2>
                   <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
                </div>

                {/* Desktop Sidebar Content */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</h3>
                        <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Clear All</button>
                    </div>

                    {/* Job Type */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Job Type</h4>
                        <div className="space-y-2">
                            {jobTypes.map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedJobTypes.includes(type) ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                        {selectedJobTypes.includes(type) && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={selectedJobTypes.includes(type)}
                                        onChange={() => toggleFilter(selectedJobTypes, setSelectedJobTypes, type)}
                                    />
                                    <span className="text-slate-600 text-sm">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Experience Level */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Experience Level</h4>
                        <div className="space-y-2">
                            {experienceLevels.map(level => (
                                <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedExperience.includes(level) ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                        {selectedExperience.includes(level) && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={selectedExperience.includes(level)}
                                        onChange={() => toggleFilter(selectedExperience, setSelectedExperience, level)}
                                    />
                                    <span className="text-slate-600 text-sm">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                     {/* Remote Only */}
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-6 rounded-full border flex items-center transition-colors p-1 ${isRemote ? 'bg-primary border-primary justify-end' : 'bg-slate-100 border-slate-200 justify-start'}`}>
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isRemote}
                            onChange={() => setIsRemote(!isRemote)}
                        />
                        <span className="text-slate-900 font-bold text-sm">Remote Only</span>
                    </label>

                    <div className="h-px bg-slate-100" />

                    {/* Date Posted */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Date Posted</h4>
                        <div className="space-y-2">
                            {[
                                { label: "Any time", value: "all" },
                                { label: "Past 24 hours", value: "24h" },
                                { label: "Past week", value: "7d" },
                                { label: "Past month", value: "30d" }
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${datePosted === option.value ? 'border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                        {datePosted === option.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <input 
                                        type="radio" 
                                        name="datePosted"
                                        className="hidden" 
                                        checked={datePosted === option.value}
                                        onChange={() => setDatePosted(option.value)}
                                    />
                                    <span className="text-slate-600 text-sm">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Job Listings Column */}
            <div className="lg:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-slate-500 font-medium">Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> jobs</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Sort by:</span>
                        <select className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-0 cursor-pointer">
                            <option>Most Relevant</option>
                            <option>Newest</option>
                            <option>Salary (High to Low)</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                  <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-12 animate-spin text-primary" />
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredJobs.map((job: any) => (
                      <Link to={`/dashboard/seeker/jobs/${job.id}`} key={job.id}>
                        <Card className="group cursor-pointer hover:border-primary transition-all hover:shadow-md">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className={`h-16 w-16 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${job.color}`}>
                                    {job.logo}
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-slate-500 font-medium">{job.company}</p>
                                                {job.is_verified && <VerifiedBadge />}
                                            </div>
                                        </div>
                                        <button className="text-slate-300 hover:text-primary transition-colors">
                                           <Star className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded textxs font-semibold text-slate-600">{job.type}</span>
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold">{job.salary}</span>
                                        <span className="text-xs text-slate-400">• Posted {job.posted}</span>
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
                        <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};
