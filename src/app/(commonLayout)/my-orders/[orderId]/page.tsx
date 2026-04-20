"use client";

import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, CreditCard, Box, PackageCheck, Star, MessageSquare, Pencil, AlertCircle, Clock, Ticket, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { motion } from "framer-motion";
import OrderLoadingSkeleton from "./_orderLoadingSkeleton";
import { cn } from "@/lib/utils";
import { IReview } from "@/types/review.type";
import AddReviewDialog from "@/components/modules/user/review/AddReviewDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCheckoutSession } from "@/services/payment.service";

import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/invoice-pdf";
import { Download, RefreshCw, Truck } from "lucide-react";
import { OrderStatus } from "@/types/order.type";
import { getOrderById, updatePaymentMethod } from "@/services/order.service";

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

   const OrderTracking = ({ status }: { status: OrderStatus }) => {
      if (status === "CANCELLED") return null;

      const steps = [
         { status: "PLACED", label: "PLACED", desc: "Your order has been received" },
         { status: "PROCESSING", label: "PROCESSING", desc: "Preparing your items" },
         { status: "SHIPPED", label: "SHIPPED", desc: "On its way to you" },
         { status: "DELIVERED", label: "DELIVERED", desc: "Packet received" },
      ];

      const currentStepIndex = steps.findIndex(s => s.status === status);

      return (
         <motion.div 
            variants={fadeInUp} 
            className="bg-card border rounded-3xl p-4 sm:p-10 shadow-sm relative mb-8 overflow-hidden"
         >
            <div className="relative pt-2">
               {/* Background Line */}
               <div className="absolute top-8 sm:top-8 left-0 w-full h-[3px] bg-muted -translate-y-1/2 z-0 rounded-full" />
               
               {/* Progress Line */}
               <motion.div 
                  className="absolute top-5 sm:top-6 left-0 h-[3px] bg-emerald-500 -translate-y-1/2 z-0 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
               />

               <div className="relative flex justify-between items-start z-10">
                  {steps.map((step, index) => {
                     const isCompleted = index <= currentStepIndex;
                     const isCurrent = index === currentStepIndex;

                     return (
                        <div key={step.status} className="flex flex-col items-center flex-1">
                           <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3 + (index * 0.1) }}
                              className={cn(
                                 "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-[4px] transition-all duration-500 shadow-md",
                                 isCompleted 
                                    ? "bg-emerald-500 border-emerald-200 text-white" 
                                    : "bg-white dark:bg-slate-900 border-muted text-muted-foreground"
                              )}
                           >
                              {isCompleted ? (
                                 <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                              ) : (
                                 <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                              )}
                           </motion.div>
                           
                           <div className="mt-4 text-center px-1">
                              <p className={cn(
                                 "text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1.5",
                                 isCompleted ? "text-emerald-600" : "text-muted-foreground"
                              )}>
                                 {step.label}
                              </p>
                              <p className="text-[9px] hidden sm:block sm:text-[11px] text-muted-foreground max-w-[70px] sm:max-w-[120px] mx-auto leading-tight font-medium">
                                 {step.desc}
                              </p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </motion.div>
      );
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
               <OrderTracking status={order.status} />
               <motion.div variants={fadeInUp} className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-6">
                     <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                           Order {order.orderNumber}
                           <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                           Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {order.status === "CANCELLED" && (
                           <div className="mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                              {order.cancelReason && (
                                 <p className="text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Reason: {order.cancelReason}
                                 </p>
                              )}
                              {order.paymentStatus === "PAID" && (
                                 <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-2 mt-2">
                                    <Clock className="w-4 h-4" />
                                    Refund Status: You will get refund soon
                                 </p>
                              )}
                           </div>
                        )}
                     </div>
                     <div className="lg:text-right">
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
                              <div className="flex flex-col items-end gap-2">
                                 <Badge variant="outline" className={cn("font-bold", getPaymentColor(order.paymentStatus))}>
                                    {order.paymentStatus}
                                 </Badge>
                                 <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => generateInvoicePDF(order)}
                                    className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold h-8 text-[10px] sm:text-xs"
                                 >
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    Download Invoice
                                 </Button>
                              </div>
                           </div>
                           <div className="pt-4 border-t space-y-2 text-muted-foreground">
                              <div className="flex justify-between">
                                 <span>Subtotal</span>
                                 <span>${(order.totalAmount + (order.discountAmount || 0)).toFixed(2)}</span>
                              </div>
                              {order.discountAmount && order.discountAmount > 0 ? (
                                 <div className="flex justify-between text-emerald-600">
                                    <span className="flex items-center gap-1"><Ticket className="w-4 h-4"/> Coupon Discount</span>
                                    <span>-${order.discountAmount.toFixed(2)}</span>
                                 </div>
                              ) : null}
                              <div className="flex justify-between">
                                 <span>Shipping</span>
                                 <span className="text-emerald-600 font-medium">Free</span>
                              </div>
                              <div className="flex justify-between text-foreground font-bold text-base pt-2 border-t">
                                 <span>Total Amount</span>
                                 <span>${order.totalAmount.toFixed(2)}</span>
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

                         <div className="text-right space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payment Status</p>
                            <Badge className={cn(
                               "rounded-full px-2 py-0 text-[10px] font-black",
                               order.paymentStatus === "PAID" ? "bg-green-100 text-green-700 border-none" : "bg-red-100 text-red-700 border-none"
                            )}>
                               {order.paymentStatus}
                            </Badge>
                         </div>

                        <p className="text-lg dark:text-white font-medium text-amber-900/90 italic leading-relaxed relative z-10">
                           "{order.reviews[0].comment}"
                        </p>
                     </div>
                  </motion.div>
               )}

               <motion.div variants={fadeInUp} className="bg-card border rounded-3xl p-3 lg:p-8 shadow-sm">
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
                           className="flex gap-4 p-3 sm:p-4 rounded-2xl border bg-background items-center transition-all"
                        >
                           <div className="h-16 w-16 sm:h-20 sm:w-20 bg-secondary rounded-xl overflow-hidden shrink-0 border">
                              {oi.item?.mainImage || (oi.item?.image && oi.item.image.length > 0) ? (
                                 <img src={oi.item.mainImage || oi.item.image[0]} alt={oi.item.name} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                 <div className="min-w-0">
                                    <Link href={`/products/${oi.item?.id}`} className="hover:text-primary transition-colors">
                                       <h4 className="font-bold text-base sm:text-lg leading-tight truncate">{oi.item?.name}</h4>
                                    </Link>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{oi.item?.weight} {oi.item?.isSpicy ? "🌶️" : ""}</p>
                                 </div>
                                 <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-0">
                                    <p className="font-black text-lg sm:text-xl text-primary sm:text-foreground">${oi.subTotal}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">${oi.unitPrice} x {oi.quantity}</p>
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
