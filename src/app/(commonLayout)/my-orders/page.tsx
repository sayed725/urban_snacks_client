"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageOpen, Clock, AlertCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import moment from "moment";
import OrdersLoadingSkeleton from "./_ordersLoadingSkeleton";
import AddReviewDialog from "@/components/modules/user/review/AddReviewDialog";
import { cn, formatPrice } from "@/lib/utils";
import { createCheckoutSession, initiateSslPayment } from "@/services/payment.service";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
   SheetClose,
   SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Filter, Search, RefreshCw, XCircle } from "lucide-react";

import { Truck, CreditCard, Ticket } from "lucide-react";
import { getMyOrders, updatePaymentMethod } from "@/services/order.service";
import { OrderStatus } from "@/types/order.type";
import { getReviews } from "@/services/review.service";
import SectionHeader from "@/components/shared/SectionHeader";
import { useState } from "react";

const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1
      }
   }
};

const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function MyOrdersPage() {
   const { data: session, isPending: sessionLoading } = authClient.useSession();
   const queryClient = useQueryClient();


   // const { data: response, isLoading } = useQuery({
   //    queryKey: ["my-orders"],
   //    queryFn: () => getMyAllOrders(),
   //    enabled: !!session,
   // });

   // Filters
   const [search, setSearch] = useState("");
   const debouncedSearch = useDebounce(search, 500);
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const [sortBy, setSortBy] = useState("createdAt");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
   const [page, setPage] = useState(1);

   const { data: response, isLoading } = useQuery({
      queryKey: ["my-orders", page, debouncedSearch, statusFilter, sortBy, sortOrder],
      queryFn: () => getMyOrders({
         limit: 10,
         page,
         searchTerm: debouncedSearch,
         status: statusFilter === "all" ? undefined : statusFilter as OrderStatus,
         sortBy,
         sortOrder
      }),
      enabled: !!session,
   });

   const resetFilters = () => {
      setSearch("");
      setStatusFilter("all");
      setSortBy("createdAt");
      setSortOrder("desc");
      setPage(1);
   };

   const isFiltered = search !== "" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";



   const { data: reviewsResponse } = useQuery({
      queryKey: ["my-reviews"],
      queryFn: () => getReviews({ customerId: session?.user?.id, limit: 100 }),
      enabled: !!session?.user?.id,
   });

   // console.log("reviews", reviewsResponse);

   const orders = response?.data || [];
   const reviews = reviewsResponse?.data || [];

   // console.log("orders", orders);


   const retryMutation = useMutation({
      mutationFn: createCheckoutSession,
      onSuccess: (res) => {
         if (res.data?.url) {
            window.location.href = res.data.url;
         }
      },
      onError: (error: any) => {
         toast.error(error.message || "Failed to initiate payment");
      },
   });

   const sslRetryMutation = useMutation({
      mutationFn: initiateSslPayment,
      onSuccess: (res) => {
         if (res.data?.url) {
            window.location.href = res.data.url;
         }
      },
      onError: (error: any) => {
         toast.error(error.message || "Failed to initiate SSL payment");
      },
   });

   const switchMutation = useMutation({
      mutationFn: ({ orderId, method }: { orderId: string; method: string }) =>
         updatePaymentMethod(orderId, method),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-orders"] });
         toast.success("Switched to Cash on Delivery!");
      },
      onError: (error: any) => {
         toast.error(error.message || "Failed to switch payment method");
      },
   });



   //   if (!session) {
   //      return (
   //         <div className="container mx-auto py-32 text-center max-w-md">
   //            <h1 className="text-3xl font-bold mb-4">You are not logged in</h1>
   //            <p className="text-muted-foreground mb-8 text-lg">
   //              Please log in to view your order history.
   //            </p>
   //            <Button asChild size="lg" className="w-full bg-primary text-secondary">
   //              <Link href="/login">Login</Link>
   //            </Button>
   //         </div>
   //      );
   //   }

   const getStatusColor = (status: OrderStatus) => {
      switch (status) {
         case "PLACED": return "bg-gray-100 text-gray-700 font-bold border-none";
         case "PROCESSING": return "bg-blue-100 text-blue-700 font-bold border-none";
         case "SHIPPED": return "bg-purple-100 text-purple-700 font-bold border-none";
         case "DELIVERED": return "bg-green-100 text-green-700 font-bold border-none";
         case "CANCELLED": return "bg-red-100 text-red-700 font-bold border-none";
         default: return "";
      }
   };

   const getPaymentColor = (status: string) => {
      return status === "PAID" ? "text-emerald-600" : "text-amber-500 uppercase";
   };

   return (
      <div className="container w-11/12 mx-auto py-10  min-h-screen">


         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
               <SectionHeader
                  title="My Orders"
                  description="Track and manage your past snack orders"
               />
            </div>

            {/* Filters and Search Header */}
            <div className="flex flex-row gap-2 sm:gap-4 items-center w-full md:w-auto">
               <div className="flex-1 md:w-64 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search order no..."
                     value={search}
                     onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                     className="pl-9 pr-10 h-10 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 rounded-xl shadow-sm"
                  />
                  {search && (
                     <button
                        onClick={() => { setSearch(""); setPage(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     >
                        <XCircle className="h-4 w-4" />
                     </button>
                  )}
               </div>

               <div className="flex items-center gap-2 w-auto">
                  {/* Mobile/Tablet Filter Drawer */}
                  <div className="lg:hidden">
                     <Sheet>
                        <SheetTrigger asChild>
                           <Button variant="outline" className="w-auto gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl h-11 px-3 sm:px-4 transition-all shadow-sm">
                              <Filter className="h-4 w-4" />
                              <span className="hidden sm:inline">Filters</span>
                              {isFiltered && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                           </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col" showCloseButton={false}>
                           <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                 <Filter className="w-5 h-5 text-primary" /> Filters
                              </SheetTitle>
                              <SheetClose className="rounded-xl p-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent hover:border-orange-200 dark:hover:border-orange-800">
                                 <XCircle className="h-5 w-5 text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400" />
                              </SheetClose>
                           </SheetHeader>

                           <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                              <SheetDescription className="sr-only">Filter and sort your orders</SheetDescription>

                              {/* Status Filter */}
                              <div className="space-y-3">
                                 <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Order Status</h3>
                                 <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                                    <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                                       <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                       <SelectItem value="all">All Status</SelectItem>
                                       <SelectItem value="PLACED">Placed</SelectItem>
                                       <SelectItem value="PROCESSING">Processing</SelectItem>
                                       <SelectItem value="SHIPPED">Shipped</SelectItem>
                                       <SelectItem value="DELIVERED">Delivered</SelectItem>
                                       <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              {/* Sort By */}
                              <div className="space-y-3">
                                 <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Orders</h3>
                                 <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                                    const [by, order] = v.split('-');
                                    setSortBy(by);
                                    setSortOrder(order as "asc" | "desc");
                                    setPage(1);
                                 }}>
                                    <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                                       <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                       <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                       <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                       <SelectItem value="totalAmount-desc">Price: High to Low</SelectItem>
                                       <SelectItem value="totalAmount-asc">Price: Low to High</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>

                           <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50">
                              <Button
                                 onClick={resetFilters}
                                 variant="outline"
                                 disabled={!isFiltered}
                                 className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-bold"
                              >
                                 <RefreshCw className="w-4 h-4 mr-2" /> Reset All Filters
                              </Button>
                           </div>
                        </SheetContent>
                     </Sheet>
                  </div>

                  {/* Desktop Inline Filters */}
                  <div className="hidden lg:flex flex-wrap gap-2 items-center">
                     <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                        <SelectTrigger className="w-[130px] rounded-xl h-11 shadow-sm border-slate-200 dark:border-slate-800">
                           <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="all">All Status</SelectItem>
                           <SelectItem value="PLACED">Placed</SelectItem>
                           <SelectItem value="PROCESSING">Processing</SelectItem>
                           <SelectItem value="SHIPPED">Shipped</SelectItem>
                           <SelectItem value="DELIVERED">Delivered</SelectItem>
                           <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                     </Select>

                     <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                        const [by, order] = v.split('-');
                        setSortBy(by);
                        setSortOrder(order as "asc" | "desc");
                        setPage(1);
                     }}>
                        <SelectTrigger className="w-[170px] rounded-xl h-11 shadow-sm border-slate-200 dark:border-slate-800">
                           <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="createdAt-desc">Newest First</SelectItem>
                           <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                           <SelectItem value="totalAmount-desc">Price: High to Low</SelectItem>
                           <SelectItem value="totalAmount-asc">Price: Low to High</SelectItem>
                        </SelectContent>
                     </Select>

                     {isFiltered && (
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={resetFilters}
                           className="text-muted-foreground hover:text-orange-600 h-10 px-2 font-semibold"
                        >
                           <RefreshCw className="h-4 w-4 mr-2" />
                           Reset
                        </Button>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* <h2>here is the data from using manual api call{res?.data?.data?.length}</h2> */}

         {isLoading || sessionLoading ? (
            <OrdersLoadingSkeleton />
         ) : orders.length === 0 ? (
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-card border rounded-3xl py-20 text-center shadow-sm"
            >
               <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <PackageOpen className="w-10 h-10 text-muted-foreground" />
               </div>
               <h2 className="text-2xl font-bold mb-2">No orders found</h2>
               <p className="text-muted-foreground mb-8">You haven't placed any orders yet. Time for a snack break!</p>
               <Button asChild size="lg" className="bg-primary text-secondary">
                  <Link href="/products">Browse Products</Link>
               </Button>
            </motion.div>
         ) : (
            <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               className="space-y-6"
            >
               {orders.map((order: any) => (
                  <motion.div
                     key={order.id}
                     variants={itemVariants}
                     whileHover={{ y: -4 }}
                     className="bg-card border shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all"
                  >
                     {/* Order Header */}
                     <div className="bg-muted/30 px-6 py-4 border-b">
                        {/* Mobile & Tablet View (Grid 2x2) */}
                        <div className="lg:hidden grid grid-cols-2 gap-y-4 justify-between gap-x-2">
                           <div>
                              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Order Placed</p>
                              <p className="text-xs font-medium flex items-center gap-1 mt-0.5">
                                 <Clock className="w-3 h-3" />
                                 {moment(order.createdAt).fromNow()}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Total Amount</p>
                              <p className="text-xs font-bold text-emerald-600 mt-0.5">{formatPrice(order.totalAmount)}</p>
                           </div>
                           <div>
                              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Ship To</p>
                              <p className="text-xs font-medium mt-0.5 truncate" title={order.shippingName}>{order.shippingName}</p>
                           </div>
                           <div className="">
                              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Order No.</p>
                              <p className="text-xs font-bold text-primary mt-0.5">{order.orderNumber}</p>
                           </div>
                        </div>

                        {/* Desktop View (Preferred Flex Layout) */}
                        <div className="hidden lg:flex lg:flex-row lg:items-center justify-between gap-4">
                           <div className="flex flex-row gap-8">
                              <div>
                                 <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Order Placed</p>
                                 <p className="font-medium flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {moment(order.createdAt).fromNow()}
                                 </p>
                              </div>
                              <div>
                                 <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Amount</p>
                                 <p className="font-bold text-emerald-600 mt-0.5">{formatPrice(order.totalAmount)}</p>
                              </div>
                              <div>
                                 <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Ship To</p>
                                 <p className="font-medium mt-0.5 max-w-[150px] truncate" title={order.shippingName}>{order.shippingName}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="text-right">
                                 <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Order No.</p>
                                 <p className="font-bold text-primary mt-0.5">{order.orderNumber}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Order Body */}
                     <div className="p-6 flex flex-col lg:flex-row gap-8 justify-between">
                        <div className="flex-1">
                           <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                              Status: <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                           </h3>

                           {order.status === "CANCELLED" && (
                              <div className="mb-4 flex flex-col md:flex-row lg:items-center gap-4 justify-between bg-red-50/50 dark:bg-red-950/20 p-2 rounded-xl border border-red-100 dark:border-red-900/30">
                                 {order.cancelReason && (
                                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                                       <AlertCircle className="w-4 h-4" />
                                       Reason: {order.cancelReason}
                                    </p>
                                 )}
                                 {order.paymentStatus === "PAID" && (
                                    <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-2">
                                       <Clock className="w-4 h-4" />
                                       Refund Status: You will get refund soon
                                    </p>
                                 )}
                              </div>
                           )}

                           <div className="flex flex-wrap gap-4 mb-4">
                              {order.orderItems.slice(0, 3).map((oi: any) => (
                                 <motion.div
                                    key={oi.id}
                                    className="relative group"
                                    whileHover={{ scale: 1.1 }}
                                 >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-xl overflow-hidden border transition-transform duration-300">
                                       {oi.item?.mainImage || (oi.item?.image && oi.item.image.length > 0) ? (
                                          <img src={oi.item.mainImage || oi.item.image[0]} className="w-full h-full object-cover" alt="item" />
                                       ) : (
                                          <div className="w-full h-full text-[10px] flex items-center justify-center bg-muted text-muted-foreground">No image</div>
                                       )}
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-primary text-secondary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                       {oi.quantity}
                                    </div>
                                 </motion.div>
                              ))}
                              {order.orderItems.length > 3 && (
                                 <div className="w-20 h-20 bg-muted/50 rounded-xl border flex items-center justify-center font-bold text-muted-foreground">
                                    +{order.orderItems.length - 3} more
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="w-full lg:w-64 flex flex-col gap-3 justify-center shrink-0 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-muted-foreground">Payment:</span>
                              <span className={`text-sm font-bold ${getPaymentColor(order.paymentStatus)}`}>
                                 {order.paymentStatus}
                              </span>
                           </div>

                           {order.discountAmount > 0 && (
                              <div className="flex items-center gap-2 mb-2">
                                 <Ticket className="w-4 h-4 text-emerald-500" />
                                 <span className="text-sm font-bold text-emerald-600">Saved {formatPrice(order.discountAmount)}</span>
                              </div>
                           )}

                           <Button asChild className="w-full bg-primary/10 text-primary dark:text-white hover:bg-primary/20 font-bold border-primary/20">
                              <Link href={`/my-orders/${order.id}`}>View Details</Link>
                           </Button>

                           {order.paymentStatus === "UNPAID" &&
                              order.paymentMethod === "STRIPE" &&
                              order.status !== "CANCELLED" && (
                                 <div className="flex flex-col gap-2">
                                    <Button
                                       onClick={() => retryMutation.mutate(order.id)}
                                       disabled={retryMutation.isPending || switchMutation.isPending}
                                       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    >
                                       <CreditCard className="w-4 h-4 mr-2" />
                                       {retryMutation.isPending ? "Connecting..." : "Pay Now"}
                                    </Button>
                                    <Button
                                       onClick={() => switchMutation.mutate({ orderId: order.id, method: "COD" })}
                                       disabled={retryMutation.isPending || switchMutation.isPending}
                                       variant="outline"
                                       className="w-full border-primary/20 text-primary font-bold"
                                    >
                                       <Truck className="w-4 h-4 mr-2" /> Switch to COD
                                    </Button>
                                 </div>
                              )}

                           {order.paymentStatus === "UNPAID" &&
                              order.paymentMethod === "SSLCOMMERZ" &&
                              order.status !== "CANCELLED" && (
                                 <div className="flex flex-col gap-2">
                                    <Button
                                       onClick={() => sslRetryMutation.mutate(order.id)}
                                       disabled={sslRetryMutation.isPending || switchMutation.isPending}
                                       className="w-full bg-[#005694] hover:bg-[#00467a] text-white font-bold"
                                    >
                                       <CreditCard className="w-4 h-4 mr-2" />
                                       {sslRetryMutation.isPending ? "Connecting..." : "Pay with SSL"}
                                    </Button>
                                    <Button
                                       onClick={() => switchMutation.mutate({ orderId: order.id, method: "COD" })}
                                       disabled={sslRetryMutation.isPending || switchMutation.isPending}
                                       variant="outline"
                                       className="w-full border-primary/20 text-primary font-bold"
                                    >
                                       <Truck className="w-4 h-4 mr-2" /> Switch to COD
                                    </Button>
                                 </div>
                              )}

                           {(() => {
                              const existingReview = reviews.find((r: any) =>
                                 r.order?.orderNumber === order.orderNumber

                              );

                              return order.status === OrderStatus.DELIVERED && (
                                 <AddReviewDialog
                                    order={order}
                                    initialReview={existingReview}
                                    trigger={
                                       <Button className={cn(
                                          "w-full font-bold rounded-xl border-none shadow-sm transition-all active:scale-95",
                                          existingReview
                                             ? "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-slate-200"
                                             : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"
                                       )}>
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          {existingReview ? "Edit Review" : "Add Review"}
                                       </Button>
                                    }
                                 />
                              );
                           })()}


                        </div>
                     </div>
                  </motion.div>
               ))}
            </motion.div>
         )}
      </div>
   );
}
