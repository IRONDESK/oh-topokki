import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRestaurantReview,
  postRestaurantReview,
} from "@/shared/api/naver-map";
import { ResponseReview } from "@/shared/api/model/restaurant";
import { restaurantKeys } from "@/features/restaurant/api/use-restaurant";

export const reviewKeys = {
  all: ["review"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (restaurantId: string) =>
    [...reviewKeys.lists(), restaurantId] as const,
};

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
    },
  });
};
