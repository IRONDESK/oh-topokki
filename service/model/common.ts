export type PaginationResponse<T> = {
  items: T;
  display: number;
  start: number;
  total: number;
};
