import { IBanner, IBannerPayload } from "@/types/banner.type";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { fetchApi } from "@/lib/fetch-api";

export const getBanners = async (
  queries?: Record<string, any>
): Promise<PaginatedResponse<IBanner>> => {
  return fetchApi("/api/v1/banners", {
    params: queries,
    cache: "no-store",
  });
};

export const getBannerById = async (id: string): Promise<ApiResponse<IBanner>> => {
  return fetchApi(`/api/v1/banners/${id}`);
};

export const createBanner = async (payload: IBannerPayload): Promise<ApiResponse<IBanner>> => {
  return fetchApi("/api/v1/banners", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateBanner = async (
  id: string,
  payload: Partial<IBannerPayload>
): Promise<ApiResponse<IBanner>> => {
  return fetchApi(`/api/v1/banners/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteBanner = async (id: string): Promise<ApiResponse<IBanner>> => {
  return fetchApi(`/api/v1/banners/${id}`, {
    method: "DELETE",
  });
};
