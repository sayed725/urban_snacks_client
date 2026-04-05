import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { ICategory, ICategoryPayload } from "../category.type";

export const getCategories = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<ICategory>> => {
  return fetchApi("/api/v1/categories", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 100,
      search: params?.search,
    },
  });
};

export const createCategory = async (
  payload: ICategoryPayload
): Promise<ApiResponse<ICategory>> => {
  return fetchApi("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (
  id: string,
  payload: Partial<ICategoryPayload>
): Promise<ApiResponse<ICategory>> => {
  return fetchApi(`/api/v1/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<ICategory>> => {
  return fetchApi(`/api/v1/categories/${id}`, {
    method: "DELETE",
  });
};
