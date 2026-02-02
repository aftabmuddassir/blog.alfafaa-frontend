import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { User } from "@/types";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: (id: string) => [...userKeys.all, "profile", id] as const,
  articles: (id: string) => [...userKeys.all, "articles", id] as const,
  followers: (id: string) => [...userKeys.all, "followers", id] as const,
  following: (id: string) => [...userKeys.all, "following", id] as const,
  interests: () => [...userKeys.all, "interests"] as const,
};

// Get user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

// Get user profile with stats
export function useUserProfile(id: string) {
  return useQuery({
    queryKey: userKeys.profile(id),
    queryFn: () => usersApi.getProfile(id),
    enabled: !!id,
  });
}

// Get user's articles
export function useUserArticles(
  id: string,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: [...userKeys.articles(id), params],
    queryFn: () => usersApi.getArticles(id, params),
    enabled: !!id,
  });
}

// Get user followers
export function useUserFollowers(
  id: string,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: [...userKeys.followers(id), params],
    queryFn: () => usersApi.getFollowers(id, params),
    enabled: !!id,
  });
}

// Get user following
export function useUserFollowing(
  id: string,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: [...userKeys.following(id), params],
    queryFn: () => usersApi.getFollowing(id, params),
    enabled: !!id,
  });
}

// Get user interests
export function useUserInterests() {
  return useQuery({
    queryKey: userKeys.interests(),
    queryFn: () => usersApi.getInterests(),
  });
}

// Follow user mutation
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.follow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
    },
  });
}

// Unfollow user mutation
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.unfollow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
    },
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Pick<User, "first_name" | "last_name" | "bio" | "avatar_url">>;
    }) => usersApi.updateProfile(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.profile(id) });
    },
  });
}

// Save interests mutation
export function useSaveInterests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryIds: string[]) => usersApi.saveInterests(categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.interests() });
    },
  });
}
