import { BadgeCheck } from "lucide-react";
import { cn } from "../../lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  showText?: boolean;
}

export const VerifiedBadge = ({ className, showText = false }: VerifiedBadgeProps) => {
  return (
    <div className={cn("inline-flex items-center gap-1 text-blue-600", className)}>
      <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
      {showText && <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>}
    </div>
  );
};
