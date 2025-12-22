import { Search, MapPin, Building2, Globe, Users, ArrowRight, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useJobs } from "../../hooks/useApi";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Link } from "react-router-dom";

export const CompaniesPage = () => {
  const { data: jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");

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
          website: `www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`
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
    <div className="container mx-auto px-4 py-12 lg:px-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Discover <span className="text-primary italic">Top Companies</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Explore organizations that are hiring right now and find your next great workplace.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-16 max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-2">
           <div className="flex flex-1 items-center px-4 w-full">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search by company name, industry, or location..." 
              className="h-12 w-full border-none focus:outline-none focus:ring-0 text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="lg" className="px-10 w-full sm:w-auto">Search</Button>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
           <span>Found {companies.length} companies</span>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.name} className="group overflow-hidden hover:border-primary transition-all hover:shadow-lg border-slate-100 flex flex-col">
            <div className="h-2 bg-primary/10 group-hover:bg-primary transition-colors" />
            <CardContent className="p-8 flex-1 flex flex-col">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                  {company.logo}
                </div>
                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 ring-1 ring-inset ring-green-600/20">
                  {company.activeJobs} Open Jobs
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Building2 className="h-4 w-4" />
                  <span>{company.industry}</span>
                </div>
              </div>

              <p className="mb-6 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {company.description}
              </p>

              <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users className="h-4 w-4" />
                    {company.employeeCount}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Globe className="h-4 w-4" />
                  {company.website}
                </div>
              </div>

              <Link to={`/jobs?q=${encodeURIComponent(company.name)}`} className="mt-8">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all rounded-xl border border-slate-100 group-hover:border-primary">
                  View open roles
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="py-20 text-center">
           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
             <Search className="h-10 w-10 text-slate-200" />
           </div>
           <h3 className="mt-4 text-lg font-bold text-slate-900">No companies found</h3>
           <p className="mt-2 text-slate-500">Try adjusting your search terms or filters.</p>
           <Button variant="outline" className="mt-6" onClick={() => setSearchTerm("")}>
             Clear all filters
           </Button>
        </div>
      )}
    </div>
  );
};
