import { fetchApi } from "@/lib/fetch-api";
import { ApiResponse } from "@/types/api.types";
import { IUser, IGetUsersParams } from "@/types/user.type";

export const getAllUsers = async (
  params?: IGetUsersParams
): Promise<{ data: IUser[]; total: number }> => {
  return fetchApi("/api/v1/users", {
    params: {
      page: params?.page,
      limit: params?.limit ?? 50,
      searchTerm: params?.searchTerm,
      role: params?.role,
      status: params?.status,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
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
