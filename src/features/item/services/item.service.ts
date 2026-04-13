import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { IItem, IItemPayload, IGetItemsParams } from "../item.type";

export const getItems = async (
  params?: IGetItemsParams
): Promise<PaginatedResponse<IItem>> => {
  return fetchApi("/api/v1/items", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 20,
      searchTerm: params?.searchTerm || params?.search,
      "category.id": params?.categoryId,
      isFeatured: params?.isFeatured,
      isSpicy: params?.isSpicy,
      isActive: params?.isActive,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    },
  });
};

export const getItemById = async (
  id: string
): Promise<ApiResponse<IItem>> => {
  return fetchApi(`/api/v1/items/${id}`);
};

export const createItem = async (
  payload: IItemPayload
): Promise<ApiResponse<IItem>> => {
  return fetchApi("/api/v1/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateItem = async (
  id: string,
  payload: Partial<IItemPayload>
): Promise<ApiResponse<IItem>> => {
  return fetchApi(`/api/v1/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteItem = async (id: string): Promise<ApiResponse<IItem>> => {
  return fetchApi(`/api/v1/items/${id}`, {
    method: "DELETE",
  });
};
