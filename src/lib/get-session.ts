import { headers } from "next/headers";
import { authClient } from "./auth-client";
import { env } from "@/config/env";

export const getSession = async () => {
  return authClient.getSession({
    fetchOptions: {
      baseURL: env.NEXT_PUBLIC_API_URL,
      headers: await headers(),
    },
  });
};