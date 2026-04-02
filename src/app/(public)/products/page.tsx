"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchApi("/items"),
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Our Snacks</h1>
      {isLoading ? (
        <p>Loading snacks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* @ts-expect-error type will be added later */}
          {products?.data?.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 shadow-sm bg-card hover:shadow-md transition-shadow">
              {product.image && (
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-muted-foreground mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
