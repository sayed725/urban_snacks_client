import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { ICategory, ICategoryPayload } from "../category.type";

export const getCategories = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResponse<ICategory>> => {
  return fetchApi("/api/v1/categories", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 100,
      searchTerm: params?.searchTerm,
      isFeatured: params?.isFeatured,
      isActive: params?.isActive,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
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
