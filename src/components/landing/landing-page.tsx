import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Full width background, centered content */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">A</span>
            </div>
            <span className="font-semibold text-lg sm:text-xl tracking-tight">Alfafaa</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm sm:text-base">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-sm sm:text-base">
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section - Full width, centered content */}
        <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance">
                Stay curious.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover stories, thinking, and expertise from writers on any topic
                that matters to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 h-11 sm:h-12">
                    Start reading
                  </Button>
                </Link>
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 h-11 sm:h-12">
                    Start writing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Full width background, centered content */}
        <section className="w-full border-t bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Quality Content</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                  Thoughtfully curated articles from passionate writers across
                  diverse topics.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Growing Community</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                  Connect with like-minded readers and writers who share your
                  interests.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 rounded-xl bg-[#CCFBF1] flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Share Your Voice</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                  A beautiful writing experience to help you share your knowledge
                  and stories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 sm:py-16 md:py-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Ready to start your journey?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join thousands of readers and writers in our growing community.
              </p>
              <div className="pt-2 sm:pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="px-8 h-11 sm:h-12">
                    Create free account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Full width, centered content */}
      <footer className="w-full border-t py-6 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} Alfafaa Community. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                href="/about"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/help"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Help
              </Link>
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
