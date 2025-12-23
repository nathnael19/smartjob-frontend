import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40 transition-all duration-300 ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 space-y-1.5 ${className || ""}`}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`}>{children}</h3>
);

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-slate-500 ${className || ""}`}>{children}</p>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-8 ${className || ""}`}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 flex items-center ${className || ""}`}>{children}</div>
);
