"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bookmark } from "lucide-react";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles";
import { useBookmarks } from "@/hooks/use-engagement";
import { useAuthStore } from "@/stores";

export default function BookmarksPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { data, isLoading } = useBookmarks();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isAuthenticated) {
    return null;
  }

  const articles = data?.articles ?? [];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Your Bookmarks</h1>
      <p className="text-muted-foreground mb-8">
        Articles you&apos;ve saved for later
      </p>

      {isLoading ? (
        <div className="space-y-0 divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-0 divide-y">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-lg font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground">
            Start saving articles to read later by clicking the bookmark icon.
          </p>
        </div>
      )}
    </div>
  );
}
