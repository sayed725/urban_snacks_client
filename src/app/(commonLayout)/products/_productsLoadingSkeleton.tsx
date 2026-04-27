"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden bg-white/70 dark:bg-black/40 backdrop-blur-xl h-full shadow-sm">
      {/* Image Area Skeleton */}
      <Skeleton className="h-64 w-full" />
      
      {/* Content Area Skeleton */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="flex-grow space-y-3">
          <Skeleton className="h-4 w-1/4" /> {/* Category */}
          <Skeleton className="h-7 w-3/4" /> {/* Title */}
        
        </div>
        
        {/* Footer Skeleton */}
        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <Skeleton className="h-8 w-16" /> {/* Price */}
          <Skeleton className="h-10 w-24 rounded-xl" /> {/* Button */}
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
export function HomeProductGridSkeleton({ count = 8}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductsHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <Skeleton className="h-12 w-64 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-80" /> {/* Subtitle */}
      </div>

      <div className="flex w-full md:w-auto items-center gap-3 flex-wrap sm:flex-nowrap">
        <Skeleton className="h-10 w-full sm:w-[300px] rounded-md" /> {/* Search */}
        <Skeleton className="h-10 w-full sm:w-[180px] rounded-md" /> {/* Sort */}
      </div>
    </div>
  )
}

export function ProductsSidebarSkeleton() {
  return (
    <div className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="p-5 bg-card border rounded-xl shadow-sm space-y-6">
        <div className="border-b pb-2">
          <Skeleton className="h-6 w-24" /> {/* Filter header */}
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" /> {/* Category title */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <Skeleton className="h-4 w-24" /> {/* Preferences title */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <ProductsHeaderSkeleton />

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductsSidebarSkeleton />

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
