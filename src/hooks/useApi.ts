import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Jobs
export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/jobs");
      const list = Array.isArray(data) ? data : (data?.data || []);
      return [...list].sort((a: any, b: any) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    },
  });
};

export const useJobDetails = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/jobs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData: any) => {
      const { data } = await api.post("/api/v1/jobs", jobData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "me"] });
    },
    onError: (error: any) => {
      console.error("[useCreateJob] Error:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to create job";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: response } = await api.put(`/api/v1/jobs/${id}`, data);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "me"] });
      toast.success("Job updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update job");
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/jobs/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "me"] });
      toast.success("Job deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete job");
    },
  });
};

export const useSavedJobs = () => {
  return useQuery({
    queryKey: ["jobs", "saved"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/saved-jobs");
      return data;
    },
  });
};


export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.post(`/api/v1/saved-jobs/${jobId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Invalidate specific job details to update UI if needed
      toast.success("Job saved");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to save job");
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.delete(`/api/v1/saved-jobs/${jobId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job removed from saved");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to unsave job");
    },
  });
};

// Applications
export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationData: any) => {
      const { data } = await api.post("/api/v1/applications", applicationData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
    }
  });
};

export const useJobApplicants = (jobId: string) => {
  return useQuery({
    queryKey: ["applications", jobId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/applications/job/${jobId}`);
      return data;
    },
    enabled: !!jobId,
  });
};

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["applications", "me"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/applications/me");
      return data;
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, ai_score, ai_reason, recruiter_notes }: { id: string; status: string; ai_score?: number; ai_reason?: string; recruiter_notes?: string }) => {
      // Must include status even if only updating notes to avoid 422
      const { data } = await api.put(`/api/v1/applications/${id}/status`, { status, ai_score, ai_reason, recruiter_notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update application");
    }
  });
};

// Profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/profile/me");
      return data;
    },
  });
};

export const useMyJobs = () => {
  return useQuery({
    queryKey: ["jobs", "me"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/v1/jobs/my-jobs");
        const list = Array.isArray(data) ? data : (data?.data || []);
        
        // Enrich with counts if needed, but if backend returns pure job list, we might miss counts.
        // The previous implementation fetched applicants count personally.
        // Does the new endpoint return applicant counts? Use provided code says "select(*)" from job. 
        // It does NOT include applicant counts.
        // We must re-implement the enrichment if we want to keep the dashboard features.
        
        const myJobs = list;

        // Fetch application counts and status breakdowns for each job in parallel
        const jobsWithCounts = await Promise.all(myJobs.map(async (job: any) => {
          try {
            const { data: applicantsData } = await api.get(`/api/v1/applications/job/${job.id}`);
            const applicants = Array.isArray(applicantsData) ? applicantsData : (applicantsData?.data || []);
            
            const status_breakdown = applicants.reduce((acc: any, app: any) => {
              const status = app.status || 'applied';
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            }, {});

            return {
              ...job,
              applicants_count: applicants.length,
              status_breakdown
            };
          } catch (error) {
            // console.error(`[useMyJobs] Error fetching applicants for job ${job.id}`);
            return { ...job, applicants_count: 0, status_breakdown: {} };
          }
        }));
        
        return jobsWithCounts;

      } catch (error: any) {
        console.error("[useMyJobs] Error:", error);
        throw error;
      }
    },
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data } = await api.put("/api/v1/profile/me", profileData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: async (data: any) => {
        // Endpoint based on user provided router: /profile/me
       await api.delete("/api/v1/profile/me", { data });
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted successfully");
      logout();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete account");
      throw error;
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/api/v1/profile/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Profile picture updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to upload profile picture");
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/api/v1/profile/me/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Resume uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to upload resume");
    },
  });
};

export const useUploadLegalDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/api/v1/profile/me/legal-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Legal document uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to upload legal document");
    },
  });
};
