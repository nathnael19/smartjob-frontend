interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  quote?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  };
  backgroundImage?: string;
}

export const AuthLayout = ({ children, title, subtitle, quote, backgroundImage }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Dark/Image section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Auth background" 
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Smart Job" className="h-16 w-auto brightness-0 invert" />
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              Find your next <span className="text-primary italic">dream job</span> with Smart Job.
            </h1>
            <p className="text-xl text-slate-300">
              Connect with over 10,000 top companies and take your career to the next level.
            </p>

            {quote && (
              <div className="mt-12 space-y-4 rounded-2xl bg-white/10 p-8 backdrop-blur-md">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-lg italic text-slate-100 leading-relaxed">
                  "{quote.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                    {quote.avatar ? (
                      <img src={quote.avatar} alt={quote.author} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/20 text-primary font-bold">
                        {quote.author[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{quote.author}</h4>
                    <p className="text-sm text-slate-400">{quote.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-slate-400">
            © 2026 Smart Job Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="flex w-full flex-col bg-white lg:w-1/2">
        <div className="flex flex-1 flex-col justify-center px-8 sm:px-12 lg:px-24">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
              <p className="text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
