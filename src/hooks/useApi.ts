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
      const { data } = await api.get("/api/v1/jobs/saved");
      return data;
    },
  });
};

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.post(`/api/v1/jobs/${jobId}/save`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Saved status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update saved status");
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
    mutationFn: async ({ id, status, ai_score, ai_reason }: { id: string; status: string; ai_score?: number; ai_reason?: string }) => {
      const { data } = await api.put(`/api/v1/applications/${id}/status`, { status, ai_score, ai_reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update status");
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
        // Fetch all jobs
        const { data: responseData } = await api.get("/api/v1/jobs");
        
        // Handle both direct array and { data: [...] } wrapping
        const allJobs = Array.isArray(responseData) ? responseData : (responseData?.data || []);
        
        // Filtering disabled as it was causing issues with job visibility
        // Returning all jobs but enriching with counts
        const myJobs = allJobs;

        // Fetch application counts for each job in parallel
        const jobsWithCounts = await Promise.all(myJobs.map(async (job: any) => {
          try {
            const { data: applicants } = await api.get(`/api/v1/applications/job/${job.id}`);
            return {
              ...job,
              applicants_count: Array.isArray(applicants) ? applicants.length : (applicants?.data?.length || 0)
            };
          } catch (error) {
            console.error(`[useMyJobs] Error fetching applicants for job ${job.id}:`, error);
            return { ...job, applicants_count: 0 };
          }
        }));
        
        
        const sortedJobs = [...jobsWithCounts].sort((a: any, b: any) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );

        return sortedJobs;
      } catch (error: any) {
        console.error("[useMyJobs] Error in useMyJobs:", error);
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

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Ensure backend expects the key used in formData.
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
      console.error("[useUploadAvatar] Error:", error);
      toast.error(error.response?.data?.detail || "Failed to upload profile picture");
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
