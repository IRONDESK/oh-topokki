import {
  RequestAddFavorite,
  ResponseAddFavorite,
  ResponseFavorite,
} from "@/service/model/restaurant";
import { http, isHttpError } from "@/lib/http";
import { BaseResponse } from "@/service/model/common";

export const getFavorites = async () => {
  try {
    return await http.get<ResponseFavorite[]>("/api/favorites");
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const postAddFavorite = async (data: RequestAddFavorite) => {
  try {
    return await http.post<BaseResponse<ResponseAddFavorite>>(
      `/api/favorites?restaurantId=${data.restaurantId}`,
      { json: { memo: data.memo } },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
