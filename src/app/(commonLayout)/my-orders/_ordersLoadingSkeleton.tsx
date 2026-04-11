import { Skeleton } from "@/components/ui/skeleton";

const OrdersLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-card border shadow-sm rounded-3xl overflow-hidden"
        >
          {/* Order Header Skeleton */}
          <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-md" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-3 w-16 ml-auto rounded-md" />
              <Skeleton className="h-5 w-20 ml-auto rounded-md" />
            </div>
          </div>

          {/* Order Body Skeleton */}
          <div className="p-6 flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="w-20 h-20 rounded-xl border" />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-64 flex flex-col gap-3 justify-center shrink-0 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersLoadingSkeleton;
