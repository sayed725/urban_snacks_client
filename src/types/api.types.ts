export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: IMeta;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}