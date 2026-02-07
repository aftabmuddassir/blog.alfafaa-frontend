"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleCard, ArticleCardSkeleton } from "@/components/articles";
import {
  useUserProfile,
  useUserArticles,
  useFollowUser,
  useUnfollowUser,
} from "@/hooks";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { user: currentUser } = useAuthStore();
  const { data: profile, isLoading, isError } = useUserProfile(id);
  const { data: articlesData, isLoading: isArticlesLoading } = useUserArticles(
    id,
    { per_page: 10 }
  );

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const [activeTab, setActiveTab] = useState("articles");

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !profile) {
    notFound();
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const isFollowing = profile.is_following;

  const displayName =
    profile.first_name && profile.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile.username;

  const initials =
    profile.first_name && profile.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : profile.username[0];

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(profile.id);
        toast.success(`Unfollowed ${displayName}`);
      } else {
        await followMutation.mutateAsync(profile.id);
        toast.success(`Following ${displayName}`);
      }
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  const isFollowLoading =
    followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
          <AvatarImage src={profile.profile_image_url} />
          <AvatarFallback className="text-2xl sm:text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
            {!isOwnProfile && (
              <Button
                onClick={handleFollowToggle}
                variant={isFollowing ? "outline" : "default"}
                disabled={isFollowLoading}
                className="min-w-[100px]"
              >
                {isFollowLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            {isOwnProfile && (
              <Button variant="outline" asChild>
                <a href="/settings">Edit profile</a>
              </Button>
            )}
          </div>

          <p className="text-muted-foreground mb-4">@{profile.username}</p>

          {profile.bio && (
            <p className="text-foreground mb-4 max-w-lg">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
            <div>
              <span className="font-semibold">{profile.followers_count}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-semibold">{profile.following_count}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="articles"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Articles ({profile.articles_count})
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          {isArticlesLoading ? (
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : articlesData?.articles && articlesData.articles.length > 0 ? (
            <div className="space-y-0 divide-y">
              {articlesData.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "You haven't written any articles yet."
                  : `${displayName} hasn't written any articles yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" asChild>
                  <a href="/write">Write your first article</a>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="prose dark:prose-invert max-w-none">
            {profile.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "You haven't added a bio yet."
                  : `${displayName} hasn't added a bio yet.`}
              </p>
            )}

            <h3 className="mt-8 mb-4 text-lg font-semibold">Member since</h3>
            <p className="text-muted-foreground">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />

        <div className="flex-1 text-center sm:text-left">
          <Skeleton className="h-8 w-48 mb-3 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-24 mb-4 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-full max-w-md mb-4" />
          <div className="flex items-center justify-center sm:justify-start gap-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b mb-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Articles Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
