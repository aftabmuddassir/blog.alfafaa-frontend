"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useToggleBookmark } from "@/hooks/use-engagement";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  initialBookmarked?: boolean;
  variant?: "icon" | "icon-text";
}

export function BookmarkButton({
  slug,
  initialBookmarked = false,
  variant = "icon",
}: BookmarkButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const toggleBookmark = useToggleBookmark(slug);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    toggleBookmark.mutate(bookmarked, {
      onError: () => {
        setBookmarked(bookmarked);
      },
    });
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={handleClick}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors duration-200",
            bookmarked && "fill-current text-foreground"
          )}
        />
        <span className="sr-only">
          {bookmarked ? "Remove bookmark" : "Bookmark"}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5"
      onClick={handleClick}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          bookmarked && "fill-current"
        )}
      />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </Button>
  );
}
