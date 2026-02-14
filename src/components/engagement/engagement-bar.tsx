"use client";

import {
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LikeButton } from "./like-button";
import { BookmarkButton } from "./bookmark-button";
import { toast } from "sonner";
import { Article } from "@/types";
import { cn } from "@/lib/utils";

interface EngagementBarProps {
  article: Article;
  variant?: "sticky" | "inline";
  onCommentClick?: () => void;
}

export function EngagementBar({
  article,
  variant = "sticky",
  onCommentClick,
}: EngagementBarProps) {
  const handleShare = async (platform: "twitter" | "facebook" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
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
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        variant === "sticky" &&
          "sticky bottom-4 py-3 px-6 bg-background/95 backdrop-blur border rounded-full shadow-lg max-w-fit mx-auto"
      )}
    >
      <LikeButton
        slug={article.slug}
        initialLiked={article.user_liked}
        initialCount={article.likes_count}
      />

      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={onCommentClick}
      >
        <MessageCircle className="h-4 w-4" />
        {(article.comments_count ?? 0) > 0 && (
          <span>{article.comments_count}</span>
        )}
      </Button>

      <BookmarkButton
        slug={article.slug}
        initialBookmarked={article.user_bookmarked}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleShare("twitter")}>
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("facebook")}>
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("copy")}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
