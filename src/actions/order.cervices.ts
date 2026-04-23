import { cookies } from "next/headers";


export const orderServices = {
    getMyOrders: async () => {
        const cookieStore = await cookies();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/my-orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                credentials: "include",
                cache: "no-store",
            });
            if (!res.ok) {
                const errorData = await res.json();
                return {
                    error: { message: errorData?.message || "Failed to get bookings" },
                };
            }

            const data = await res.json();

            return { data: data, error: null };

        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something Went Wrong" } };
        }

    },
}