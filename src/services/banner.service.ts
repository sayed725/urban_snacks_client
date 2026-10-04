import { IBanner, IBannerPayload } from "@/types/banner.type";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { fetchApi } from "@/lib/fetch-api";
import { triggerOnDemandRevalidation } from "@/lib/revalidate";

export const getBanners = async (
  queries?: Record<string, any>,
  options?: RequestInit
): Promise<PaginatedResponse<IBanner>> => {
  return fetchApi("/api/v1/banners", {
    params: queries,
    next: { tags: ["banners"] },
    ...options,
  });
};

export const getBannerById = async (id: string): Promise<ApiResponse<IBanner>> => {
  return fetchApi(`/api/v1/banners/${id}`);
};

export const createBanner = async (payload: IBannerPayload): Promise<ApiResponse<IBanner>> => {
  const result = await fetchApi<ApiResponse<IBanner>>("/api/v1/banners", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({ tags: ["banners"], paths: ["/"] });
  return result;
};

export const updateBanner = async (
  id: string,
  payload: Partial<IBannerPayload>
): Promise<ApiResponse<IBanner>> => {
  const result = await fetchApi<ApiResponse<IBanner>>(`/api/v1/banners/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  triggerOnDemandRevalidation({ tags: ["banners"], paths: ["/"] });
  return result;
};

export const deleteBanner = async (id: string): Promise<ApiResponse<IBanner>> => {
  const result = await fetchApi<ApiResponse<IBanner>>(`/api/v1/banners/${id}`, {
    method: "DELETE",
  });
  triggerOnDemandRevalidation({ tags: ["banners"], paths: ["/"] });
  return result;
};
