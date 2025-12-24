import { DashboardNavbar } from "../../components/layout/DashboardNavbar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Briefcase, Globe, MapPin, Save, ArrowLeft, Camera, Trash2, Key, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMyProfile, useUpdateProfile, useUploadAvatar, useDeleteAccount } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { useAuthActions } from "../../hooks/useAuthActions";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AlertDialog } from "../../components/ui/AlertDialog";
import { VerificationModal } from "../../components/modals/VerificationModal";
import { VerifiedBadge } from "../../components/ui/VerifiedBadge";
import { ShieldCheck } from "lucide-react";


const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

const validateEthiopianPhone = (phone: string) => {
  const regex = /^\d{10}$/;
  return regex.test(phone);
};

export const CompanySettingsPage = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfile();
  
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const deleteAccount = useDeleteAccount();
  
  const [formData, setFormData] = useState({
    company: "",
    about_company: "",
    website_url: "",
    location: "",
    industry: "",
    company_size: "",
    phone_number: "",
    founded_year: "",
    twitter_url: "",
    linkedin_url: "",
    github_url: ""
  });
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data
  useEffect(() => {
    if (profile) {
      // Logic to handle nested profile if backend returns { role: ..., profile: ... }
      // Based on user provided python code: GET /me returns { role: "...", profile: { ... }, email: "..." }
      // So profile.profile contains the actual fields? 
      // Need to be careful. The previous code assumed flat structure.
      // If profile has a 'profile' property, use that.
      const data = profile.profile || profile;
      
      setFormData({
        company: data.company || user?.company || "",
        about_company: data.about_company || "",
        website_url: data.website_url || "",
        location: data.location || "",
        industry: data.industry || "",
        company_size: data.company_size || "",
        phone_number: data.phone_number || "",
        founded_year: data.founded_year || "",
        twitter_url: data.twitter_url || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || ""
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const avatarData = new FormData();
      avatarData.append("file", file); // Using 'file' as per updated python code
      await uploadAvatar.mutateAsync(avatarData);
    }
  };

  const handleSubmit = async () => {
    if (!formData.company || !formData.industry || !formData.company_size || !formData.location || !formData.founded_year || !formData.phone_number) {
        toast.error("Please fill in all required fields");
        return;
    }
    if (!validateEthiopianPhone(formData.phone_number)) {
        toast.error("Please enter a valid Ethiopian phone number");
        return;
    }

    // Construct payload matching DB schema
    const payload = {
        company: formData.company, // Match DB column 'company'
        industry: formData.industry,
        company_size: formData.company_size,
        website_url: formData.website_url,
        location: formData.location,
        about_company: formData.about_company,
        phone_number: formData.phone_number,
        founded_year: formData.founded_year ? parseInt(formData.founded_year.toString()) : null, // Ensure Integer
        twitter_url: formData.twitter_url,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url
    };

    await updateProfile.mutateAsync(payload);
  };

  const handleDeleteAccount = async () => {
      try {
        await deleteAccount.mutateAsync({ password: deletePassword });
        setIsDeleteOpen(false);
        logout(); 
        navigate("/");
      } catch (error) {
        // Error handling is done in mutation hook with toast
        console.error("Deletion failed", error);
      }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Derive display values
  const data = profile?.profile || profile || {};
  const isVerified = data.is_verified ?? user?.is_verified;
  const hasLegalDoc = data.legal_document_url ?? user?.legal_document_url;
  const companyName = formData.company || "Company";
  const profilePic = data.profile_picture_url || data.profile_picture || data.avatar_url;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      
      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <Link to="/dashboard/employer/profile" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Company Settings</h1>
            <p className="text-slate-500">Update your company's public information and details.</p>
          </header>

          {/* Verification Status Card */}
          <Card className="mb-8 overflow-hidden border-blue-100 bg-blue-50/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">Verification Status</h3>
                      {isVerified ? (
                        <VerifiedBadge showText />
                      ) : (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          hasLegalDoc 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-slate-200 text-slate-600"
                        }`}>
                          {hasLegalDoc ? "Pending Approval" : "Required"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 max-w-md">
                      {isVerified 
                        ? "Your company is verified. You have full access to premium recruiting features."
                        : hasLegalDoc
                        ? "Documents under review. We'll notify you once the process is complete."
                        : "Verify your legal identity to build trust with candidates and unlock job posting."
                      }
                    </p>
                  </div>
                </div>
                {isVerified ? (
                   <Button className="font-bold whitespace-nowrap bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none cursor-default" variant="outline" disabled>
                      Verified
                   </Button>
                ) : hasLegalDoc ? (
                   <Button className="font-bold whitespace-nowrap" variant="outline" disabled>
                      Verification Pending
                   </Button>
                ) : (
                  <Button 
                    className="font-bold whitespace-nowrap" 
                    onClick={() => setIsVerificationOpen(true)}
                  >
                    Start Verification
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 pb-4">
                <Briefcase className="h-5 w-5" /> Company Information
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <div className="relative group">
                    <div className="h-24 w-24 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                       {profilePic ? (
                          <img src={profilePic} alt="Company Logo" className="h-full w-full object-cover" />
                       ) : (
                          <span className="text-2xl font-bold text-slate-400">{companyName.substring(0, 2).toUpperCase()}</span>
                       )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    >
                       {uploadAvatar.isPending ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" /> : <Camera className="h-4 w-4" />}
                    </button>
                    <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleFileChange}
                    />
                 </div>
                 <div className="text-center sm:text-left">
                    <h3 className="font-bold text-slate-900">Company Logo</h3>
                    <p className="text-xs text-slate-500">Recommended 400x400px. JPG or PNG.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Company Name" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleInputChange} 
                />
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Company Description</label>
                  <textarea 
                    name="about_company"
                    rows={6}
                    value={formData.about_company}
                    onChange={handleInputChange}
                    placeholder="Tell us about your company..."
                    className="w-full rounded-lg border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                      label="Website" 
                      name="website_url"
                      icon={<Globe className="h-4 w-4" />} 
                      placeholder="https://company.com" 
                      value={formData.website_url}
                      onChange={handleInputChange}
                    />
                    <Input 
                      label="Phone *" 
                      name="phone_number"
                      icon={<Phone className="h-4 w-4" />} 
                      placeholder="0911223344" 
                      value={formData.phone_number}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (/^\d+$/.test(val) && val.length <= 10)) {
                           handleInputChange(e);
                        }
                      }}
                    />
                  </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <Input 
                        label="Headquarters *" 
                        name="location"
                        icon={<MapPin className="h-4 w-4" />} 
                        placeholder="e.g. Addis Ababa" 
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                        label="Industry *" 
                        name="industry"
                        placeholder="e.g. Technology" 
                        value={formData.industry}
                        onChange={handleInputChange}
                    />  
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Company Size *</label>
                        <select
                            name="company_size"
                            className="w-full h-11 rounded-lg border border-slate-200 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={formData.company_size}
                            onChange={handleInputChange}
                        >
                            <option value="">Select size</option>
                            {COMPANY_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                        label="Founded Year *" 
                        name="founded_year"
                        placeholder="e.g. 2010" 
                        value={formData.founded_year} 
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d{0,4}$/.test(val)) {
                                handleInputChange(e);
                            }
                        }} 
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">Social Profiles</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input 
                            label="Twitter URL" 
                            name="twitter_url"
                            placeholder="https://twitter.com/company" 
                            value={formData.twitter_url} 
                            onChange={handleInputChange} 
                        />
                        <Input 
                            label="LinkedIn URL" 
                            name="linkedin_url"
                            placeholder="https://linkedin.com/company/abc" 
                            value={formData.linkedin_url} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <Input 
                        label="GitHub URL" 
                        name="github_url"
                        placeholder="https://github.com/company" 
                        value={formData.github_url} 
                        onChange={handleInputChange} 
                    />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between gap-3">
                 <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    onClick={() => {
                        setDeletePassword(""); // Reset password field
                        setIsDeleteOpen(true);
                    }}
                 >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                 </Button>

                 <div className="flex gap-3">
                    <Link to="/dashboard/employer/profile">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button className="font-bold" onClick={handleSubmit} isLoading={updateProfile.isPending}>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Account AlertDialog */}
      <AlertDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Company Account?"
        description="This action is permanent and will remove all job postings and candidate data. Please enter your password to confirm."
        confirmText="Yes, Delete Permanently"
        variant="danger"
        isLoading={deleteAccount.isPending}
      >
          <div className="relative mt-2">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type="password"
                className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-sm transition-all"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
            />
          </div>
      </AlertDialog>

      <VerificationModal 
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />
    </div>
  );
};
