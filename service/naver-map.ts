import { http, isHttpError } from "@/lib/http";
import { NaverPlaceSearchResult } from "@/service/model/naver-map";
import { RestaurantFormData } from "@/components/restaurant/RestaurantForm";
import {
  PaginationResponse,
  RequestGetRestaurantParams,
} from "@/service/model/common";
import { ResponseRestaurant } from "@/service/model/restaurant";

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
    return await http.post<NaverPlaceSearchResult>(`/api/restaurants`, {
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
