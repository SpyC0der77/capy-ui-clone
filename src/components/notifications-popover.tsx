"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  CheckCheck,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  type Notification,
  type NotificationType,
} from "@/contexts/notifications-context";

const notificationIcons: Record<NotificationType, typeof Plus> = {
  task_created: Plus,
  task_updated: Pencil,
  task_completed: Check,
  task_deleted: Trash2,
};

const notificationColors: Record<NotificationType, string> = {
  task_created: "bg-blue-500/10 text-blue-500",
  task_updated: "bg-amber-500/10 text-amber-500",
  task_completed: "bg-green-500/10 text-green-500",
  task_deleted: "bg-red-500/10 text-red-500",
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onClear,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onClear: () => void;
}) {
  const Icon = notificationIcons[notification.type];
  const colorClass = notificationColors[notification.type];

  return (
    <div
      className={cn(
        "group relative flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
      onClick={onMarkAsRead}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          colorClass
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium leading-tight",
              !notification.read && "text-foreground",
              notification.read && "text-muted-foreground"
            )}
          >
            {notification.title}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <X className="size-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {formatTimestamp(notification.timestamp)}
        </p>
      </div>
      {!notification.read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary" />
      )}
    </div>
  );
}

interface NotificationsPopoverProps {
  collapsed?: boolean;
}

export function NotificationsPopover({ collapsed }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useNotifications();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative size-7",
            collapsed && "size-8"
          )}
        >
          <Bell className="size-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={collapsed ? "center" : "end"}
        side={collapsed ? "right" : "bottom"}
      >
        <div className="flex items-center justify-between p-3 pb-2">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="size-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={clearAllNotifications}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <Bell className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No notifications
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onClear={() => clearNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
