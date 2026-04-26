"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";
import ProductsSearchHeader from "../../../components/modules/products/ProductsSearchHeader";
import ProductsSidebar from "../../../components/modules/products/ProductsSidebar";
import ProductsLoadingSkeleton, { ProductGridSkeleton, ProductsSidebarSkeleton } from "./_productsLoadingSkeleton";

function ProductsGrid({ products, isLoading }: { products: any[], isLoading: boolean }) {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-card border rounded-xl">
        <div className="text-6xl mb-4">🍩</div>
        <h2 className="text-2xl font-bold">No snacks found</h2>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        <Button asChild className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold px-6 hover:scale-105 border-0">
          <Link href="/products">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as any} />
      ))}
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || undefined;
  const categoryId = searchParams.get("category") || undefined;
  const isSpicy = searchParams.get("isSpicy") === "true";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { data: catResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ sortOrder: "asc", isActive: true }),
  });

  const { data: itemResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", { searchTerm, categoryId, isSpicy, sortBy, sortOrder }],
    queryFn: () => getItems({
      searchTerm,
      categoryId,
      isSpicy: isSpicy || undefined,
      sortBy,
      sortOrder,
      isActive: true,
      limit: 50
    }),
  });

  const categories = catResponse?.data || [];
  const products = itemResponse?.data || [];

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <ProductsSearchHeader />

      <div className="flex flex-col lg:flex-row gap-8">
        {isLoadingCategories ? (
          <ProductsSidebarSkeleton />
        ) : (
          <ProductsSidebar categories={categories} />
        )}

        <div className="flex-1">
          <ProductsGrid products={products} isLoading={isLoadingProducts} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}
