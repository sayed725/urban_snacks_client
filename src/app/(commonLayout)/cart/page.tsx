"use client";

import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border p-4 rounded-xl items-center bg-card">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="bg-card border p-6 rounded-xl h-fit">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between border-b pb-4 mb-4">
              <span>Total</span>
              <span className="font-bold">${totalPrice().toFixed(2)}</span>
            </div>
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
