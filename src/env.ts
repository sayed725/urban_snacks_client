import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Add server env vars
    // IMGBB_API_KEY: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5000/api/v1"),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default("http://localhost:3000/api/auth"),
  },

  runtimeEnv: {
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
});
