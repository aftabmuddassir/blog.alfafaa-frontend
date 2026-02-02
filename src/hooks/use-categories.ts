import { useQuery } from "@tanstack/react-query";
import { categoriesApi, tagsApi } from "@/lib/api";

// Query keys for categories
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (hierarchical: boolean) => [...categoryKeys.lists(), { hierarchical }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  articles: (slug: string) => [...categoryKeys.all, "articles", slug] as const,
};

// Query keys for tags
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  popular: () => [...tagKeys.all, "popular"] as const,
  articles: (slug: string) => [...tagKeys.all, "articles", slug] as const,
};

// Get all categories
export function useCategories(hierarchical = false) {
  return useQuery({
    queryKey: categoryKeys.list(hierarchical),
    queryFn: () => categoriesApi.list(hierarchical),
  });
}

// Get category by slug
export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Get articles by category
export function useCategoryArticles(
  slug: string,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: [...categoryKeys.articles(slug), params],
    queryFn: () => categoriesApi.getArticles(slug, params),
    enabled: !!slug,
  });
}

// Get all tags
export function useTags() {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: () => tagsApi.list(),
  });
}

// Get popular tags
export function usePopularTags(limit = 10) {
  return useQuery({
    queryKey: tagKeys.popular(),
    queryFn: () => tagsApi.popular(limit),
  });
}

// Get articles by tag
export function useTagArticles(
  slug: string,
  params?: { page?: number; per_page?: number }
) {
  return useQuery({
    queryKey: [...tagKeys.articles(slug), params],
    queryFn: () => tagsApi.getArticles(slug, params),
    enabled: !!slug,
  });
}
