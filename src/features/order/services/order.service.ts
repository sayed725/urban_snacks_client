import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateOrderPayload,
  IGetOrdersParams,
  IOrder,
  OrderStatus,
} from "../order.type";

export const getAllOrders = async (
  params?: IGetOrdersParams
): Promise<{ data: IOrder[]; total: number }> => {
  return fetchApi("/api/v1/orders/all", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 20,
      status: params?.status,
    },
  });
};

export const getMyOrders = async (
  params?: IGetOrdersParams
): Promise<{ data: IOrder[]; total: number }> => {
  return fetchApi("/api/v1/orders/my-orders", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 20,
    },
  });
};

export const getOrderById = async (
  orderId: string
): Promise<ApiResponse<IOrder>> => {
  return fetchApi(`/api/v1/orders/${orderId}`);
};

export const createOrder = async (
  payload: ICreateOrderPayload
): Promise<ApiResponse<IOrder>> => {
  return fetchApi("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const cancelOrder = async (
  orderId: string
): Promise<ApiResponse<IOrder>> => {
  return fetchApi(`/api/v1/orders/cancel/${orderId}`, {
    method: "PATCH",
  });
};

export const changeOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<ApiResponse<IOrder>> => {
  return fetchApi(`/api/v1/orders/change-status/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteOrder = async (
  orderId: string
): Promise<ApiResponse<{ id: string; success: boolean }>> => {
  return fetchApi(`/api/v1/orders/${orderId}`, {
    method: "DELETE",
  });
};
