import { RequestAddFavorite, ResponseReview } from "@/service/model/restaurant";
import { http, isHttpError } from "@/lib/http";

export const postAddFavorite = async (data: RequestAddFavorite) => {
  try {
    return await http.post<ResponseReview>(
      `/api/restaurants?restaurantId=${data.restaurantId}`,
      { json: { memo: data.memo } },
    );
  } catch (error) {
    if (isHttpError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
};
