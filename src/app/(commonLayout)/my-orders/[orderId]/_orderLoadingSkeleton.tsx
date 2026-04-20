import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const OrderLoadingSkeleton = () => {
   return (
       <div className="container w-11/12 mx-auto py-10  min-h-screen">
      <div className="mb-8">
         <Skeleton className="h-6 w-32 rounded-lg" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         <div className="flex-1 space-y-8">
            {/* Order Tracking Skeleton */}
            <div className="bg-card border rounded-3xl p-4 sm:p-10 shadow-sm relative mb-8 overflow-hidden">
               <div className="relative pt-2">
                  <div className="absolute top-8 left-0 w-full h-[3px] bg-muted -translate-y-1/2 z-0 rounded-full" />
                  <div className="relative flex justify-between items-start z-10">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                           <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[4px] border-background" />
                           <div className="mt-4 flex flex-col items-center gap-1.5 px-1">
                              <Skeleton className="h-3 w-12 sm:w-16 rounded-md" />
                              <Skeleton className="h-2 w-16 sm:w-20 rounded-md hidden sm:block" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                     </div>
                     <Skeleton className="h-5 w-80 rounded-lg" />
                  </div>
                  <div className="text-right space-y-2">
                     <Skeleton className="h-4 w-24 ml-auto rounded-md" />
                     <Skeleton className="h-10 w-32 ml-auto rounded-xl" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-6 w-40 rounded-lg" />
                     </div>
                     <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border">
                        <Skeleton className="h-6 w-1/2 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <div className="pt-2 mt-2 border-t space-y-2">
                           <Skeleton className="h-4 w-2/3 rounded-md" />
                           <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-6 w-40 rounded-lg" />
                     </div>
                     <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border">
                        <div className="flex justify-between items-center">
                           <Skeleton className="h-4 w-20 rounded-md" />
                           <Skeleton className="h-4 w-24 rounded-md" />
                        </div>
                        <div className="flex justify-between items-center">
                           <Skeleton className="h-4 w-16 rounded-md" />
                           <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="pt-4 border-t space-y-3">
                           <div className="flex justify-between">
                              <Skeleton className="h-4 w-20 rounded-md" />
                              <Skeleton className="h-4 w-16 rounded-md" />
                           </div>
                           <div className="flex justify-between">
                              <Skeleton className="h-4 w-20 rounded-md" />
                              <Skeleton className="h-4 w-16 rounded-md" />
                           </div>
                           <div className="flex justify-between pt-2 border-t">
                              <Skeleton className="h-6 w-24 rounded-md" />
                              <Skeleton className="h-6 w-20 rounded-md" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                  <Skeleton className="h-7 w-40 rounded-lg" />
               </div>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-2xl border bg-background items-center">
                        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-3">
                           <div className="flex justify-between items-start">
                              <div className="space-y-2 w-full">
                                 <Skeleton className="h-6 w-1/3 rounded-md" />
                                 <Skeleton className="h-4 w-1/4 rounded-md" />
                              </div>
                              <div className="text-right space-y-2">
                                 <Skeleton className="h-6 w-16 rounded-md ml-auto" />
                                 <Skeleton className="h-4 w-20 rounded-md ml-auto" />
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   </div>
   )
}

export default OrderLoadingSkeleton