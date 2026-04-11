import { headers } from "next/headers";
import { authClient } from "./auth-client";

export const getSession = async () => {
  return authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
};