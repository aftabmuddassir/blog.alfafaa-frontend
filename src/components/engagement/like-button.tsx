"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useToggleLike } from "@/hooks/use-engagement";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  slug: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function LikeButton({
  slug,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const toggleLike = useToggleLike(slug);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => prev + (newLiked ? 1 : -1));

    if (newLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    toggleLike.mutate(liked, {
      onError: () => {
        // Rollback local state on error
        setLiked(liked);
        setCount((prev) => prev + (newLiked ? -1 : 1));
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5"
      onClick={handleClick}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          liked && "fill-red-500 text-red-500",
          isAnimating && "scale-125"
        )}
      />
      {count > 0 && (
        <span className={cn("text-sm", liked && "text-red-500")}>{count}</span>
      )}
    </Button>
  );
}
