import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteRestaurantReview,
  getMyReviews,
  getRestaurantReview,
  postRestaurantReview,
  putRestaurantReview,
} from "@/shared/api/naver-map";
import { ResponseReview } from "@/shared/api/model/restaurant";
import { restaurantKeys } from "@/features/restaurant/api/use-restaurant";

export const reviewKeys = {
  all: ["review"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (restaurantId: string) =>
    [...reviewKeys.lists(), restaurantId] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
};

/** 내가 작성한 리뷰 목록 (내 정보 시트) */
export const useMyReviews = (options?: { enabled?: boolean }) =>
  useQuery({
    enabled: options?.enabled ?? true,
    queryKey: reviewKeys.mine(),
    queryFn: getMyReviews,
    staleTime: 60_000,
  });

export const useReviews = (
  restaurantId: string,
  initialData: ResponseReview[],
) =>
  useQuery({
    enabled: !!restaurantId,
    queryKey: reviewKeys.list(restaurantId),
    queryFn: () => getRestaurantReview(restaurantId),
    initialData,
    staleTime: 30_000,
  });

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRestaurantReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(variables.restaurantId),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putRestaurantReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(variables.restaurantId),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRestaurantReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(variables.restaurantId),
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
    },
  });
};
