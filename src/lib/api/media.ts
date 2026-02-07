import { apiClient } from "./client";
import { ApiResponse, Media } from "@/types";

export const mediaApi = {
  // Upload file via Cloudinary (through Next.js API route)
  upload: async (file: File, altText?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) {
      formData.append("alt_text", altText);
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const result = await response.json();
    return result.data as Media;
  },

  // Get media by ID
  getById: async (id: string): Promise<Media> => {
    const response = await apiClient.get<ApiResponse<Media>>(`/media/${id}`);
    return response.data.data;
  },
};
