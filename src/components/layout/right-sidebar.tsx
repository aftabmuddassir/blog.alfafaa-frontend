"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Types for the sidebar content
interface StaffPick {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  slug: string;
}

interface RecommendedTopic {
  id: string;
  name: string;
  slug: string;
}

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface RightSidebarProps {
  staffPicks?: StaffPick[];
  topics?: RecommendedTopic[];
  suggestedUsers?: SuggestedUser[];
  isLoading?: boolean;
}

export function RightSidebar({
  staffPicks = [],
  topics = [],
  suggestedUsers = [],
  isLoading = false,
}: RightSidebarProps) {
  if (isLoading) {
    return (
      <aside className="hidden xl:block w-80 flex-shrink-0">
        <div className="sticky top-20 space-y-6 p-4">
          <RightSidebarSkeleton />
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-20 space-y-6 p-4">
        {/* Staff Picks */}
        {staffPicks.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold mb-4">Staff Picks</h3>
            <div className="space-y-4">
              {staffPicks.map((pick) => (
                <article key={pick.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={pick.author.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {pick.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {pick.author.name}
                    </span>
                  </div>
                  <Link href={`/article/${pick.slug}`}>
                    <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {pick.title}
                    </h4>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Topics */}
        {topics.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold mb-4">Recommended Topics</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Link key={topic.id} href={`/topic/${topic.slug}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    {topic.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Who to Follow */}
        {suggestedUsers.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold mb-4">Who to follow</h3>
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-start gap-3">
                  <Link href={`/profile/${user.id}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.id}`}>
                      <p className="text-sm font-medium truncate hover:underline">
                        {user.name}
                      </p>
                    </Link>
                    {user.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs flex-shrink-0"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Links */}
        <footer className="pt-4 border-t">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Link href="/help" className="hover:text-foreground">
              Help
            </Link>
            <Link href="/status" className="hover:text-foreground">
              Status
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/careers" className="hover:text-foreground">
              Careers
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </aside>
  );
}

function RightSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Staff Picks skeleton */}
      <section>
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Topics skeleton */}
      <section>
        <Skeleton className="h-4 w-36 mb-4" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </section>

      {/* Who to follow skeleton */}
      <section>
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
