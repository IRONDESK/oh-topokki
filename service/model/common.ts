export type PaginationResponse<T> = {
  items: T;
  display: number;
  start: number;
  total: number;
};

export type RequestGetRestaurantParams = {
  lat?: number;
  lng?: number;
  radius: number;
};
