"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { useDeleteComment } from "@/hooks/use-engagement";
import { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
  slug: string;
  currentUserId?: string;
}

export function CommentItem({ comment, slug, currentUserId }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteComment = useDeleteComment(slug);

  const authorName =
    comment.user.first_name && comment.user.last_name
      ? `${comment.user.first_name} ${comment.user.last_name}`
      : comment.user.username;

  const authorInitials =
    comment.user.first_name && comment.user.last_name
      ? `${comment.user.first_name[0]}${comment.user.last_name[0]}`
      : comment.user.username[0];

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  const isOwn = currentUserId === comment.user.id;

  const handleDelete = () => {
    deleteComment.mutate(comment.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.profile_image_url} />
          <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/profile/${comment.user.id}`}
            className="text-sm font-medium hover:underline"
          >
            {authorName}
          </Link>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Reply
          </Button>

          {isOwn && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
            </>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              autoFocus
              onSubmitted={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-2 border-l-2 border-muted">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                slug={slug}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
