"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores";
import { useCreateComment } from "@/hooks/use-engagement";

interface CommentFormProps {
  slug: string;
  parentId?: string;
  onSubmitted?: () => void;
  autoFocus?: boolean;
}

export function CommentForm({
  slug,
  parentId,
  onSubmitted,
  autoFocus = false,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [content, setContent] = useState("");
  const createComment = useCreateComment(slug);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>{" "}
        to join the conversation
      </div>
    );
  }

  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || user.username?.[0] || "U"}`
    : "U";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    createComment.mutate(
      { content: trimmed, parent_id: parentId },
      {
        onSuccess: () => {
          setContent("");
          onSubmitted?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarImage src={user?.profile_image_url} />
        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder={parentId ? "Write a reply..." : "What are your thoughts?"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="resize-none"
          autoFocus={autoFocus}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || createComment.isPending}
            className="gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {createComment.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
