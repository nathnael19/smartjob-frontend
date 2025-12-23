import { useState } from "react";
import { Button } from "../ui/Button";
import { FileUp, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUploadLegalDocument } from "../../hooks/useApi";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal = ({ isOpen, onClose }: VerificationModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadLegalDocument();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF document to upload");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted for legal verification");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setIsSuccess(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-primary/5">
          <h2 className="text-xl font-bold text-slate-900">Company Verification</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-8">
          {!isSuccess ? (
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 leading-relaxed">
                  <p className="font-bold mb-1">Why verify your company?</p>
                  <p>Verified companies receive priority placement in searches and a 
                  <span className="font-bold"> Verified Badge</span> to build trust with candidates.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Legal Document (Only PDF)</label>
                <div 
                  className={`mt-2 border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                    file ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                  }`}
                >
                  <input 
                    type="file" 
                    id="legal-doc" 
                    className="hidden" 
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0] || null;
                        if (selectedFile && selectedFile.type !== "application/pdf") {
                            toast.error("Please select a PDF file");
                            return;
                        }
                        setFile(selectedFile);
                    }}
                    accept=".pdf"
                  />
                  <label htmlFor="legal-doc" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
                        file ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        <FileUp className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {file ? file.name : "Click to upload business license (PDF)"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF only, up to 10MB</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  className="w-full h-12 rounded-2xl text-base font-bold" 
                  type="submit" 
                  isLoading={uploadMutation.isPending}
                >
                  Submit for Review
                </Button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 py-2"
                >
                  Maybe Later
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-green-100">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Documents Received!</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">
                Our team will review your PDF business credentials within 48 business hours. You'll receive an email once verified.
              </p>
              <Button className="w-full h-12 rounded-2xl font-bold" onClick={onClose}>
                Got it
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
