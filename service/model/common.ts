export type PaginationResponse<T> = {
  items: T;
  display: number;
  start: number;
  total: number;
};

export type PaginationDetailResponse<T> = {
  items: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type RequestGetRestaurantParams = {
  lat?: number;
  lng?: number;
  radius: number;
};
