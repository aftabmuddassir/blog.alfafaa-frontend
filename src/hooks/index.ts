// Article hooks
export {
  articleKeys,
  useArticles,
  useInfiniteArticles,
  useInfiniteFeed,
  useArticle,
  useTrendingArticles,
  useRecentArticles,
  useStaffPicks,
  useRelatedArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from "./use-articles";

// User hooks
export {
  userKeys,
  useUser,
  useUserProfile,
  useUserArticles,
  useUserFollowers,
  useUserFollowing,
  useUserInterests,
  useFollowUser,
  useUnfollowUser,
  useUpdateProfile,
  useSaveInterests,
} from "./use-users";

// Category and tag hooks
export {
  categoryKeys,
  tagKeys,
  useCategories,
  useCategory,
  useCategoryArticles,
  useTags,
  usePopularTags,
  useTagArticles,
} from "./use-categories";

// Utility hooks
export { useHydration } from "./use-hydration";
