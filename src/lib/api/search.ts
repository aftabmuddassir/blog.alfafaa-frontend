import { apiClient } from "./client";
import { ApiResponse, SearchParams, SearchResults } from "@/types";

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResults> => {
    const response = await apiClient.get<ApiResponse<SearchResults>>(
      "/search",
      { params }
    );
    return response.data.data;
  },
};
