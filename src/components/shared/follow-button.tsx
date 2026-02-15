"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFollowUser, useUnfollowUser } from "@/hooks/use-users";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "default";
  className?: string;
}

export function FollowButton({
  userId,
  isFollowing: initialFollowing = false,
  variant = "default",
  size = "default",
  className,
}: FollowButtonProps) {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isHovered, setIsHovered] = useState(false);

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  // Don't render if viewing own profile
  if (currentUser?.id === userId) {
    return null;
  }

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(userId);
        setIsFollowing(false);
      } else {
        await followMutation.mutateAsync(userId);
        setIsFollowing(true);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const showUnfollow = isFollowing && isHovered;

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={cn(
        "transition-all",
        showUnfollow && "border-destructive text-destructive hover:bg-destructive/10",
        size === "sm" && "h-7 text-xs",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
    >
      {isPending
        ? "..."
        : showUnfollow
          ? "Unfollow"
          : isFollowing
            ? "Following"
            : "Follow"}
    </Button>
  );
}
