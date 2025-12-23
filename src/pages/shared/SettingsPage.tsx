import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { User, Mail, Phone, Globe, MapPin, Bell, Camera, Lock, Eye, EyeOff, FileText, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMyProfile, useUpdateProfile, useDeleteAccount, useUploadAvatar, useUploadResume } from "../../hooks/useApi";
import { AlertDialog } from "../../components/ui/AlertDialog";

const HEADLINE_OPTIONS = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Designer",
  "Marketing",
  "Sales",
  "Customer Support",
  "Operations",
  "Other"
];

const validateEthiopianPhone = (phone: string) => {
  const regex = /^(?:\+251|0)[1-9]\d{8}$/;
  return regex.test(phone.replace(/\s/g, ""));
};

export const SettingsPage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const uploadAvatar = useUploadAvatar();
  const uploadResume = useUploadResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    phone_number: "",
    location: "",
    portfolio_url: "",
    resume_url: "",
    github_url: "",
    education: "",
    skills: "",
    years_experience: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePass, setShowDeletePass] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Redirect recruiters to their own settings page
  if (user?.role === "recruiter") {
    return <Navigate to="/dashboard/employer/company-settings" replace />;
  }

  useEffect(() => {
    if (profile) {
      const data = profile.profile || profile;
      setFormData({
        full_name: data.full_name || "",
        headline: data.headline || "",
        bio: data.bio || "",
        phone_number: data.phone_number || "",
        location: data.location || "",
        portfolio_url: data.portfolio_url || "",
        resume_url: data.resume_url || "",
        github_url: data.github_url || "",
        education: data.education || "",
        skills: data.skills || "",
        years_experience: data.years_experience?.toString() || "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.headline || !formData.skills || !formData.years_experience || !formData.github_url || !formData.phone_number || !formData.location) {
        toast.error("Please fill in all required fields");
        return;
    }
    if (!validateEthiopianPhone(formData.phone_number)) {
        toast.error("Please enter a valid Ethiopian phone number");
        return;
    }
    updateProfile.mutate(formData);
  };

  const handleUpdatePassword = () => {
      // Basic validation
      if (passwordData.new_password !== passwordData.confirm_password) {
          return; // Let browser handle toast/error if hook doesn't
      }
      // Note: useUpdateProfile currently takes profileData. 
      // If we want a separate password update, we'd use a dedicated hook or update profile.
      // Based on typical backend patterns, we'll try sending it to profile update or check if hook exists.
      // For now, I'll focus on the requested profile data and the Modal.
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const avatarFormData = new FormData();
          avatarFormData.append("file", file);
          await uploadAvatar.mutateAsync(avatarFormData);
      }
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const resumeFormData = new FormData();
          resumeFormData.append("file", file);
          await uploadResume.mutateAsync(resumeFormData);
      }
  };

  const confirmDelete = () => {
    deleteAccount.mutate({ password: deletePassword });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const profileStrength = Math.round(
     ((formData.full_name ? 1 : 0) + 
     (formData.headline ? 1 : 0) + 
     (formData.location ? 1 : 0) + 
     (formData.bio ? 1 : 0) + 
     (formData.phone_number ? 1 : 0) + 
     (formData.resume_url ? 1 : 0)) / 6 * 100
  );

  const profileData = profile?.profile || profile || {};
  const avatarUrl = profileData.profile_picture_url || profileData.profile_picture;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar 
        role="job_seeker" 
        userName={formData.full_name || user?.email || "User"} 
        userAvatar={avatarUrl || profile?.avatar_url}
      />
      
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Home</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Settings</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <p className="text-slate-500">Manage your personal information, privacy settings, and security.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <Card>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <User className="h-5 w-5" /> Personal Information
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-primary overflow-hidden">
                         {avatarUrl ? (
                             <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                         ) : (
                             (formData.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()
                         )}
                      </div>
                      <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      >
                         {uploadAvatar.isPending ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" /> : <Camera className="h-4 w-4" />}
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </div>
                    <div className="flex-1 space-y-1">
                       <h4 className="font-bold text-slate-900">Profile Photo</h4>
                       <p className="text-xs text-slate-500">Recommended 400x400px. JPG or PNG.</p>
                       <div className="flex gap-4 pt-2">
                          <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-primary hover:underline underline-offset-4">Upload New</button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g. Alex Morgan" />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Professional Headline *</label>
                    <select
                        name="headline"
                        className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.headline}
                        onChange={handleChange}
                    >
                        <option value="">Select headline</option>
                        {HEADLINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">About Me</label>
                    <textarea 
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your experience..."
                      className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-slate-50/30 transition-all focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Education</label>
                      <Input name="education" value={formData.education} onChange={handleChange} placeholder="e.g. BSc in Computer Science" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Skills *</label>
                      <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Python" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Years of Experience *</label>
                      <Input 
                        name="years_experience" 
                        value={formData.years_experience} 
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                                handleChange(e);
                            }
                        }} 
                        placeholder="e.g. 5" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password & Security Section */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Lock className="h-5 w-5" /> Password & Security
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-1.5 shrink-0">
                        <label className="text-sm font-medium text-slate-700">Current Password</label>
                        <div className="relative">
                            <Input 
                                type={showCurrentPass ? "text" : "password"} 
                                name="current_password" 
                                value={passwordData.current_password} 
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                     </div>
                     <div className="space-y-1.5 shrink-0">
                        <label className="text-sm font-medium text-slate-700">New Password</label>
                        <div className="relative">
                            <Input 
                                type={showNewPass ? "text" : "password"} 
                                name="new_password" 
                                value={passwordData.new_password} 
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                     </div>
                  </div>
                  <Button variant="outline" className="font-bold border-primary text-primary hover:bg-primary/5" onClick={handleUpdatePassword}>
                      Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Mail className="h-5 w-5" /> Contact Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <Input value={user?.email || ""} disabled className="bg-slate-50 text-slate-500" icon={<Mail className="h-4 w-4" />} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                        <Input name="phone_number" value={formData.phone_number} onChange={handleChange} icon={<Phone className="h-4 w-4" />} placeholder="09... or +251 9..." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Location *</label>
                        <Input name="location" value={formData.location} onChange={handleChange} icon={<MapPin className="h-4 w-4" />} placeholder="e.g. Addis Ababa" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Portfolio URL</label>
                        <Input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} icon={<Globe className="h-4 w-4" />} placeholder="https://" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">GitHub URL *</label>
                        <Input name="github_url" value={formData.github_url} onChange={handleChange} icon={<User className="h-4 w-4" />} placeholder="https://github.com/username" />
                    </div>
                     <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Resume</label>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {formData.resume_url ? formData.resume_url.split('/').pop() : "No resume uploaded"}
                                </p>
                                <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="font-bold border-primary text-primary hover:bg-primary/5 h-9"
                                onClick={() => resumeInputRef.current?.click()}
                                isLoading={uploadResume.isPending}
                            >
                                {formData.resume_url ? "Change Resume" : "Upload Resume"}
                            </Button>
                            <input 
                                type="file" 
                                ref={resumeInputRef} 
                                className="hidden" 
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeFileChange}
                            />
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Notifications */}
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Bell className="h-5 w-5" /> Privacy & Notifications
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Profile Visibility", desc: "Allow recruiters to find your profile in search results.", default: true },
                      { title: "Job Alerts", desc: "Receive daily emails with jobs matching your preferences.", default: true },
                      { title: "Application Updates", desc: "Get notification updates on your application status.", default: true }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4">
                        <div>
                           <p className="text-sm font-bold text-slate-900">{item.title}</p>
                           <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <button className={`h-6 w-11 rounded-full p-1 transition-colors ${item.default ? "bg-primary" : "bg-slate-200"}`}>
                           <div className={`h-4 w-4 rounded-full bg-white transition-transform ${item.default ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-8">
                   <div>
                      <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
                      <div className="space-y-3">
                         <Button className="w-full font-bold h-11" onClick={handleSave} isLoading={updateProfile.isPending}>Save Changes</Button>
                         <Button variant="outline" className="w-full font-bold h-11" onClick={() => window.location.reload()}>Cancel</Button>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-2">
                         <span className="text-slate-900">Profile Strength</span>
                         <span className="text-primary">{profileStrength}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                         <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${profileStrength}%` }} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium mb-4 italic">Complete your profile to stand out to employers.</p>
                      
                   </div>

                   <div className="pt-8 border-t border-slate-100 rounded-2xl bg-red-50 p-6">
                      <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                      <p className="text-xs text-red-500/80 mb-6 leading-relaxed">
                         Once you delete your account, there is no going back. All your data will be permanently removed.
                      </p>
                      <button 
                        className="text-sm font-bold text-red-600 hover:underline underline-offset-4"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        Delete Account
                      </button>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Account?"
        description="This action is permanent and cannot be undone. You will lose all your applications, saved jobs, and profile data. Please enter your password to confirm."
        confirmText="Yes, Delete My Account"
        isLoading={deleteAccount.isPending}
      >
        <div className="relative mt-2">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type={showDeletePass ? "text" : "password"}
                className="w-full pl-10 pr-10 h-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-sm transition-all"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
            />
            <button 
                type="button"
                onClick={() => setShowDeletePass(!showDeletePass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
                {showDeletePass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
      </AlertDialog>
    </div>
  );
};


