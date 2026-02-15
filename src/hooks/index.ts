// Article hooks
export {
  articleKeys,
  useArticles,
  useInfiniteArticles,
  useInfiniteFeed,
  useArticle,
  useArticleById,
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

// Media hooks
export { useMediaUpload } from "./use-media-upload";

// Auto-save hook
export { useAutoSave } from "./use-auto-save";
export type { AutoSaveStatus } from "./use-auto-save";

// Engagement hooks
export {
  engagementKeys,
  useLikeStatus,
  useToggleLike,
  useToggleBookmark,
  useBookmarks,
  useComments,
  useCreateComment,
  useDeleteComment,
} from "./use-engagement";

// Notification hooks
export {
  notificationKeys,
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllRead,
  useNotificationBadge,
} from "./use-notifications";

// Search hooks
export { searchKeys, useSearch } from "./use-search";

// Utility hooks
export { useHydration } from "./use-hydration";
