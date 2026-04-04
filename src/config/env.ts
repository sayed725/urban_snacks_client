import { z } from "zod";

const envSchema = z.object({
  // Next.js standard
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Your public URLs (exposed to browser)
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_AUTH_URL: z.string().url(),

  // Test variable (optional example)
  NEXT_PUBLIC_TEST: z.string().default("test_value"),
  // google 
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_GOOGLE_CALLBACK_URL: z.string(),

  // imgbb
  NEXT_PUBLIC_IMGBB_API_KEY: z.string(),

});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_GOOGLE_CALLBACK_URL: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
  NEXT_PUBLIC_IMGBB_API_KEY: process.env.NEXT_PUBLIC_IMGBB_API_KEY,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;