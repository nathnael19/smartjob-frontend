import { Link, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Mail, ArrowLeft, ExternalLink, Info } from "lucide-react";

export const CheckInboxPage = () => {
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  const handleOpenGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-8 flex items-center gap-2 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-white">J</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">Smart Job</span>
          </Link>

          <Card className="w-full">
            <CardContent className="pt-10">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Check your inbox</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
                  Please click the link to verify your account and access thousands of jobs.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Button className="w-full" size="lg" onClick={handleOpenGmail}>
                  Open Gmail App <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Didn't receive the email?{" "}
                  <button className="font-semibold text-primary hover:underline">
                    Click to resend
                  </button>
                </p>

                <div className="mt-8 flex items-start gap-3 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <Info className="h-5 w-5 text-slate-400 shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Can't find it? Please check your spam or junk folder as the email might have landed there.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
