import { apiClient } from "./client";
import {
  ApiResponse,
  Article,
  ArticleCard,
  CreateArticleData,
  UpdateArticleData,
  PaginationMeta,
} from "@/types";

interface ArticleListParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
}

interface ArticleListResponse {
  articles: ArticleCard[];
  meta: PaginationMeta;
}

export const articlesApi = {
  // Get articles list
  list: async (params?: ArticleListParams): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>("/articles", {
      params,
    });
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Get single article by slug
  getBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get<ApiResponse<Article>>(
      `/articles/${slug}`
    );
    return response.data.data;
  },

  // Create new article
  create: async (data: CreateArticleData): Promise<Article> => {
    const response = await apiClient.post<ApiResponse<Article>>(
      "/articles",
      data
    );
    return response.data.data;
  },

  // Update article
  update: async ({ id, ...data }: UpdateArticleData): Promise<Article> => {
    const response = await apiClient.put<ApiResponse<Article>>(
      `/articles/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete article
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },

  // Get trending articles
  trending: async (limit = 10): Promise<ArticleCard[]> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      "/articles/trending",
      { params: { limit } }
    );
    return response.data.data;
  },

  // Get recent articles
  recent: async (limit = 10): Promise<ArticleCard[]> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      "/articles/recent",
      { params: { limit } }
    );
    return response.data.data;
  },

  // Get staff picks
  staffPicks: async (): Promise<ArticleCard[]> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      "/articles/staff-picks"
    );
    return response.data.data;
  },

  // Get personalized feed (requires auth)
  feed: async (params?: ArticleListParams): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      "/articles/feed",
      { params }
    );
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Get related articles
  related: async (slug: string, limit = 5): Promise<ArticleCard[]> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      `/articles/${slug}/related`,
      { params: { limit } }
    );
    return response.data.data;
  },
};
