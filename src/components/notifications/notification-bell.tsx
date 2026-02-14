"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useNotificationBadge } from "@/hooks/use-notifications";

export function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const { badgeCount } = useNotificationBadge(isAuthenticated);

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <Bell className="h-5 w-5" />
        {badgeCount > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 text-[10px] font-medium bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </Link>
  );
}
