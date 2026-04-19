import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import {
  ICoupon,
  ICouponPayload,
  ICouponVerifyResult,
  IGetCouponsParams,
} from "@/types/coupon.type";

export const getCoupons = async (
  params?: IGetCouponsParams
): Promise<PaginatedResponse<ICoupon>> => {
  return fetchApi("/api/v1/coupons", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 10,
      searchTerm: params?.searchTerm,
      isActive: params?.isActive,
      discountType: params?.discountType,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    },
  });
};

export const getCouponById = async (
  id: string
): Promise<ApiResponse<ICoupon>> => {
  return fetchApi(`/api/v1/coupons/${id}`);
};

export const createCoupon = async (
  payload: ICouponPayload
): Promise<ApiResponse<ICoupon>> => {
  return fetchApi("/api/v1/coupons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCoupon = async (
  id: string,
  payload: Partial<ICouponPayload>
): Promise<ApiResponse<ICoupon>> => {
  return fetchApi(`/api/v1/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteCoupon = async (
  id: string
): Promise<ApiResponse<ICoupon>> => {
  return fetchApi(`/api/v1/coupons/${id}`, {
    method: "DELETE",
  });
};

export const verifyCoupon = async (
  code: string,
  amount: number
): Promise<ApiResponse<ICouponVerifyResult>> => {
  return fetchApi(`/api/v1/coupons/verify/${code}`, {
    params: { amount },
  });
};
