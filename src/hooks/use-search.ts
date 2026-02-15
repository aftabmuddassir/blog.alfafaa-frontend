import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchApi } from "@/lib/api";
import { SearchParams } from "@/types";

export const searchKeys = {
  all: ["search"] as const,
  query: (params: SearchParams) => ["search", params] as const,
};

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: searchKeys.query(params),
    queryFn: () => searchApi.search(params),
    enabled: params.q.length >= 2,
    placeholderData: keepPreviousData,
  });
}
