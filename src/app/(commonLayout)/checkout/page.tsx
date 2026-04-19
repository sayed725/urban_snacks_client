"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { ShieldCheck, Truck, CreditCard, Ticket, X, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { createCheckoutSession } from "@/services/payment.service";
import CheckoutLoadingSkeleton from "./_checkoutLoadingSkeleton";
import { createOrder } from "@/services/order.service";
import { verifyCoupon } from "@/services/coupon.service";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { items, totalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    shippingName: session?.user?.name || "",
    shippingEmail: session?.user?.email || "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    additionalInfo: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = totalPrice();
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    try {
      const res = await verifyCoupon(couponCode.trim().toUpperCase(), subtotal);
      setAppliedCoupon({
        code: couponCode.trim().toUpperCase(),
        discountAmount: res.data.discountAmount,
      });
      toast.success(
        `Coupon applied! You save $${res.data.discountAmount.toFixed(2)}`
      );
    } catch (error: any) {
      toast.error(error.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (response) => {
      const orderId = response.data?.id;

      if (paymentMethod === "STRIPE" && orderId) {
        try {
          const res = await createCheckoutSession(orderId);
          if (res.data?.url) {
            window.location.href = res.data.url;
            return;
          } else {
            toast.error("Failed to initialize payment gateway");
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to initiate payment.");
        }
      }

      toast.success("Order placed successfully!");
      clearCart();
      router.push("/my-orders");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order.");
    },
  });

  if (sessionLoading) {
    return <CheckoutLoadingSkeleton />;
  }

  if (!session) {
    return (
      <div className="container mx-auto py-32 text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">You're almost there!</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Please log in or create an account to securely checkout and track your snacks.
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-secondary text-lg">
            <Link href={`/login?redirect_url=/checkout`}>Login securely</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full text-lg">
            <Link href={`/register?redirect_url=/checkout`}>Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout unavailable</h1>
        <p className="text-muted-foreground mb-8 text-lg">Your cart is empty.</p>
        <Button asChild size="lg"><Link href="/products">Return to Store</Link></Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      ...formData,
      paymentMethod,
      orderItems: items.map(i => ({ itemId: i.id, quantity: i.quantity })),
    };
    if (appliedCoupon) {
      payload.couponCode = appliedCoupon.code;
    }
    orderMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black">Secure Checkout</h1>
        <p className="text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Your information is encrypted and secure.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-card border shadow-sm p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Truck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input required value={formData.shippingName} onChange={e => setFormData({ ...formData, shippingName: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" required value={formData.shippingEmail} onChange={e => setFormData({ ...formData, shippingEmail: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Phone Number</label>
                  <Input required value={formData.shippingPhone} onChange={e => setFormData({ ...formData, shippingPhone: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">Delivery Address</label>
                  <Input required value={formData.shippingAddress} onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" placeholder="Street address, apartment, suite, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">City</label>
                  <Input required value={formData.shippingCity} onChange={e => setFormData({ ...formData, shippingCity: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Postal Code</label>
                  <Input required value={formData.shippingPostalCode} onChange={e => setFormData({ ...formData, shippingPostalCode: e.target.value })} className="h-10 bg-muted/50 focus:bg-background" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">Delivery Instructions (Optional)</label>
                  <Textarea value={formData.additionalInfo} onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })} className="bg-muted/50 focus:bg-background resize-none h-24" placeholder="Any special instructions?" />
                </div>
              </div>
            </div>

            <div className="bg-card border shadow-sm p-6 sm:p-8 rounded-3xl pb-10">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* STRIPE Option */}
                <div
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "STRIPE" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${paymentMethod === "STRIPE" ? "border-primary bg-background" : "border-muted bg-background"}`}>
                      {paymentMethod === "STRIPE" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">Pay with Card / Stripe</p>
                      <p className="text-sm text-muted-foreground font-medium">Securely pay with your credit or debit card.</p>
                    </div>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${paymentMethod === "COD" ? "border-primary bg-background" : "border-muted bg-background"}`}>
                      {paymentMethod === "COD" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                      <p className="text-sm text-muted-foreground font-medium">Pay securely when you receive your snacks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={orderMutation.isPending}
              className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-secondary shadow-xl shadow-primary/30 mt-8 transition-transform active:scale-[0.98]"
            >
              {orderMutation.isPending ? "Processing..." : `Place Order • $${finalTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card border shadow-sm p-6 rounded-3xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 border-b pb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex gap-3 items-center w-3/4">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-xl overflow-hidden border transition-transform duration-300">
                    {item.mainImage || item.image ? (
                      <img src={item.mainImage || (Array.isArray(item.image) ? item.image[0] : item.image as string)} className="w-full h-full object-cover" alt="item" />
                    ) : (
                      <div className="w-full h-full text-[10px] flex items-center justify-center bg-muted text-muted-foreground">No image</div>
                    )}
                  </div>
                    <div>
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mb-6 border-b pb-6">
              <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-primary" />
                Have a coupon?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      (-${appliedCoupon.discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="uppercase font-mono h-10 bg-muted/50 focus:bg-background"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="h-10 px-4 shrink-0 font-semibold"
                  >
                    {couponLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 font-medium">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-4 border-t mt-4">
                <span>Total</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
