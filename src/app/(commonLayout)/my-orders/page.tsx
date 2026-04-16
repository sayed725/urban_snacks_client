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
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/services/payment.service";

import { Truck, CreditCard } from "lucide-react";
import { cancelOrder, getMyOrders, updatePaymentMethod } from "@/services/order.service";
import { OrderStatus } from "@/types/order.type";
import { getReviews } from "@/services/review.service";

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

   const { data: response, isLoading } = useQuery({
      queryKey: ["my-orders"],
      queryFn: () => getMyOrders({ limit: 50 }),
      enabled: !!session,
   });

   const { data: reviewsResponse } = useQuery({
      queryKey: ["my-reviews"],
      queryFn: () => getReviews({ customerId: session?.user?.id, limit: 100 }),
      enabled: !!session?.user?.id,
   });

   // console.log("reviews", reviewsResponse);

   const orders = response?.data || [];
   const reviews = reviewsResponse?.data || [];

   const cancelMutation = useMutation({
      mutationFn: cancelOrder,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["my-orders"] });
         toast.success("Order cancelled safely");
      },
      onError: (error: any) => {
         toast.error(error.message || "Failed to cancel order");
      },
   });

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
         <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10 text-center md:text-left"
         >
            <h1 className="text-4xl font-black">My Orders</h1>
            <p className="text-muted-foreground mt-2">Track and manage your past snack orders</p>
         </motion.div>

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
                     <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                           <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Order Placed</p>
                              <p className="font-medium flex items-center gap-1 mt-0.5">
                                 <Clock className="w-3.5 h-3.5" />
                                 {moment(order.createdAt).fromNow()}
                              </p>
                           </div>
                           <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Amount</p>
                              <p className="font-bold text-emerald-600 mt-0.5">${order.totalAmount}</p>
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

                     {/* Order Body */}
                     <div className="p-6 flex flex-col lg:flex-row gap-8 justify-between">
                        <div className="flex-1">
                           <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                              Status: <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                           </h3>

                           <div className="flex flex-wrap gap-4 mb-4">
                              {order.orderItems.slice(0, 3).map((oi: any) => (
                                 <motion.div
                                    key={oi.id}
                                    className="relative group"
                                    whileHover={{ scale: 1.1 }}
                                 >
                                    <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden border transition-transform duration-300">
                                       {oi.item?.image ? (
                                          <img src={oi.item.image} className="w-full h-full object-cover" alt="item" />
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
