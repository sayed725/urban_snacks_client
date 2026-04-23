import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    IMGBB_API_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production"]),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_CALLBACK_URL: z.string(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_GOOGLE_CALLBACK_URL: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
  },
});