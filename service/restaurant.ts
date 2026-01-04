import {
  RequestAddFavorite,
  ResponseAddFavorite,
} from "@/service/model/restaurant";
import { http, isHttpError } from "@/lib/http";
import { BaseResponse } from "@/service/model/common";

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
