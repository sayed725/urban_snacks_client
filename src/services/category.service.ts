import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { ICategory, ICategoryPayload } from "@/types/category.type";
import { triggerOnDemandRevalidation } from "@/lib/revalidate";

export const getCategories = async (
  params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    isFeatured?: boolean;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  options?: RequestInit
): Promise<PaginatedResponse<ICategory>> => {
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
    next: { tags: ["categories"] },
    ...options,
  });
};

export const createCategory = async (
  payload: ICategoryPayload
): Promise<ApiResponse<ICategory>> => {
  const result = await fetchApi<ApiResponse<ICategory>>("/api/v1/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({ tags: ["categories"], paths: ["/", "/products"] });
  return result;
};

export const updateCategory = async (
  id: string,
  payload: Partial<ICategoryPayload>
): Promise<ApiResponse<ICategory>> => {
  const result = await fetchApi<ApiResponse<ICategory>>(`/api/v1/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({ tags: ["categories"], paths: ["/", "/products"] });
  return result;
};

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<ICategory>> => {
  const result = await fetchApi<ApiResponse<ICategory>>(`/api/v1/categories/${id}`, {
    method: "DELETE",
  });
  triggerOnDemandRevalidation({ tags: ["categories"], paths: ["/", "/products"] });
  return result;
};
