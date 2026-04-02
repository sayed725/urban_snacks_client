import { env } from "@/env";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    env.NEXT_PUBLIC_NODE_ENV === "production"
      ? env.NEXT_PUBLIC_BETTER_AUTH_URL // Prod URL dynamically or preset
      : "http://localhost:3000",
  fetchOptions: { credentials: "include" },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: true },
        status: { type: "string", required: true },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
