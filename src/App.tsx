import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy-loaded components
const LandingPage = lazy(() => import("./pages/LandingPage").then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import("./pages/auth/SignupPage").then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage").then(module => ({ default: module.ForgotPasswordPage })));
const CheckInboxPage = lazy(() => import("./pages/auth/CheckInboxPage").then(module => ({ default: module.CheckInboxPage })));
const JobDetailsPage = lazy(() => import("./pages/jobs/JobDetailsPage").then(module => ({ default: module.JobDetailsPage })));
const MyApplicationsPage = lazy(() => import("./pages/seeker/MyApplicationsPage").then(module => ({ default: module.MyApplicationsPage })));
const SeekerJobsPage = lazy(() => import("./pages/seeker/SeekerJobsPage").then(module => ({ default: module.SeekerJobsPage })));
const SeekerJobDetailsPage = lazy(() => import("./pages/seeker/SeekerJobDetailsPage").then(module => ({ default: module.SeekerJobDetailsPage })));
const SavedJobsPage = lazy(() => import("./pages/seeker/SavedJobsPage").then(module => ({ default: module.SavedJobsPage })));
const EmployerDashboard = lazy(() => import("./pages/employer/EmployerDashboard").then(module => ({ default: module.EmployerDashboard })));
const MyJobsPage = lazy(() => import("./pages/employer/MyJobsPage").then(module => ({ default: module.MyJobsPage })));
const PostJobPage = lazy(() => import("./pages/employer/PostJobPage").then(module => ({ default: module.PostJobPage })));
const CompanyProfilePage = lazy(() => import("./pages/employer/CompanyProfilePage").then(module => ({ default: module.CompanyProfilePage })));
const CompanySettingsPage = lazy(() => import("./pages/employer/CompanySettingsPage").then(module => ({ default: module.CompanySettingsPage })));
const EditJobPage = lazy(() => import("./pages/employer/EditJobPage").then(module => ({ default: module.EditJobPage })));
const EmployerJobDetailsPage = lazy(() => import("./pages/employer/EmployerJobDetailsPage").then(module => ({ default: module.EmployerJobDetailsPage })));
const CandidatesPage = lazy(() => import("./pages/employer/CandidatesPage").then(module => ({ default: module.CandidatesPage })));
const CompleteProfilePage = lazy(() => import("./pages/auth/CompleteProfilePage").then(module => ({ default: module.CompleteProfilePage })));
const SettingsPage = lazy(() => import("./pages/shared/SettingsPage").then(module => ({ default: module.SettingsPage })));
const CompaniesPage = lazy(() => import("./pages/shared/CompaniesPage").then(module => ({ default: module.CompaniesPage })));

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<LandingPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
          </Route>

          {/* Global Protected Routes (Any Authenticated User) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Auth Routes (Guest Only) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/check-inbox" element={<CheckInboxPage />} />

          {/* Seeker Private Routes */}
          <Route element={<ProtectedRoute allowedRole="job_seeker" />}>
            <Route path="/dashboard/seeker" element={<SeekerJobsPage />} />
            <Route path="/dashboard/seeker/jobs" element={<SeekerJobsPage />} />
            <Route path="/dashboard/seeker/applications" element={<MyApplicationsPage />} />
            <Route path="/dashboard/seeker/jobs/:id" element={<SeekerJobDetailsPage />} />
            <Route path="/dashboard/seeker/saved" element={<SavedJobsPage />} />
          </Route>
          
          {/* Employer Private Routes */}
          <Route element={<ProtectedRoute allowedRole="recruiter" />}>
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/employer/jobs" element={<MyJobsPage />} />
            <Route path="/dashboard/employer/jobs/:id" element={<EmployerJobDetailsPage />} />
            <Route path="/dashboard/employer/jobs/:id/edit" element={<EditJobPage />} />
            <Route path="/dashboard/employer/post-job" element={<PostJobPage />} />
            <Route path="/dashboard/employer/profile" element={<CompanyProfilePage />} />
            <Route path="/dashboard/employer/company-settings" element={<CompanySettingsPage />} />
            <Route path="/dashboard/employer/candidates" element={<CandidatesPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
