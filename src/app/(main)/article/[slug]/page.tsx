"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  Share2,
  MoreHorizontal,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArticleCard } from "@/components/articles";
import { EngagementBar, CommentSection, BookmarkButton } from "@/components/engagement";
import { useArticle, useRelatedArticles, useUserArticles } from "@/hooks";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params);
  const { data: article, isLoading, isError } = useArticle(slug);
  const { data: relatedArticles } = useRelatedArticles(slug, 3);
  const { user: currentUser } = useAuthStore();

  const authorId = article?.author?.id;
  const { data: moreFromAuthor } = useUserArticles(authorId || "", {
    per_page: 3,
  });

  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  if (isError || !article) {
    notFound();
  }

  const authorName =
    article.author.first_name && article.author.last_name
      ? `${article.author.first_name} ${article.author.last_name}`
      : article.author.username;

  const authorInitials =
    article.author.first_name && article.author.last_name
      ? `${article.author.first_name[0]}${article.author.last_name[0]}`
      : article.author.username[0];

  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMM d, yyyy")
    : null;

  const handleShare = async (platform: "twitter" | "facebook" | "copy") => {
    const url = window.location.href;
    const title = article.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        break;
    }
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero Image */}
      {article.featured_image_url && (
        <div className="relative w-full aspect-[2/1] mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-xl text-muted-foreground mb-6">
            {article.subtitle}
          </p>
        )}

        {/* Author row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${article.author.id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author.profile_image_url} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${article.author.id}`}
                  className="font-medium hover:underline"
                >
                  {authorName}
                </Link>
                {currentUser?.id !== article.author.id && (
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {publishedDate && <span>{publishedDate}</span>}
                <span>·</span>
                <span>{article.reading_time_minutes} min read</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <BookmarkButton slug={slug} initialBookmarked={article.user_bookmarked} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Mute author</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Article Content */}
      <div
        className="prose-article prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Engagement Bar */}
      <div className="mb-8">
        <EngagementBar
          article={article}
          variant="sticky"
          onCommentClick={() => {
            document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      <Separator className="mb-8" />

      {/* Author Bio Card */}
      <div className="bg-muted/50 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Link href={`/profile/${article.author.id}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.profile_image_url} />
              <AvatarFallback className="text-lg">{authorInitials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/profile/${article.author.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {authorName}
              </Link>
              {currentUser?.id !== article.author.id && (
                <Button size="sm">Follow</Button>
              )}
            </div>
            {article.author.bio && (
              <p className="text-muted-foreground">{article.author.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* More from Author */}
      {moreFromAuthor?.articles &&
        moreFromAuthor.articles.filter((a) => a.id !== article.id).length >
          0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              More from {authorName}
            </h2>
            <div className="space-y-0 divide-y">
              {moreFromAuthor.articles
                .filter((a) => a.id !== article.id)
                .slice(0, 3)
                .map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                  />
                ))}
            </div>
          </section>
        )}

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
          <div className="space-y-0 divide-y">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <Separator className="mb-8" />
      <CommentSection slug={slug} commentsCount={article.comments_count} />
    </article>
  );
}

function ArticlePageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero image skeleton */}
      <Skeleton className="w-full aspect-[2/1] mb-8 rounded-lg" />

      {/* Title skeleton */}
      <Skeleton className="h-12 w-full mb-2" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-6 w-full mb-6" />

      {/* Author row skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Skeleton className="h-px w-full mb-8" />

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
