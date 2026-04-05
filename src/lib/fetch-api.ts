import { env } from "@/config/env";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export const fetchApi = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { params, headers: customHeaders, ...restOptions } = options;

  // Always use the backend base URL (works on both server and client)
  const baseUrl = env.NEXT_PUBLIC_API_URL;

  // Build path
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Append query parameters using URLSearchParams directly
  let fullUrl = `${baseUrl}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl = `${fullUrl}?${queryString}`;
    }
  }

  // Merge headers
  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Handle server-side cookie forwarding
  const isServer = typeof window === "undefined";
  if (isServer) {
    const { headers: nextHeaders } = await import("next/headers");
    const cookie = (await nextHeaders()).get("cookie");
    if (cookie) {
      headers.set("Cookie", cookie);
    }
  }

  const response = await fetch(fullUrl, {
    ...restOptions,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `API Request failed: ${response.statusText}`,
    );
  }

  return response.json();
};
