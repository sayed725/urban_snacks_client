
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Use the proxy rewrite path so auth requests go through Vercel (/api/auth/* → backend)
// This ensures cookies are set on the same domain (Vercel) and bypass cross-origin cookie blocking.
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_FRONTEND_URL,
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
