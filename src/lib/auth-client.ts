
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "../config/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  fetchOptions: { credentials: "include" },
  plugins: [
    inferAdditionalFields({
      user: {
        phone: { type: "string", required: false },
        image: { type: "string", required: false },
        role: { type: "string", required: false },
        status: { type: "string", required: false },
        isDeleted: { type: "boolean", required: false },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
