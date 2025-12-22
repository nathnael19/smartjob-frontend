import { Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Smart Job" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Smart Job is the leading platform for connecting tailored talent with forward-thinking companies.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary">Find Jobs</a></li>
              <li><a href="#" className="hover:text-primary">Browse Categories</a></li>
              <li><a href="#" className="hover:text-primary">Salary Tools</a></li>
              <li><a href="#" className="hover:text-primary">Career Advice</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Employers</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary">Post a Job</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">Resource Center</a></li>
              <li><a href="#" className="hover:text-primary">Hiring Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 md:flex-row">
          <p className="text-xs text-slate-400">
            © 2026 Smart Job, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-primary"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="text-slate-400 hover:text-primary"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
