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
