import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { likesApi, bookmarksApi, commentsApi } from "@/lib/api";
import { CreateCommentData, Article, LikeStatus, Comment } from "@/types";
import { toast } from "sonner";
import { articleKeys } from "./use-articles";

// Query keys
export const engagementKeys = {
  likes: (slug: string) => ["engagement", "likes", slug] as const,
  bookmarks: {
    all: ["bookmarks"] as const,
    list: (page: number) => ["bookmarks", "list", page] as const,
  },
  comments: (slug: string) => ["comments", slug] as const,
};

// ─── Likes ───

export function useLikeStatus(slug: string) {
  return useQuery({
    queryKey: engagementKeys.likes(slug),
    queryFn: () => likesApi.getStatus(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useToggleLike(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (currentlyLiked) {
        return likesApi.unlike(slug);
      }
      return likesApi.like(slug);
    },
    onMutate: async (currentlyLiked) => {
      await queryClient.cancelQueries({
        queryKey: engagementKeys.likes(slug),
      });

      const previousStatus = queryClient.getQueryData<LikeStatus>(
        engagementKeys.likes(slug)
      );

      // Optimistic update
      queryClient.setQueryData<LikeStatus>(engagementKeys.likes(slug), (old) => ({
        liked: !currentlyLiked,
        likes_count: (old?.likes_count ?? 0) + (currentlyLiked ? -1 : 1),
      }));

      // Also update the article detail cache
      const articleData = queryClient.getQueryData<Article>(
        articleKeys.detail(slug)
      );
      if (articleData) {
        queryClient.setQueryData<Article>(articleKeys.detail(slug), {
          ...articleData,
          user_liked: !currentlyLiked,
          likes_count: (articleData.likes_count ?? 0) + (currentlyLiked ? -1 : 1),
        });
      }

      return { previousStatus, articleData };
    },
    onError: (_err, _currentlyLiked, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(
          engagementKeys.likes(slug),
          context.previousStatus
        );
      }
      if (context?.articleData) {
        queryClient.setQueryData(
          articleKeys.detail(slug),
          context.articleData
        );
      }
      toast.error("Failed to update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: engagementKeys.likes(slug),
      });
    },
  });
}

// ─── Bookmarks ───

export function useToggleBookmark(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currentlyBookmarked: boolean) => {
      if (currentlyBookmarked) {
        return bookmarksApi.unbookmark(slug);
      }
      return bookmarksApi.bookmark(slug);
    },
    onMutate: async (currentlyBookmarked) => {
      const articleData = queryClient.getQueryData<Article>(
        articleKeys.detail(slug)
      );
      if (articleData) {
        queryClient.setQueryData<Article>(articleKeys.detail(slug), {
          ...articleData,
          user_bookmarked: !currentlyBookmarked,
        });
      }
      return { articleData };
    },
    onSuccess: (_data, currentlyBookmarked) => {
      if (currentlyBookmarked) {
        toast.success("Removed from bookmarks");
      } else {
        toast.success("Article saved");
      }
      queryClient.invalidateQueries({
        queryKey: engagementKeys.bookmarks.all,
      });
    },
    onError: (_err, _currentlyBookmarked, context) => {
      if (context?.articleData) {
        queryClient.setQueryData(
          articleKeys.detail(slug),
          context.articleData
        );
      }
      toast.error("Failed to update bookmark");
    },
  });
}

export function useBookmarks(page = 1) {
  return useQuery({
    queryKey: engagementKeys.bookmarks.list(page),
    queryFn: () => bookmarksApi.getAll(page),
    retry: false,
  });
}

// ─── Comments ───

export function useComments(slug: string) {
  return useQuery({
    queryKey: engagementKeys.comments(slug),
    queryFn: () => commentsApi.getAll(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useCreateComment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentsApi.create(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: engagementKeys.comments(slug),
      });
      // Update article comment count
      const articleData = queryClient.getQueryData<Article>(
        articleKeys.detail(slug)
      );
      if (articleData) {
        queryClient.setQueryData<Article>(articleKeys.detail(slug), {
          ...articleData,
          comments_count: (articleData.comments_count ?? 0) + 1,
        });
      }
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });
}

export function useDeleteComment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(slug, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: engagementKeys.comments(slug),
      });

      const previousComments = queryClient.getQueryData<{
        comments: Comment[];
      }>(engagementKeys.comments(slug));

      // Optimistic removal
      if (previousComments) {
        queryClient.setQueryData(engagementKeys.comments(slug), {
          ...previousComments,
          comments: previousComments.comments.filter((c) => c.id !== commentId),
        });
      }

      return { previousComments };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          engagementKeys.comments(slug),
          context.previousComments
        );
      }
      toast.error("Failed to delete comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: engagementKeys.comments(slug),
      });
    },
  });
}
