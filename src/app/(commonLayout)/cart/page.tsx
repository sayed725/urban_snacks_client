"use client";

import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();

  const handleQuantity = (id: string, current: number, delta: number) => {
    const newQ = current + delta;
    if (newQ > 0) {
      updateQuantity(id, newQ);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
           <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added any delicious snacks to your cart yet. Head back to the store to explore our collection.
        </p>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold text-lg px-8 py-6 hover:scale-105 border-0">
          <Link href="/products">Browse Snacks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
             <span className="font-semibold text-muted-foreground">{totalItems()} Items</span>
             <Button variant="ghost" className="text-destructive hover:bg-red-50 hover:text-destructive" onClick={clearCart}>
                <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
             </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-card border rounded-2xl gap-4 sm:gap-6 shadow-sm">
                <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-primary font-bold uppercase mb-1">{item.category?.name}</div>
                  <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
                     <h3 className="text-lg font-bold truncate">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">${item.price} • {item.weight}</p>
                </div>

                <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                  <div className="flex items-center border rounded-lg h-10 w-28 bg-background">
                    <button 
                      className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
                      onClick={() => handleQuantity(item.id, item.quantity, -1)}
                    ><Minus className="w-4 h-4" /></button>
                    <div className="flex-1 text-center font-bold text-sm">{item.quantity}</div>
                    <button 
                      className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                      onClick={() => handleQuantity(item.id, item.quantity, 1)}
                    ><Plus className="w-4 h-4" /></button>
                  </div>

                  <div className="font-black text-lg w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card border rounded-3xl p-8 shadow-md sticky top-24">
             <h2 className="text-xl font-bold mb-6">Order Summary</h2>
             
             <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span className="font-medium">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Shipping</span>
                   <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                   <span className="text-base font-bold">Total</span>
                   <span className="text-2xl font-black text-emerald-600">${totalPrice().toFixed(2)}</span>
                </div>
             </div>

             <Button asChild className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-bold text-lg hover:scale-[1.02] border-0">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
             </Button>

             <div className="mt-6 text-center">
                <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  or Continue Shopping
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
