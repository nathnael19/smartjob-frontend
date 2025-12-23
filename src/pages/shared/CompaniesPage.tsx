import { Search, MapPin, Building2, Globe, Users, ArrowRight, Loader2 } from "lucide-react";
import { VerifiedBadge } from "../../components/ui/VerifiedBadge";

import { useState, useMemo } from "react";
import { useJobs, useMyProfile } from "../../hooks/useApi";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";

export const CompaniesPage = () => {
  const { user } = useAuth();
  const { data: jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect recruiters
  if (user?.role === "recruiter") {
    return <Navigate to="/dashboard/employer" replace />;
  }

  const companies = useMemo(() => {
    if (!jobs) return [];
    
    // Group jobs by company
    const companyMap = new Map();
    
    jobs.forEach((job: any) => {
      const companyName = job.company_name || "Unknown Company";
      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, {
          name: companyName,
          location: job.location || "Remote",
          industry: "Technology", // Default industry
          employeeCount: "100-500", // Placeholder
          activeJobs: 0,
          logo: companyName[0],
          description: `Leading innovator in ${job.title.split(' ')[0]} solutions.`,
          website: `www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          is_verified: job.is_verified
        });
      }
      companyMap.get(companyName).activeJobs += 1;
    });

    const list = Array.from(companyMap.values());
    
    return list.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Discover <span className="text-primary italic">Top Companies</span>
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
            Explore organizations that are hiring right now and find your next great workplace.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50 flex items-center gap-2">
             <div className="flex flex-1 items-center px-3 w-full">
              <Search className="h-5 w-5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search companies..." 
                className="h-10 w-full border-none focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="md" className="px-6 rounded-lg font-bold">Search</Button>
          </div>
          {companies.length > 0 && (
             <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">
                   <Building2 className="h-3 w-3 text-primary" /> Found {companies.length} companies
                </span>
             </div>
          )}
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {companies.map((company) => (
            <Card key={company.name} className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-md border-slate-200/60 flex flex-col h-full">
              <div className="h-1.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 group-hover:via-primary transition-all duration-500" />
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-white shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-300">
                    {company.logo}
                  </div>
                  <div className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 uppercase tracking-wider border border-green-200">
                    {company.activeJobs} Jobs
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {company.name}
                    {company.is_verified && <VerifiedBadge />}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{company.industry}</span>
                  </div>
                </div>

                <p className="mb-6 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="mt-auto pt-5 border-t border-slate-100/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      {company.employeeCount}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Globe className="h-3.5 w-3.5" />
                    {company.website}
                  </div>
                </div>

                <Link to={`/dashboard/seeker/jobs?q=${encodeURIComponent(company.name)}`} className="mt-6 block">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all rounded-lg border border-slate-200 group-hover:border-primary font-bold text-xs h-10">
                    View Open Roles
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
               <Search className="h-8 w-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No companies found</h3>
             <p className="mt-2 text-slate-500">Try adjusting your search terms or filters.</p>
             <Button variant="outline" className="mt-6 font-bold" onClick={() => setSearchTerm("")}>
               Clear Filters
             </Button>
          </div>
        )}
      </main>
    </div>
  );
};
