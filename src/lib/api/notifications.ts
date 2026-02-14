import { apiClient } from "./client";
import { ApiResponse, Notification, PaginationMeta } from "@/types";

export const notificationsApi = {
  getAll: async (
    page = 1,
    per_page = 20
  ): Promise<{ notifications: Notification[]; meta: PaginationMeta }> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>(
      "/notifications",
      { params: { page, per_page } }
    );
    return {
      notifications: response.data.data,
      meta: response.data.meta!,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count"
    );
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.put("/notifications/read-all");
  },
};
