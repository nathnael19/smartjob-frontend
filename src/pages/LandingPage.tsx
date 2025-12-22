import { Search, MapPin, Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useJobs } from "../hooks/useApi";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LandingPage = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { data: jobs, isLoading } = useJobs();

  // Redirect logged-in users to dashboard if they visit the landing page
  // Limit this to the root path "/" and maybe "/jobs" if desired, but user specifically asked about landing page
  if (user && pathname === "/") {
     const dashboardPath = user.role === "recruiter" ? "/dashboard/employer" : "/dashboard/seeker";
     return <Navigate to={dashboardPath} replace />;
  }

  const trendingJobs = jobs?.slice(0, 6).map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company_name || "Company",
    location: job.location,
    type: job.employment_type,
    salary: `$${(job.salary_min || 0)/1000}k - ${(job.salary_max || 0)/1000}k`,
    posted: new Date(job.created_at).toLocaleDateString(),
    logo: (job.company_name || "C")[0],
    color: "bg-primary/10 text-primary"
  })) || [];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Find your next <span className="text-primary italic">career move</span> today
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-500">
              Thousands of jobs are waiting for you. Search by role, company, or location.
            </p>

            <div className="mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex flex-1 items-center px-4">
                  <Search className="h-5 w-5 text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="h-12 w-full border-none focus:outline-none focus:ring-0 text-slate-900"
                  />
                </div>
                <div className="hidden h-8 w-px bg-slate-200 md:block" />
                <div className="flex flex-1 items-center px-4">
                  <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="City, state, or zip code" 
                    className="h-12 w-full border-none focus:outline-none focus:ring-0 text-slate-900"
                  />
                </div>
                <Button size="lg" className="px-10">Search</Button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm font-medium text-slate-400">Popular:</span>
              {["Remote", "Full-time", "Engineering", "Marketing", "Design"].map((tag) => (
                <button 
                  key={tag} 
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Grid Accent */}
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale md:gap-16">
            {["Acme Corp", "GlobalTech", "Circulo", "Nexa", "Orbit"].map((company) => (
              <div key={company} className="flex items-center gap-2 font-bold text-slate-900">
                <div className="h-6 w-6 rounded-full bg-slate-900" />
                <span>{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Opportunities */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trending Opportunities</h2>
            <p className="mt-2 text-slate-500">Explore the most popular roles this week.</p>
          </div>
          <Button variant="ghost" className="hidden text-primary md:flex">
            View all jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingJobs.map((job: any) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <Card className="group cursor-pointer h-full hover:border-primary transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold ${job.color}`}>
                        {job.logo}
                      </div>
                      <button className="text-slate-300 hover:text-primary">
                        <Star className="h-5 w-5" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{job.type}</span>
                      <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">{job.salary}</span>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">Posted {job.posted}</span>
                      <button className="text-sm font-bold text-primary group-hover:underline">Apply Now</button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Cards */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-8">
        <div className="rounded-3xl bg-blue-50 p-10 ring-1 ring-blue-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
            <UserIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-slate-900">For Job Seekers</h3>
          <p className="mt-2 text-slate-600">Create a profile, upload your resume, and find your dream job with our advanced search and matching algorithms.</p>
          <ul className="mt-6 space-y-3">
            {["Smart job recommendations", "One-click applications", "Salary insights & reviews"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckIcon className="h-4 w-4 text-green-500" /> {item}
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="mt-8 p-0 text-primary hover:bg-transparent">
            Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-3xl bg-purple-50 p-10 ring-1 ring-purple-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 overflow-hidden">
            <img src="/logo.png" alt="Recruiter" className="h-full w-full object-cover brightness-0 invert p-2" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-slate-900">For Employers</h3>
          <p className="mt-2 text-slate-600">Find the best talent for your company. Post jobs, manage applications, and schedule interviews all in one place.</p>
          <ul className="mt-6 space-y-3">
            {["Access to millions of candidates", "Advanced candidate filtering", "Easy-to-use applicant tracking"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckIcon className="h-4 w-4 text-green-500" /> {item}
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="mt-8 p-0 text-primary hover:bg-transparent">
            Post a Job <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-white lg:py-24">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-4xl font-extrabold sm:text-5xl">Hiring? Post a job for free.</h2>
            <p className="mt-6 text-lg text-blue-100">
              Reach thousands of qualified candidates and fill your open positions faster than ever.
            </p>
            <Button size="lg" className="mt-10 bg-white text-primary hover:bg-slate-50">
              Start Hiring Now
            </Button>
          </div>
          
          {/* Subtle pattern background for CTA */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </section>
    </div>
  );
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
