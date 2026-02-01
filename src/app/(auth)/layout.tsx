import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header - Responsive */}
      <header className="py-4 sm:py-6 px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">A</span>
            </div>
            <span className="font-semibold text-lg sm:text-xl tracking-tight">Alfafaa</span>
          </Link>
        </div>
      </header>

      {/* Main Content - Centered and Responsive */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-[420px] sm:max-w-md">
          {children}
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="py-4 sm:py-6 px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Alfafaa Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
