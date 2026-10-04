import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { IItem, IItemPayload, IGetItemsParams } from "@/types/item.type";
import { triggerOnDemandRevalidation } from "@/lib/revalidate";

export const getItems = async (
  params?: IGetItemsParams,
  options?: RequestInit
): Promise<PaginatedResponse<IItem>> => {
  const queryParams: Record<string, any> = {
    page: params?.page,
    limit: params?.limit ?? 50,
    searchTerm: params?.searchTerm || params?.search,
    "category.id": params?.categoryId,
    "category.name": params?.categoryName,
    isFeatured: params?.isFeatured,
    isSpicy: params?.isSpicy,
    isActive: params?.isActive,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
  };

  if (params?.minPrice !== undefined && !isNaN(params.minPrice)) {
    queryParams.minPrice = params.minPrice;
    queryParams["price[gte]"] = params.minPrice;
  }

  if (params?.maxPrice !== undefined && !isNaN(params.maxPrice)) {
    queryParams.maxPrice = params.maxPrice;
    queryParams["price[lte]"] = params.maxPrice;
  }

  return fetchApi("/api/v1/items", {
    params: queryParams,
    next: { tags: ["items"] },
    ...options,
  });
};

export const getItemById = async (
  id: string
): Promise<ApiResponse<IItem>> => {
  return fetchApi(`/api/v1/items/${id}`, {
    next: { tags: [`item-${id}`] },
  });
};

export const createItem = async (
  payload: IItemPayload
): Promise<ApiResponse<IItem>> => {
  const result = await fetchApi<ApiResponse<IItem>>("/api/v1/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({ tags: ["items"], paths: ["/", "/products"] });
  return result;
};

export const updateItem = async (
  id: string,
  payload: Partial<IItemPayload>
): Promise<ApiResponse<IItem>> => {
  const result = await fetchApi<ApiResponse<IItem>>(`/api/v1/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({
    tags: ["items", `item-${id}`],
    paths: ["/", "/products", `/products/${id}`],
  });
  return result;
};

export const deleteItem = async (id: string): Promise<ApiResponse<IItem>> => {
  const result = await fetchApi<ApiResponse<IItem>>(`/api/v1/items/${id}`, {
    method: "DELETE",
  });
  triggerOnDemandRevalidation({
    tags: ["items", `item-${id}`],
    paths: ["/", "/products", `/products/${id}`],
  });
  return result;
};
