"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="mb-10 text-center md:text-left">
         <Skeleton className="h-10 w-64 mx-auto md:mx-0 mb-2" />
         <Skeleton className="h-4 w-80 mx-auto md:mx-0" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          {/* Shipping Information Skeleton */}
          <div className="bg-card border shadow-sm p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
               <Skeleton className="w-6 h-6 rounded-full" />
               <Skeleton className="h-8 w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* Payment Method Skeleton */}
          <div className="bg-card border shadow-sm p-6 sm:p-8 rounded-3xl pb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
               <Skeleton className="w-6 h-6 rounded-full" />
               <Skeleton className="h-8 w-48" />
            </div>

            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border-2 border-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="w-full h-16 rounded-2xl mt-8" />
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card border shadow-sm p-6 rounded-3xl sticky top-24">
            <Skeleton className="h-7 w-40 mb-6" />
            
            <div className="space-y-6 mb-6 border-b pb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center w-3/4">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>

            <div className="space-y-4 font-medium">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between pt-4 border-t mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
