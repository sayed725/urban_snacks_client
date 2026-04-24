import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse } from "@/types/api.types";

export const createCheckoutSession = async (
  orderId: string
): Promise<ApiResponse<{ url: string }>> => {
  return fetchApi(`/api/v1/payments/create-checkout-session/${orderId}`, {
    method: "POST",
  });
};

export const initiateSslPayment = async (
  orderId: string
): Promise<ApiResponse<{ url: string }>> => {
  return fetchApi(`/api/v1/payments/initiate-ssl/${orderId}`, {
    method: "POST",
  });
};

export const getPaymentByOrderId = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  return fetchApi(`/api/v1/payments/order/${orderId}`);
};
