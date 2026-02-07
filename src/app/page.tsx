"use client";

import { useAuthStore } from "@/stores";
import { useHydration, useStaffPicks, usePopularTags } from "@/hooks";
import { LandingPage } from "@/components/landing/landing-page";
import { HomeFeed } from "@/components/home/home-feed";
import { MainLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootPage() {
  const hydrated = useHydration();
  const { isAuthenticated } = useAuthStore();

  if (!hydrated) {
    return <RootSkeleton />;
  }

  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }

  return <LandingPage />;
}

function AuthenticatedHome() {
  const { data: staffPicks, isLoading: isStaffPicksLoading } = useStaffPicks();
  const { data: popularTags, isLoading: isTagsLoading } = usePopularTags(8);

  const rightSidebarContent = {
    staffPicks: staffPicks?.slice(0, 3).map((article) => ({
      id: article.id,
      title: article.title,
      author: {
        name:
          article.author.first_name && article.author.last_name
            ? `${article.author.first_name} ${article.author.last_name}`
            : article.author.username,
        avatar: article.author.profile_image_url,
      },
      slug: article.slug,
    })),
    topics: popularTags?.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  };

  return (
    <MainLayout
      rightSidebarContent={rightSidebarContent}
      isRightSidebarLoading={isStaffPicksLoading || isTagsLoading}
    >
      <HomeFeed />
    </MainLayout>
  );
}

function RootSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-9 rounded-md" />
            <Skeleton className="w-24 h-9 rounded-md" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-32 rounded-md" />
            <Skeleton className="h-12 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
