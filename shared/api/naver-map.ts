import { http, isHttpError } from "@/shared/lib/http";
import { NaverPlaceSearchResult } from "@/shared/api/model/naver-map";
import { RestaurantFormData } from "@/features/restaurant/ui/RestaurantForm";
import {
  PaginationDetailResponse,
  PaginationResponse,
  RequestGetRestaurantParams,
} from "@/shared/api/model/common";
import {
  RequestNewReview,
  RequestUpdateReview,
  ResponseRankingItem,
  ResponseRestaurant,
  ResponseReview,
} from "@/shared/api/model/restaurant";

export const getNaverMapSearch = async (query: string) => {
  try {
    return await http.get<PaginationResponse<NaverPlaceSearchResult[]>>(
      `/api/search/places?query=${encodeURIComponent(query + " 떡볶이")}`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const postRestaurantInfo = async (data: RestaurantFormData) => {
  try {
    return await http.post<ResponseRestaurant>(`/api/restaurants`, {
      json: data,
    });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantInfo = async (params: RequestGetRestaurantParams) => {
  try {
    return await http.get<ResponseRestaurant[]>(`/api/restaurants`, {
      searchParams: params,
    });
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const putRestaurantInfo = async (data: {
  restaurantId: string;
  json: RestaurantFormData;
}) => {
  try {
    return await http.put<ResponseRestaurant>(
      `/api/restaurants/${data.restaurantId}`,
      { json: data.json },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const deleteRestaurantInfo = async (data: { restaurantId: string }) => {
  try {
    return await http.delete<{ message: string }>(
      `/api/restaurants/${data.restaurantId}`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantRanking = async () => {
  try {
    return await http.get<ResponseRankingItem[]>(`/api/restaurants/ranking`);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantCount = async () => {
  try {
    return await http.get<{ count: number }>(`/api/restaurants/count`);
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantDetail = async ({
  restaurantId,
}: {
  restaurantId: string;
}) => {
  try {
    return await http.get<ResponseRestaurant>(
      `/api/restaurants/${restaurantId}`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantSearch = async (params: {
  query: string;
  page?: number;
}) => {
  try {
    return await http.get<PaginationDetailResponse<ResponseRestaurant[]>>(
      `/api/restaurants/search`,
      {
        searchParams: params,
      },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getRestaurantReview = async (restaurantId: string) => {
  try {
    return await http.get<ResponseReview[]>(
      `/api/restaurants/${restaurantId}/reviews`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const postRestaurantReview = async (data: RequestNewReview) => {
  try {
    return await http.post<ResponseReview>(
      `/api/restaurants/${data.restaurantId}/reviews`,
      { json: data.json },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const putRestaurantReview = async (data: RequestUpdateReview) => {
  try {
    return await http.put<ResponseReview>(
      `/api/restaurants/${data.restaurantId}/reviews/${data.reviewId}`,
      { json: data.json },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const deleteRestaurantReview = async (data: {
  restaurantId: string;
  reviewId: string;
}) => {
  try {
    return await http.delete<{ message: string }>(
      `/api/restaurants/${data.restaurantId}/reviews/${data.reviewId}`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
