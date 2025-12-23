import { useState } from "react";
import { useMyJobs, useJobApplicants, useMyProfile, useUpdateApplicationStatus } from "../../hooks/useApi";
import { Card, CardContent } from "../../components/ui/Card";
import { Loader2, User, Mail, FileText, Search } from "lucide-react";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const CandidatesPage = () => {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: jobs, isLoading: jobsLoading } = useMyJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const queryTerm = searchParams.get("q") || "";
  const [jobSearch, setJobSearch] = useState(queryTerm);
  const [candidateSearch, setCandidateSearch] = useState("");

  useEffect(() => {
    if (queryTerm && queryTerm !== jobSearch) {
      setJobSearch(queryTerm);
    }
  }, [queryTerm]);

  const filteredJobs = jobs?.filter((job: any) => 
    job.title.toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar 
        role="recruiter" 
        userName={profile?.full_name || user?.email?.split('@')[0] || "Recruiter"} 
        userAvatar={profile?.avatar_url || profile?.profile_picture_url}
        companyName={profile?.company_name} 
      />
      <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
            <p className="text-slate-500">View and manage applicants for your posted jobs.</p>
          </div>
        </div>

        {jobsLoading && (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List (Sidebar) */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Select a Job</h2>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter jobs..." 
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="h-10 w-full pl-10 pr-4 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
             </div>
             {filteredJobs?.map((job: any) => (
                <div 
                    key={job.id} 
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                        selectedJobId === job.id 
                        ? "bg-white border-primary ring-1 ring-primary shadow-sm" 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                >
                    <h3 className={`font-bold ${selectedJobId === job.id ? "text-primary" : "text-slate-900"}`}>
                        {job.title} <span className="text-xs text-slate-400 font-normal">({job.applicants_count || 0})</span>
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 font-medium">{job.location}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {job.status || 'Active'}
                        </span>
                    </div>
                </div>
             ))}
             {!jobsLoading && jobs?.length === 0 && (
                <div className="text-center p-8 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">No jobs posted yet.</p>
                </div>
             )}
          </div>

          {/* Candidates List (Main Area) */}
          <div className="lg:col-span-2">
             {selectedJobId ? (
                <div className="space-y-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search candidates by name..." 
                            value={candidateSearch}
                            onChange={(e) => setCandidateSearch(e.target.value)}
                            className="h-10 w-full pl-10 pr-4 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                        />
                    </div>
                    <CandidatesList jobId={selectedJobId} searchTerm={candidateSearch} />
                </div>
             ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <User className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium">Select a job to view its applicants.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const CandidatesList = ({ jobId, searchTerm }: { jobId: string; searchTerm: string }) => {
    const { data: applicants, isLoading, error } = useJobApplicants(jobId);

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (error) return <div className="text-red-500 font-bold p-4">Failed to load applicants.</div>;
    
    // Fallback if the API returns just the list or wrapped data
    const list = Array.isArray(applicants) ? applicants : (applicants?.data || []);

    const filteredApplicants = list.filter((app: any) => 
        app.job_seeker?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (list.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">No applicants for this job yet.</p>
            </div>
        );
    }

    if (filteredApplicants.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">No candidates match your search.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
                Applicants ({filteredApplicants.length})
            </h2>
            {filteredApplicants.map((application: any) => (
                <CandidateCard key={application.id} application={application} />
            ))}
        </div>
    );
};

const CandidateCard = ({ application }: { application: any }) => {
    const updateStatus = useUpdateApplicationStatus();
    
    return (
                <Card className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar / Initials */}
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-slate-400">
                                    {(application.job_seeker?.full_name?.[0] || "U").toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {application.job_seeker?.full_name || "Unknown Applicant"}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5" /> 
                                            {application.email || application.job_seeker?.user?.email || "No email"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs font-bold text-slate-400">
                                            Applied {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Unknown Date'}
                                        </span>
                                        <select 
                                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                                                application.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                application.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}
                                            value={application.status || 'applied'}
                                            onChange={(e) => updateStatus.mutate({ id: application.id, status: e.target.value })}
                                            disabled={updateStatus.isPending}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="interview">Interview</option>
                                            <option value="hired">Hired</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Resume / Cover Letter Section */}
                                <div className="flex gap-3 pt-2">
                                    {application.resume_url && (
                                        <a 
                                            href={application.resume_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                                        >
                                            <FileText className="h-3.5 w-3.5" /> View Resume
                                        </a>
                                    )}
                                    <a 
                                        href={`mailto:${application.email || application.job_seeker?.user?.email}`}
                                        className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                                    >
                                        <Mail className="h-3.5 w-3.5" /> Email Candidate
                                    </a>
                                </div>
                                
                                {application.cover_letter && (
                                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mt-2">
                                        <p className="font-bold text-xs text-slate-400 uppercase mb-1">Cover Letter</p>
                                        {application.cover_letter}
                                    </div>
                                )}

                                <div className="space-y-1.5 mt-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Recruiter Notes (Private)</label>
                                    <textarea 
                                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-amber-50/30"
                                        placeholder="Add private notes about this candidate..."
                                        rows={3}
                                        defaultValue={application.recruiter_notes || ""}
                                        onBlur={(e) => {
                                            if (e.target.value !== application.recruiter_notes) {
                                                updateStatus.mutate({ 
                                                    id: application.id, 
                                                    status: application.status || 'applied',
                                                    recruiter_notes: e.target.value 
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
    );
};
