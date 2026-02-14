"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, UserPlus, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

const typeIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  article: FileText,
};

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = typeIcons[notification.type];
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const actorInitials =
    notification.actor.first_name && notification.actor.last_name
      ? `${notification.actor.first_name[0]}${notification.actor.last_name[0]}`
      : notification.actor.username[0];

  const href = notification.article
    ? `/article/${notification.article.slug}`
    : `/profile/${notification.actor.id}`;

  const handleClick = () => {
    if (!notification.read) {
      onRead?.(notification.id);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.actor.profile_image_url} />
          <AvatarFallback className="text-xs">{actorInitials}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background flex items-center justify-center">
          <Icon className="h-2.5 w-2.5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{notification.message}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
      </div>

      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </Link>
  );
}
