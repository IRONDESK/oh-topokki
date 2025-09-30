import { getNaverMapSearch, postRestaurantInfo } from "@/service/naver-map";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RestaurantFormData } from "@/components/restaurant/RestaurantForm";

export const useGetNaverMapSearch = (query: string) =>
  useQuery({
    enabled: !!query && query.trim().length > 0,
    queryKey: ["getNaverMapSearch", query.trim()],
    queryFn: () => getNaverMapSearch(query),
    staleTime: 1000,
  });

export const usePostRestaurantInfo = () =>
  useMutation({
    mutationFn: (data: RestaurantFormData) => postRestaurantInfo(data),
  });
