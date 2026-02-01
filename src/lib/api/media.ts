import { apiClient } from "./client";
import { ApiResponse, Media } from "@/types";

export const mediaApi = {
  // Upload file
  upload: async (file: File, altText?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) {
      formData.append("alt_text", altText);
    }

    const response = await apiClient.post<ApiResponse<Media>>(
      "/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  // Get media by ID
  getById: async (id: string): Promise<Media> => {
    const response = await apiClient.get<ApiResponse<Media>>(`/media/${id}`);
    return response.data.data;
  },
};
