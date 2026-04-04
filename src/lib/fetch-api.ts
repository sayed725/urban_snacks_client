import { env } from "@/config/env";


type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export const fetchApi = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { params, headers: customHeaders, ...restOptions } = options;

  // Determine base URL
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? env.NEXT_PUBLIC_API_URL : "";

  // Append query parameters
  let fullPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (params) {
    const safeBase = baseUrl || "http://localhost";
    const searchParams = new URL(fullPath, safeBase).searchParams;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullPath = `${fullPath.split("?")[0]}?${queryString}`;
    }
  }

  const url = isServer ? `${baseUrl}${fullPath}` : fullPath;

  // Merge headers
  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Handle server-side cookie forwarding
  if (isServer) {
    const { headers: nextHeaders } = await import("next/headers");
    const cookie = (await nextHeaders()).get("cookie");
    if (cookie) {
      headers.set("Cookie", cookie);
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
    ...(isServer ? {} : { credentials: "include" }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `API Request failed: ${response.statusText}`,
    );
  }

  return response.json();
};
