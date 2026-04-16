
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { env } from "../config/env";





export const userServices = {
    async getSession() {
        try {
            const cookieStore = await cookies(); // await the Promise returned by cookies()

            const authUrl = env.NEXT_PUBLIC_AUTH_URL;
            if (!authUrl) {
                throw new Error("AUTH_URL environment variable is not set");
            }

            const res = await fetch(`${authUrl}/get-session`, {
                method: "GET",
                headers: {
                    // Forward ALL cookies safely (better than .toString() in some edge cases)
                    Cookie: cookieStore
                        .getAll()
                        .map((c) => `${c.name}=${c.value}`)
                        .join("; "),
                    Accept: "application/json",
                },
                cache: "no-store", // critical for session data
                // credentials: "include" is NOT needed here since we're manually forwarding Cookie
            });

            if (!res.ok) {
                console.error("Failed to fetch user info:", res.status, res.statusText);
                return null;
            }

            const { data } = await res.json();

            return data;
        } catch (error) {
            console.error("Error fetching user info:", error);
            return null;
        }
    },
};


