import { getItems } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";
import ProductsLoadingSkeleton, { ProductGridSkeleton, ProductsHeaderSkeleton, ProductsSidebarSkeleton } from "./_productsLoadingSkeleton";
import ProductsSearchHeader from "../../../components/modules/products/ProductsSearchHeader";
import ProductsSidebar from "../../../components/modules/products/ProductsSidebar";

async function ProductsGrid({ 
  searchTerm, 
  categoryId, 
  isSpicy, 
  sortBy, 
  sortOrder 
}: { 
  searchTerm?: string; 
  categoryId?: string; 
  isSpicy?: boolean; 
  sortBy?: string; 
  sortOrder?: "asc" | "desc"; 
}) {
  const itemResponse = await getItems({
    searchTerm: searchTerm || undefined,
    categoryId: categoryId || undefined,
    isSpicy: isSpicy || undefined,
    sortBy: sortBy || "createdAt",
    sortOrder: sortOrder || "desc",
    isActive: true,
    limit: 50
  });

  const products = itemResponse?.data || [];

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.searchTerm as string;
  const categoryId = resolvedParams.category as string;
  const isSpicy = resolvedParams.isSpicy === "true";
  const sortBy = resolvedParams.sortBy as string;
  const sortOrder = resolvedParams.sortOrder as "asc" | "desc";

  // Fetch categories for the sidebar (Server side)
  const catResponse = await getCategories({ sortOrder: "asc", isActive: true });
  const categories = catResponse?.data || [];

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <Suspense fallback={<ProductsHeaderSkeleton />}>
        <ProductsSearchHeader />
      </Suspense>

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense fallback={<ProductsSidebarSkeleton />}>
          <ProductsSidebar categories={categories} />
        </Suspense>

        {/* Product Grid with Suspense */}
        <div className="flex-1">
          <Suspense 
            key={`${searchTerm}-${categoryId}-${isSpicy}-${sortBy}-${sortOrder}`} 
            fallback={<ProductGridSkeleton count={6} />}
          >
            <ProductsGrid 
              searchTerm={searchTerm} 
              categoryId={categoryId} 
              isSpicy={isSpicy}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
