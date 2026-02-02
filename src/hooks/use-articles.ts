import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import { CreateArticleData, UpdateArticleData } from "@/types";

// Query keys
export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  feed: () => [...articleKeys.all, "feed"] as const,
  trending: () => [...articleKeys.all, "trending"] as const,
  recent: () => [...articleKeys.all, "recent"] as const,
  staffPicks: () => [...articleKeys.all, "staff-picks"] as const,
  related: (slug: string) => [...articleKeys.all, "related", slug] as const,
};

// Get articles list
export function useArticles(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: articleKeys.list(params || {}),
    queryFn: () => articlesApi.list(params),
  });
}

// Get articles with infinite scroll
export function useInfiniteArticles(params?: {
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  return useInfiniteQuery({
    queryKey: articleKeys.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      articlesApi.list({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.meta;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Get personalized feed with infinite scroll
export function useInfiniteFeed(params?: { per_page?: number }) {
  return useInfiniteQuery({
    queryKey: [...articleKeys.feed(), params],
    queryFn: ({ pageParam = 1 }) =>
      articlesApi.feed({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.meta;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Get single article by slug
export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articlesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Get trending articles
export function useTrendingArticles(limit = 10) {
  return useQuery({
    queryKey: articleKeys.trending(),
    queryFn: () => articlesApi.trending(limit),
  });
}

// Get recent articles
export function useRecentArticles(limit = 10) {
  return useQuery({
    queryKey: articleKeys.recent(),
    queryFn: () => articlesApi.recent(limit),
  });
}

// Get staff picks
export function useStaffPicks() {
  return useQuery({
    queryKey: articleKeys.staffPicks(),
    queryFn: () => articlesApi.staffPicks(),
  });
}

// Get related articles
export function useRelatedArticles(slug: string, limit = 5) {
  return useQuery({
    queryKey: articleKeys.related(slug),
    queryFn: () => articlesApi.related(slug, limit),
    enabled: !!slug,
  });
}

// Create article mutation
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleData) => articlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.feed() });
    },
  });
}

// Update article mutation
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateArticleData) => articlesApi.update(data),
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: articleKeys.detail(updatedArticle.slug),
      });
    },
  });
}

// Delete article mutation
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.feed() });
    },
  });
}
