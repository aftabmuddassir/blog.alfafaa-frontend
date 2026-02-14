import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number) => ["notifications", "list", page] as const,
  unreadCount: () => ["notifications", "unread-count"] as const,
};

export function useNotifications(page = 1, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(page),
    queryFn: () => notificationsApi.getAll(page, 10),
    enabled,
    retry: false,
  });
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled,
    refetchInterval: 30000, // Poll every 30 seconds
    retry: false,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

// LinkedIn-style badge: counts notifications created AFTER the user last visited /notifications.
// "Seen" (badge clears on page visit) vs "Read" (highlight clears on click) are separate concepts.
const LAST_SEEN_KEY = "notifications-last-seen-at";

export function useNotificationBadge(enabled = true) {
  const [lastSeenAt, setLastSeenAt] = useState<string>("");
  const { data } = useNotifications(1, enabled);

  // Read from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setLastSeenAt(localStorage.getItem(LAST_SEEN_KEY) || "");
  }, []);

  const notifications = data?.notifications ?? [];

  const badgeCount = lastSeenAt
    ? notifications.filter(
        (n) => new Date(n.created_at) > new Date(lastSeenAt)
      ).length
    : notifications.length;

  // Call this when user visits the notifications page
  const markAsSeen = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(LAST_SEEN_KEY, now);
    setLastSeenAt(now);
  }, []);

  return { badgeCount, markAsSeen };
}
