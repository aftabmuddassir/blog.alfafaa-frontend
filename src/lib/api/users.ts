import { apiClient } from "./client";
import {
  ApiResponse,
  User,
  UserProfile,
  ArticleCard,
  PaginationMeta,
} from "@/types";

interface UserArticlesResponse {
  articles: ArticleCard[];
  meta: PaginationMeta;
}

export const usersApi = {
  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Get user profile with social stats
  getProfile: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `/users/${id}/profile`
    );
    return response.data.data;
  },

  // Get user's articles
  getArticles: async (
    id: string,
    params?: { page?: number; per_page?: number }
  ): Promise<UserArticlesResponse> => {
    const response = await apiClient.get<ApiResponse<ArticleCard[]>>(
      `/users/${id}/articles`,
      { params }
    );
    return {
      articles: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Update own profile
  updateProfile: async (
    id: string,
    data: Partial<Pick<User, "first_name" | "last_name" | "bio" | "profile_image_url">>
  ): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },

  // Follow user
  follow: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/follow`);
  },

  // Unfollow user
  unfollow: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/unfollow`);
  },

  // Get followers
  getFollowers: async (
    id: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ users: User[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users/${id}/followers`,
      { params }
    );
    return {
      users: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Get following
  getFollowing: async (
    id: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ users: User[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users/${id}/following`,
      { params }
    );
    return {
      users: response.data.data,
      meta: response.data.meta!,
    };
  },

  // Save interests (category IDs)
  saveInterests: async (categoryIds: string[]): Promise<void> => {
    await apiClient.post("/users/interests", { category_ids: categoryIds });
  },

  // Get user interests
  getInterests: async (): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      "/users/interests"
    );
    return response.data.data;
  },
};
