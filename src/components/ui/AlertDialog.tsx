import { Button } from "./Button";
import { X, AlertTriangle } from "lucide-react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  children
}: AlertDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600"
  };

  const confirmButtonStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${variantStyles[variant]}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2 pt-1">
            <h3 className="text-xl font-bold text-slate-900 leading-none">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
            {children && (
              <div className="pt-2">
                {children}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="font-bold h-11 px-6"
          >
            {cancelText}
          </Button>
          <Button 
            className={`font-bold h-11 px-6 ${confirmButtonStyles[variant]}`} 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
