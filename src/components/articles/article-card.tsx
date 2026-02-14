"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkButton } from "@/components/engagement";
import { ArticleCard as ArticleCardType } from "@/types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleCardType;
  variant?: "default" | "compact";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const authorName =
    article.author.first_name && article.author.last_name
      ? `${article.author.first_name} ${article.author.last_name}`
      : article.author.username;

  const authorInitials =
    article.author.first_name && article.author.last_name
      ? `${article.author.first_name[0]}${article.author.last_name[0]}`
      : article.author.username[0];

  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : null;

  if (variant === "compact") {
    return (
      <article className="group">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={article.author.profile_image_url} />
            <AvatarFallback className="text-[10px]">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${article.author.id}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {authorName}
          </Link>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {publishedDate} · {article.reading_time_minutes} min read
        </p>
      </article>
    );
  }

  return (
    <article className="group py-6 first:pt-0 border-b last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/profile/${article.author.id}`} className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author.profile_image_url} />
                <AvatarFallback className="text-xs">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hover:underline">
                {authorName}
              </span>
            </Link>
            {publishedDate && (
              <span className="text-sm text-muted-foreground">
                · {publishedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/article/${article.slug}`}>
            <h2 className="text-lg sm:text-xl font-bold leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
          </Link>

          {/* Subtitle/excerpt */}
          {article.subtitle || article.excerpt ? (
            <Link href={`/article/${article.slug}`}>
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 mb-3">
                {article.subtitle || article.excerpt}
              </p>
            </Link>
          ) : null}

          {/* Meta row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {article.categories?.[0] && (
                <Link href={`/category/${article.categories[0].slug}`}>
                  <Badge
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                  >
                    {article.categories[0].name}
                  </Badge>
                </Link>
              )}
              <span className="text-xs text-muted-foreground">
                {article.reading_time_minutes} min read
              </span>
            </div>

            {/* Bookmark button */}
            <BookmarkButton slug={article.slug} />
          </div>
        </div>

        {/* Thumbnail */}
        {article.featured_image_url && (
          <Link
            href={`/article/${article.slug}`}
            className="flex-shrink-0 hidden xs:block"
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-28 rounded-lg overflow-hidden bg-muted">
              <Image
                src={article.featured_image_url}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
}

// Skeleton loader for article card
export function ArticleCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
    );
  }

  return (
    <div className="py-6 first:pt-0 border-b last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full mb-1" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="hidden xs:block w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-28 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}
