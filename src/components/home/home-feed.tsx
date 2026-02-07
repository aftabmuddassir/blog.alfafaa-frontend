"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles";
import {
  useInfiniteArticles,
  useInfiniteFeed,
} from "@/hooks";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FeedTab = "for-you" | "following" | "trending";

export function HomeFeed() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<FeedTab>(
    isAuthenticated ? "for-you" : "trending"
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FeedTab)}
        className="w-full"
      >
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          {isAuthenticated && (
            <>
              <TabsTrigger
                value="for-you"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                For You
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                Following
              </TabsTrigger>
            </>
          )}
          <TabsTrigger
            value="trending"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Trending
          </TabsTrigger>
        </TabsList>

        {isAuthenticated && (
          <>
            <TabsContent value="for-you" className="mt-0">
              <PersonalizedFeed />
            </TabsContent>
            <TabsContent value="following" className="mt-0">
              <FollowingFeed />
            </TabsContent>
          </>
        )}
        <TabsContent value="trending" className="mt-0">
          <TrendingFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonalizedFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFeed({ per_page: 10 });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Failed to load articles. Please try again.
        </p>
      </div>
    );
  }

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold mb-2">Your feed is empty</h3>
        <p className="text-muted-foreground">
          Follow topics and writers to personalize your feed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {hasNextPage && (
        <div className="py-6 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function FollowingFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFeed({ per_page: 10 });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Failed to load articles. Please try again.
        </p>
      </div>
    );
  }

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
        <p className="text-muted-foreground">
          Follow writers to see their articles here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {hasNextPage && (
        <div className="py-6 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function TrendingFeed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles({ per_page: 10 });

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Failed to load articles. Please try again.
        </p>
      </div>
    );
  }

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
        <p className="text-muted-foreground">
          Be the first to write something!
        </p>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {hasNextPage && (
        <div className="py-6 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
