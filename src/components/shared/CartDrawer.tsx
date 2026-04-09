import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  className?: string;
  isMobile?: boolean;
}

export function CartDrawer({ className, isMobile = false }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantity = (id: string, current: number, delta: number) => {
    const newQ = current + delta;
    if (newQ > 0) {
      updateQuantity(id, newQ);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "relative group flex items-center justify-center transition-all outline-none",
            isMobile 
              ? "mr-1 p-2 rounded-full border border-transparent hover:bg-orange-50 dark:hover:bg-orange-500/10" 
              : "p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-200 dark:hover:border-orange-500/30 shadow-sm hover:shadow",
            className
          )}
        >
          <ShoppingCart className="h-5 w-5 text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors" />
          <AnimatePresence>
            {mounted && totalItems() > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={cn(
                  "absolute bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center rounded-full shadow-md ring-2 ring-white dark:ring-black",
                  isMobile 
                     ? "-top-1 -right-1 text-[10px] h-4 w-4" 
                     : "-top-1.5 -right-1.5 text-[10px] h-5 min-w-[20px] px-1.5"
                )}
              >
                {totalItems()}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-[450px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
             <ShoppingBag className="w-6 h-6 text-primary" />
             Your Cart <span className="text-muted-foreground text-sm font-normal ml-2">({mounted ? totalItems() : 0} items)</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your shopping cart, adjust quantities, or proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto w-full p-4 space-y-4">
          {!mounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some delicious snacks to see them here.</p>
              <Button asChild className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg border-0" onClick={() => setOpen(false)}>
                <Link href="/products">Browse Snacks</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-xs">No img</div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <div className="text-primary font-bold text-sm my-1">${item.price}</div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border rounded-lg h-8 bg-background">
                      <button 
                         className="w-6 h-full flex items-center justify-center hover:bg-muted rounded-l-lg"
                         onClick={() => handleQuantity(item.id, item.quantity, -1)}
                      ><Minus className="w-3 h-3" /></button>
                      <div className="text-sm font-bold w-6 text-center">{item.quantity}</div>
                      <button 
                         className="w-6 h-full flex items-center justify-center hover:bg-muted rounded-r-lg"
                         onClick={() => handleQuantity(item.id, item.quantity, 1)}
                      ><Plus className="w-3 h-3" /></button>
                    </div>
                    
                    <button 
                       onClick={() => removeItem(item.id)}
                       className="p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive rounded-lg transition-colors"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="border-t p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-muted-foreground">Total:</span>
              <span className="text-2xl font-black text-emerald-600">${totalPrice().toFixed(2)}</span>
            </div>
            <Button asChild className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-bold text-lg hover:scale-[1.02] border-0" onClick={() => setOpen(false)}>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <div className="text-center mt-4">
              <Link href="/cart" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                View full cart page
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
