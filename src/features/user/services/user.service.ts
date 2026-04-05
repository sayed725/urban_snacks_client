import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse } from "@/types/api.types";
import { IUser } from "../user.type";

export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ data: IUser[]; total: number }> => {
  return fetchApi("/api/v1/users", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 50,
    },
  });
};

export const updateUserStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE" | "BANNED"
): Promise<ApiResponse<IUser>> => {
  return fetchApi(`/api/v1/users/status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
