"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles/article-card";
import { useSearch } from "@/hooks/use-search";
import { SearchParams } from "@/types";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageFallback() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-12 w-full mb-8" />
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialType = (searchParams.get("type") as SearchParams["type"]) || "all";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "categories" | "tags">(initialType || "all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Update URL when search params change
  useEffect(() => {
    if (debouncedQuery) {
      const params = new URLSearchParams();
      params.set("q", debouncedQuery);
      if (activeTab !== "all") params.set("type", activeTab);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, activeTab, router]);

  const { data: results, isLoading } = useSearch({
    q: debouncedQuery,
    type: activeTab as SearchParams["type"],
  });

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "all" | "articles" | "categories" | "tags");
  }, []);

  const hasResults =
    (results?.articles && results.articles.length > 0) ||
    (results?.categories && results.categories.length > 0) ||
    (results?.tags && results.tags.length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search articles, categories, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results */}
      {debouncedQuery.length >= 2 ? (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <SearchSkeleton tab={activeTab} />
          ) : !hasResults ? (
            <EmptyState query={debouncedQuery} />
          ) : (
            <>
              <TabsContent value="all">
                <AllResults results={results} />
              </TabsContent>
              <TabsContent value="articles">
                <ArticlesResults articles={results?.articles} />
              </TabsContent>
              <TabsContent value="categories">
                <CategoriesResults categories={results?.categories} />
              </TabsContent>
              <TabsContent value="tags">
                <TagsResults tags={results?.tags} />
              </TabsContent>
            </>
          )}
        </Tabs>
      ) : query.length > 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Type at least 2 characters to search
        </p>
      ) : (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-lg font-semibold mb-2">Search Alfafaa</h2>
          <p className="text-muted-foreground">
            Find articles, categories, and tags across the platform.
          </p>
        </div>
      )}
    </div>
  );
}

function AllResults({
  results,
}: {
  results?: { articles?: any[]; categories?: any[]; tags?: any[] };
}) {
  return (
    <div className="space-y-8">
      {results?.articles && results.articles.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Articles
          </h3>
          <div className="divide-y">
            {results.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {results?.categories && results.categories.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Categories
          </h3>
          <CategoriesResults categories={results.categories} />
        </section>
      )}

      {results?.tags && results.tags.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Tags
          </h3>
          <TagsResults tags={results.tags} />
        </section>
      )}
    </div>
  );
}

function ArticlesResults({ articles }: { articles?: any[] }) {
  if (!articles || articles.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No articles found.
      </p>
    );
  }

  return (
    <div className="divide-y">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function CategoriesResults({ categories }: { categories?: any[] }) {
  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No categories found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <h4 className="font-medium">{category.name}</h4>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

function TagsResults({ tags }: { tags?: any[] }) {
  if (!tags || tags.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No tags found.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link key={tag.id} href={`/tag/${tag.slug}`}>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary/80"
          >
            {tag.name}
            {tag.articles_count != null && (
              <span className="ml-1.5 text-muted-foreground">
                ({tag.articles_count})
              </span>
            )}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <Search className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h2 className="text-lg font-semibold mb-2">No results found</h2>
      <p className="text-muted-foreground">
        No results found for &ldquo;{query}&rdquo;. Try a different search term.
      </p>
    </div>
  );
}

function SearchSkeleton({ tab }: { tab: string }) {
  if (tab === "tags") {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  if (tab === "categories") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
