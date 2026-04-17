import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { IReview, ICreateReviewPayload, IGetReviewsParams, IUpdateReviewPayload } from "@/types/review.type";

export const getReviews = async (
  params?: IGetReviewsParams
): Promise<PaginatedResponse<IReview>> => {
  return fetchApi("/api/v1/reviews", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 20,
      searchTerm: params?.searchTerm,
      customerId: params?.customerId,
      rating: params?.rating,
      isActive: params?.isActive,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    },
  });
};

export const getMyReviews = async (
    params?: IGetReviewsParams
): Promise<PaginatedResponse<IReview>> => {
    // This assumes the backend handles identity based on session
    return fetchApi("/api/v1/reviews", {
        params: {
            ...params,
            // The customerId filter might not be needed if backend handles it
        }
    });
};

export const createReview = async (
  payload: ICreateReviewPayload
): Promise<ApiResponse<IReview>> => {
  return fetchApi("/api/v1/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateReview = async (
  id: string,
  payload: Partial<IUpdateReviewPayload>
): Promise<ApiResponse<IReview>> => {
  return fetchApi(`/api/v1/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const updateReviewStatus = async (
    id: string,
    isActive: boolean
): Promise<ApiResponse<IReview>> => {
    return fetchApi(`/api/v1/reviews/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
    });
};

export const deleteReview = async (id: string): Promise<ApiResponse<IReview>> => {
  return fetchApi(`/api/v1/reviews/${id}`, {
    method: "DELETE",
  });
};
