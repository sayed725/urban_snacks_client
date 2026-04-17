import { fetchApi } from "@/lib/fetch-api";
import { IAdminStats } from "@/types/stats.type";

export const getAdminStats = async (): Promise<{ data: IAdminStats }> => {
  return fetchApi("/api/v1/stats/admin");
};
