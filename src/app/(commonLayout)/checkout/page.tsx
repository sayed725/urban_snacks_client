"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/features/order/services/order.service";
import { toast } from "sonner";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

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

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order placed successfully!");
      clearCart();
      router.push("/my-orders");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order.");
    },
  });

  if (sessionLoading) {
    return <div className="container mx-auto py-24 text-center">Loading...</div>;
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
    const payload = {
      ...formData,
      paymentMethod: "COD",
      orderItems: items.map(i => ({ itemId: i.id, quantity: i.quantity }))
    };
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
                       <Input required value={formData.shippingName} onChange={e => setFormData({...formData, shippingName: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-semibold">Email Address</label>
                       <Input type="email" required value={formData.shippingEmail} onChange={e => setFormData({...formData, shippingEmail: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-semibold">Phone Number</label>
                       <Input required value={formData.shippingPhone} onChange={e => setFormData({...formData, shippingPhone: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-semibold">Delivery Address</label>
                       <Input required value={formData.shippingAddress} onChange={e => setFormData({...formData, shippingAddress: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" placeholder="Street address, apartment, suite, etc." />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-semibold">City</label>
                       <Input required value={formData.shippingCity} onChange={e => setFormData({...formData, shippingCity: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-semibold">Postal Code</label>
                       <Input required value={formData.shippingPostalCode} onChange={e => setFormData({...formData, shippingPostalCode: e.target.value})} className="h-12 bg-muted/50 focus:bg-background" />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-semibold">Delivery Instructions (Optional)</label>
                       <Textarea value={formData.additionalInfo} onChange={e => setFormData({...formData, additionalInfo: e.target.value})} className="bg-muted/50 focus:bg-background resize-none h-24" placeholder="Any special instructions for the rider?" />
                   </div>
                </div>
             </div>

             <div className="bg-card border shadow-sm p-6 sm:p-8 rounded-3xl pb-10">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                   <CreditCard className="w-6 h-6 text-primary" />
                   <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                <div className="border-2 border-primary bg-primary/5 rounded-xl p-4 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-4 border-primary bg-background"></div>
                      <div>
                         <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                         <p className="text-sm text-primary font-medium">Pay securely when you receive your snacks.</p>
                      </div>
                   </div>
                </div>
             </div>

             <Button 
               type="submit" 
               disabled={orderMutation.isPending} 
               className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-secondary shadow-xl shadow-primary/30 mt-8 transition-transform active:scale-[0.98]"
             >
               {orderMutation.isPending ? "Processing..." : `Place Order • $${totalPrice().toFixed(2)}`}
             </Button>
          </form>
        </div>

        {/* Right Sidebar: Light Cart Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
           <div className="bg-card border shadow-sm p-6 rounded-3xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 border-b pb-6">
                 {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                       <div className="flex gap-3 items-center w-3/4">
                          <div className="w-12 h-12 bg-secondary rounded-lg shrink-0 overflow-hidden border">
                              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
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
              <div className="space-y-3 font-medium">
                 <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-bold">Free</span>
                 </div>
                 <div className="flex justify-between text-2xl font-black pt-4 border-t mt-4">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice().toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
