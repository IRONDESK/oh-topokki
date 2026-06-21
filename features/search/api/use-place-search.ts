import { useQuery } from "@tanstack/react-query";

import { getNaverMapSearch } from "@/shared/api/naver-map";

export const placeSearchKeys = {
  all: ["place-search"] as const,
  search: (query: string) => [...placeSearchKeys.all, query.trim()] as const,
};

export const useNaverPlaceSearch = (query: string) =>
  useQuery({
    enabled: query.trim().length > 0,
    queryKey: placeSearchKeys.search(query),
    queryFn: () => getNaverMapSearch(query),
    staleTime: 5 * 60_000,
  });
