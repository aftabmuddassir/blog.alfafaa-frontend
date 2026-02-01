import { apiClient } from "./client";
import { ApiResponse, Category, ArticleCard, Tag, PaginationMeta } from "@/types";

export const categoriesApi = {
  // Get all categories
  list: async (hierarchical = false): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      "/categories",
      {
        params: { hierarchical },
      }
    );
    return response.data.data;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data.data;
  },

  // Get articles by category
  getArticles: async (
    slug: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ articles: ArticleCard[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      `/categories/${slug}/articles`,
      { params }
    );
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },
};

export const tagsApi = {
  // Get all tags
  list: async (): Promise<Tag[]> => {
    const response = await apiClient.get<ApiResponse<Tag[]>>("/tags");
    return response.data.data;
  },

  // Get popular tags
  popular: async (limit = 10): Promise<Tag[]> => {
    const response = await apiClient.get<ApiResponse<Tag[]>>("/tags/popular", {
      params: { limit },
    });
    return response.data.data;
  },

  // Get articles by tag
  getArticles: async (
    slug: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ articles: ArticleCard[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      `/tags/${slug}/articles`,
      { params }
    );
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },
};
