import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "../../hooks/useAuthActions";
import { toast } from "react-hot-toast";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuthActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    forgotPassword.mutate(email);
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <RefreshCw className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Forgot password?</h2>
                <p className="mt-2 text-sm text-slate-500">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button 
                  className="w-full" 
                  size="lg" 
                  type="submit" 
                  disabled={forgotPassword.isPending}
                >
                  {forgotPassword.isPending ? "Sending..." : "Send reset link"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to log in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
