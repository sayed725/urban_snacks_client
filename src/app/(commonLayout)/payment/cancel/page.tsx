"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, Truck, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/services/payment.service";
import { updatePaymentMethod } from "@/services/order.service";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { Suspense } from "react";

function CancelPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const router = useRouter();
  const { clearCart } = useCartStore();

  const retryMutation = useMutation({
    mutationFn: () => createCheckoutSession(orderId!),
    onSuccess: (res) => {
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to generate payment link");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to retry payment");
    }
  });

  const switchMutation = useMutation({
    mutationFn: () => updatePaymentMethod(orderId!, "COD"),
    onSuccess: () => {
      toast.success("Switched to Cash on Delivery!");
      clearCart();
      router.push("/my-orders");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to switch payment method");
    }
  });

  return (
    <div className="container mx-auto py-24 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="bg-card border shadow-xl p-8 sm:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-rose-500">Payment Unsuccessful</h1>
        <p className="text-muted-foreground text-lg mb-8">
          We couldn't process your payment. You can try again with a different card or switch to Cash on Delivery.
        </p>

        {orderId ? (
          <div className="flex flex-col gap-4 w-full">
            <Button
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending || switchMutation.isPending}
              size="lg"
              className="w-full text-lg h-14 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${retryMutation.isPending ? "animate-spin" : ""}`} />
              {retryMutation.isPending ? "Processing..." : "Retry Payment"}
            </Button>

            <Button
              onClick={() => switchMutation.mutate()}
              disabled={retryMutation.isPending || switchMutation.isPending}
              variant="outline"
              size="lg"
              className="w-full text-lg h-14 rounded-xl border-2 flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              Pay with Cash on Delivery
            </Button>

            <div className="mt-4 pt-6 border-t w-full">
              <Link href="/my-orders" className="text-primary hover:underline flex items-center justify-center gap-2 font-bold">
                <ArrowLeft className="w-4 h-4" /> Go to My Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <Button asChild size="lg" className="w-full text-lg h-14 rounded-xl bg-primary hover:bg-primary/90">
              <Link href="/checkout">Back to Checkout</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full text-lg h-14 rounded-xl border-2">
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-24 text-center">Loading...</div>}>
      <CancelPageContent />
    </Suspense>
  );
}
