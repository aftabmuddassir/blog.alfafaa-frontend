import { apiClient } from "./client";
import {
  ApiResponse,
  ArticleCard,
  Comment,
  CreateCommentData,
  LikeStatus,
  BookmarkStatus,
  PaginationMeta,
} from "@/types";

// Likes API
export const likesApi = {
  like: async (slug: string): Promise<LikeStatus> => {
    const response = await apiClient.post<ApiResponse<LikeStatus>>(
      `/articles/${slug}/like`
    );
    return response.data.data;
  },

  unlike: async (slug: string): Promise<LikeStatus> => {
    const response = await apiClient.delete<ApiResponse<LikeStatus>>(
      `/articles/${slug}/like`
    );
    return response.data.data;
  },

  getStatus: async (slug: string): Promise<LikeStatus> => {
    const response = await apiClient.get<ApiResponse<LikeStatus>>(
      `/articles/${slug}/like`
    );
    return response.data.data;
  },
};

// Bookmarks API
export const bookmarksApi = {
  bookmark: async (slug: string): Promise<BookmarkStatus> => {
    const response = await apiClient.post<ApiResponse<BookmarkStatus>>(
      `/articles/${slug}/bookmark`
    );
    return response.data.data;
  },

  unbookmark: async (slug: string): Promise<BookmarkStatus> => {
    const response = await apiClient.delete<ApiResponse<BookmarkStatus>>(
      `/articles/${slug}/bookmark`
    );
    return response.data.data;
  },

  getAll: async (
    page = 1,
    per_page = 20
  ): Promise<{ articles: ArticleCard[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      "/users/bookmarks",
      { params: { page, per_page } }
    );
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },
};

// Comments API
export const commentsApi = {
  getAll: async (
    slug: string,
    page = 1,
    per_page = 20
  ): Promise<{ comments: Comment[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/articles/${slug}/comments`,
      { params: { page, per_page } }
    );
    return {
      comments: response.data.data,
      meta: response.data.meta!,
    };
  },

  create: async (slug: string, data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/articles/${slug}/comments`,
      data
    );
    return response.data.data;
  },

  update: async (
    slug: string,
    commentId: string,
    content: string
  ): Promise<Comment> => {
    const response = await apiClient.put<ApiResponse<Comment>>(
      `/articles/${slug}/comments/${commentId}`,
      { content }
    );
    return response.data.data;
  },

  delete: async (slug: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/articles/${slug}/comments/${commentId}`);
  },
};
