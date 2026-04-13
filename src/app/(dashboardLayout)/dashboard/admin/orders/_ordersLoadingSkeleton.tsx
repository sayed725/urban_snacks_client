import { Skeleton } from "@/components/ui/skeleton";

const OrdersLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-[140px] shrink-0" />
          <Skeleton className="h-10 w-[140px] shrink-0" />
          <Skeleton className="h-10 w-[140px] shrink-0" />
          <Skeleton className="h-10 w-[180px] shrink-0" />
        </div>
      </div>

      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                <th className="px-6 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></th>
                <th className="px-6 py-4 text-center"><Skeleton className="h-4 w-20 mx-auto" /></th>
                <th className="px-6 py-4 text-center"><Skeleton className="h-4 w-20 mx-auto" /></th>
                <th className="px-6 py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24 font-semibold" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16 font-bold ml-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-9 w-32 mx-auto rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersLoadingSkeleton;
