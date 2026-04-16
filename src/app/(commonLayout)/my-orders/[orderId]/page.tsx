"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/features/order/services/order.service";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, CreditCard, Box, PackageCheck, Star, MessageSquare, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatus } from "@/features/order/order.type";
import { motion } from "framer-motion";
import OrderLoadingSkeleton from "./_orderLoadingSkeleton";
import { cn } from "@/lib/utils";
import { IReview } from "@/features/review/review.type";
import AddReviewDialog from "@/components/modules/user/review/AddReviewDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCheckoutSession } from "@/features/payment/services/payment.service";
import { updatePaymentMethod } from "@/features/order/services/order.service";
import { toast } from "sonner";
import { RefreshCw, Truck } from "lucide-react";

const fadeInUp = {
   initial: { opacity: 0, y: 20 },
   animate: { opacity: 1, y: 0 },
   transition: { duration: 0.5 }
};

const staggerContainer = {
   animate: {
      transition: {
         staggerChildren: 0.1
      }
   }
};


export default function OrderDetailPage() {
   const { orderId } = useParams() as { orderId: string };
   const { data: session, isPending: sessionLoading } = authClient.useSession();

   const { data: response, isLoading } = useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: !!session,
   });

   const queryClient = useQueryClient();

   const retryMutation = useMutation({
      mutationFn: () => createCheckoutSession(orderId),
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
      mutationFn: () => updatePaymentMethod(orderId, "COD"),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["order", orderId] });
         toast.success("Switched to Cash on Delivery!");
      },
      onError: (error: any) => {
         toast.error(error.message || "Failed to switch payment method");
      },
   });

   const order = response?.data;

   if (sessionLoading || isLoading) {
      return <OrderLoadingSkeleton />;
   }


   if (!session || !order) {
      return (
         <div className="container mx-auto py-32 text-center">
            <h1 className="text-3xl font-bold mb-4">Order not found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
            <Button asChild><Link href="/my-orders"><ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders</Link></Button>
         </div>
      );
   }

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
      return status === "PAID" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200";
   };

   return (

      <motion.div
         initial="initial"
         animate="animate"
         variants={staggerContainer}
         className="container w-11/12 mx-auto py-10 min-h-screen"
      >
         <motion.div variants={fadeInUp}>
            <Link href="/my-orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
            </Link>
         </motion.div>

         <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
               <motion.div variants={fadeInUp} className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-6">
                     <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                           Order #{order.orderNumber}
                           <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                           Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-emerald-600">${order.totalAmount}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <motion.div variants={fadeInUp}>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                           <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                        </h3>
                        <div className="text-sm bg-muted/30 p-4 rounded-2xl border leading-relaxed space-y-1">
                           <p className="font-semibold text-base">{order.shippingName}</p>
                           <p>{order.shippingAddress}</p>
                           <p>{order.shippingCity}, {order.shippingPostalCode}</p>
                           <p className="pt-2 mt-2 border-t text-muted-foreground"><span className="font-semibold text-foreground">Phone:</span> {order.shippingPhone}</p>
                           <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {order.shippingEmail}</p>
                           {order.additionalInfo && (
                              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 italic">
                                 <span className="font-semibold block mb-1">Note:</span>
                                 {order.additionalInfo}
                              </div>
                           )}
                        </div>
                     </motion.div>

                     <motion.div variants={fadeInUp}>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                           <CreditCard className="w-5 h-5 text-primary" /> Payment details
                        </h3>
                        <div className="text-sm bg-muted/30 p-4 rounded-2xl border space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Method</span>
                              <span className="font-bold uppercase tracking-wider">{order.paymentMethod}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className={getPaymentColor(order.paymentStatus)}>
                                 {order.paymentStatus}
                              </Badge>
                           </div>
                           <div className="pt-4 border-t space-y-2 text-muted-foreground">
                              <div className="flex justify-between">
                                 <span>Subtotal</span>
                                 <span>${order.totalAmount}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Shipping</span>
                                 <span className="text-emerald-600 font-medium">Free</span>
                              </div>
                              <div className="flex justify-between text-foreground font-bold text-base pt-2 border-t">
                                 <span>Total Amount</span>
                                 <span>${order.totalAmount}</span>
                              </div>
                           </div>

                           {order.paymentStatus === "UNPAID" && 
                            order.paymentMethod === "STRIPE" && 
                            order.status !== "CANCELLED" && (
                              <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                                 <Button 
                                    onClick={() => retryMutation.mutate()}
                                    disabled={retryMutation.isPending || switchMutation.isPending}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl"
                                 >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${retryMutation.isPending ? "animate-spin" : ""}`} /> 
                                    {retryMutation.isPending ? "Connecting..." : "Pay Now with Card"}
                                 </Button>
                                 <Button 
                                    onClick={() => switchMutation.mutate()}
                                    disabled={retryMutation.isPending || switchMutation.isPending}
                                    variant="outline"
                                    className="w-full border-primary/20 text-primary font-bold h-12 rounded-xl"
                                 >
                                    <Truck className="w-4 h-4 mr-2" /> 
                                    {switchMutation.isPending ? "Updating..." : "Switch to Cash on Delivery"}
                                 </Button>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  </div>
               </motion.div>

               {/* Review Section */}
               {order.reviews && order.reviews.length > 0 && (
                  <motion.div variants={fadeInUp} className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-xl">
                           <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Your Feedback
                        </h3>
                        <div className="flex items-center gap-4">
                           <p className="hidden sm:block text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
                              Submitted on {new Date(order.reviews[0].createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                           </p>
                           <AddReviewDialog 
                              order={order} 
                              initialReview={order.reviews[0]} 
                              trigger={
                                 <Button variant="outline" size="sm" className="rounded-xl dark:text-white font-bold bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                    <Pencil className="w-4 h-4 mr-2" /> Edit Review
                                 </Button>
                              }
                           />
                        </div>
                     </div>

                     <div className="bg-amber-50/50 dark:bg-gray-900/50 dark:border-gray-800 border border-amber-100 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <MessageSquare className="w-24 h-24 text-amber-900" />
                        </div>

                        <div className="flex gap-1 mb-4">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                 key={star}
                                 className={cn(
                                    "w-5 h-5",
                                    star <= order.reviews![0].rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                                 )}
                              />
                           ))}
                        </div>

                        <p className="text-lg dark:text-white font-medium text-amber-900/90 italic leading-relaxed relative z-10">
                           "{order.reviews[0].comment}"
                        </p>
                     </div>
                  </motion.div>
               )}

               <motion.div variants={fadeInUp} className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-6 text-xl">
                     <PackageCheck className="w-6 h-6 text-primary" /> Order Items
                  </h3>

                  <motion.div
                     variants={staggerContainer}
                     className="space-y-4"
                  >
                     {order.orderItems.map((oi: any) => (
                        <motion.div
                           key={oi.id}
                           variants={fadeInUp}
                           whileHover={{ scale: 1.01 }}
                           className="flex gap-4 p-4 rounded-2xl border bg-background items-center transition-all"
                        >
                           <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden shrink-0 border">
                              {oi.item?.image ? (
                                 <img src={oi.item.image} alt={oi.item.name} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <Link href={`/products/${oi.item?.id}`} className="hover:text-primary transition-colors">
                                       <h4 className="font-bold text-lg leading-tight truncate">{oi.item?.name}</h4>
                                    </Link>
                                    <p className="text-sm text-muted-foreground mt-1">{oi.item?.weight} {oi.item?.isSpicy ? "🌶️" : ""}</p>
                                 </div>
                                 <div className="text-right ml-4">
                                    <p className="font-black text-lg">${oi.subTotal}</p>
                                    <p className="text-sm text-muted-foreground">${oi.unitPrice} x {oi.quantity}</p>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               </motion.div>
            </div>
         </div>
      </motion.div>
   );
}
