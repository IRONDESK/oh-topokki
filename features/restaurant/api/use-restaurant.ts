import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteRestaurantInfo,
  getRestaurantCount,
  getRestaurantDetail,
  getRestaurantInfo,
  getRestaurantSearch,
  postRestaurantInfo,
  putRestaurantInfo,
} from "@/shared/api/naver-map";
import { RequestGetRestaurantParams } from "@/shared/api/model/common";
import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";

export const restaurantKeys = {
  all: ["restaurant"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (params: RequestGetRestaurantParams) =>
    [...restaurantKeys.lists(), params] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  searches: () => [...restaurantKeys.all, "search"] as const,
  search: (query: string) => [...restaurantKeys.searches(), query] as const,
  count: () => [...restaurantKeys.all, "count"] as const,
};

export const useRestaurantList = (
  params: RequestGetRestaurantParams,
  options?: { enabled?: boolean },
) =>
  useQuery({
    enabled: options?.enabled ?? true,
    queryKey: restaurantKeys.list(params),
    queryFn: () => getRestaurantInfo(params),
    staleTime: 60_000,
    // 지도 이동으로 좌표가 바뀌어도 새 데이터가 올 때까지 기존 마커 유지
    placeholderData: keepPreviousData,
  });

export const useRestaurantCount = () =>
  useQuery({
    queryKey: restaurantKeys.count(),
    queryFn: getRestaurantCount,
    staleTime: 60_000,
  });

export const useRestaurantDetail = (restaurantId: string) =>
  useQuery({
    enabled: !!restaurantId,
    queryKey: restaurantKeys.detail(restaurantId),
    queryFn: () => getRestaurantDetail({ restaurantId }),
    staleTime: 30_000,
  });

export const useRestaurantSearch = (query: string) =>
  useQuery({
    enabled: query.trim().length > 0,
    queryKey: restaurantKeys.search(query),
    queryFn: () => getRestaurantSearch({ query }),
    staleTime: 5 * 60_000,
  });

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RestaurantFormData) => postRestaurantInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { restaurantId: string; json: RestaurantFormData }) =>
      putRestaurantInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { restaurantId: string }) => deleteRestaurantInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
};
