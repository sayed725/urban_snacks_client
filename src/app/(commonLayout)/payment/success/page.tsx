import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Receipt, CreditCard, CalendarCheck } from "lucide-react";
import { getPaymentByOrderId } from "@/services/payment.service";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";

import { cn, formatPrice } from "@/lib/utils";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string; orderId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.orderId || resolvedSearchParams.order_id;

  let paymentInfo = null;
  if (orderId) {
    try {
      const res = await getPaymentByOrderId(orderId);
      paymentInfo = res.data;
    } catch (e) {
      // Payment might still be processing by the webhook, ignore error and show default success
    }
  }

  return (
    <div className="container mx-auto py-10 w-11/12 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <ClearCartOnSuccess />
      <div className="bg-card border shadow-xl p-8 sm:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 z-10 p-4 shadow-sm border-4 border-white">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-emerald-600 z-10 tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg mb-8 z-10 leading-relaxed">
          Thank you for your order. Your payment was processed successfully and we're getting your snacks ready.
        </p>

        <div className="w-full bg-muted/30 rounded-2xl p-6 mb-8 border border-border/50 text-left relative overflow-hidden shadow-inner space-y-4">
          {paymentInfo ? (
            <>
              <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-lg">Transaction Receipt</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Amount Paid</p>
                  <p className="font-bold text-lg">{formatPrice(Number(paymentInfo.amount || 0))}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Payment Status</p>
                  <p className="font-semibold text-emerald-600 bg-emerald-100/50 dark:text-white inline-block px-2 py-0.5 rounded-md">{paymentInfo.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" /> Transaction ID</p>
                  <p className="font-mono bg-muted py-1.5 px-2 rounded-md break-all text-xs border border-border/50 shadow-sm">
                    {paymentInfo.transactionId}
                  </p>
                </div>
              </div>
            </>
          ) : resolvedSearchParams.session_id ? (
            <div className="text-sm">
              <div className="flex items-center gap-2 font-bold mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Payment is Confirming
              </div>
              <p className="text-muted-foreground mb-4">We are fetching your secure payment slip...</p>
              <p className="font-semibold block mb-1">Session Reference:</p>
              <p className="font-mono bg-muted p-2 rounded break-all border text-xs">
                {resolvedSearchParams.session_id}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col  gap-4 w-full">
          <Button asChild size="lg" className="w-full text-lg h-14 rounded-xl bg-primary hover:bg-primary/90">
            <Link href="/my-orders">View My Orders</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full text-lg h-14 rounded-xl border-2">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
