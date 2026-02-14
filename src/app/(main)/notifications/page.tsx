"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notifications";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllRead,
  useNotificationBadge,
} from "@/hooks/use-notifications";
import { useAuthStore } from "@/stores";

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { data, isLoading } = useNotifications(1, isAuthenticated);
  const markAsRead = useMarkAsRead();
  const markAllRead = useMarkAllRead();
  const { markAsSeen } = useNotificationBadge(isAuthenticated);

  // Auth guard
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Mark badge as seen when visiting this page (clears bell badge)
  useEffect(() => {
    if (isAuthenticated) {
      markAsSeen();
    }
  }, [isAuthenticated, markAsSeen]);

  if (!isAuthenticated) {
    return null;
  }

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Separator className="mb-6" />

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="rounded-lg border overflow-hidden divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={(id) => markAsRead.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-lg font-semibold mb-2">No notifications yet</h2>
          <p className="text-muted-foreground">
            When someone likes, comments, or follows you, you&apos;ll see it here.
          </p>
        </div>
      )}
    </div>
  );
}
