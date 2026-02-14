"use client";

import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { useComments } from "@/hooks/use-engagement";
import { useAuthStore } from "@/stores";

interface CommentSectionProps {
  slug: string;
  commentsCount?: number;
}

export function CommentSection({ slug, commentsCount }: CommentSectionProps) {
  const { user } = useAuthStore();
  const { data, isLoading } = useComments(slug);
  const comments = data?.comments ?? [];

  return (
    <section id="comments" className="scroll-mt-20">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comments
        {(commentsCount ?? comments.length) > 0 && (
          <span className="text-muted-foreground font-normal">
            ({commentsCount ?? comments.length})
          </span>
        )}
      </h2>

      {/* Comment form */}
      <div className="mb-8">
        <CommentForm slug={slug} />
      </div>

      <Separator className="mb-6" />

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              currentUserId={user?.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  );
}
