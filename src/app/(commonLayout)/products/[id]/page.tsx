"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemById } from "@/services/item.service";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

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

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
  });

  const product = response?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 min-h-screen pt-20 animate-pulse flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 h-[500px] bg-muted rounded-2xl"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-40 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Snack not found</h1>
        <Button asChild><Link href="/products"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Store</Link></Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="container mx-auto py-12 px-4 min-h-screen pt-8"
    >
      <motion.div variants={fadeInUp}>
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
        </Link>
      </motion.div>

      <motion.div 
        variants={fadeInUp}
        className="bg-card border rounded-3xl overflow-hidden shadow-lg shadow-muted flex flex-col md:flex-row"
      >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative bg-secondary min-h-[400px]">
          {product.image ? (
            <motion.img 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover absolute inset-0" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground absolute inset-0">No Image Available</div>
          )}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.isFeatured && <Badge className="bg-amber-500 text-white border-none py-1.5 px-3 text-sm shadow-md">Featured</Badge>}
            {product.isSpicy && <Badge className="bg-red-500 text-white border-none py-1.5 px-3 text-sm shadow-md">Spicy 🌶️</Badge>}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
           <motion.div variants={fadeInUp} className="text-primary font-bold tracking-wider mb-2 uppercase text-sm">
              {product.category?.name}
           </motion.div>
           <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4 leading-tight">{product.name}</motion.h1>
           
           <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-emerald-600">${product.price}</span>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                 Weight: {product.weight}
              </span>
           </motion.div>

           <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 leading-relaxed">
             {product.description || "No description provided for this item. But trust us, it's delicious!"}
           </motion.p>

           <motion.div variants={fadeInUp} className="space-y-4 border-y py-6 mb-8">
              <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-emerald-600">Available In Stock</span>
              </div>
           </motion.div>

           <div className="mt-auto">
              <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
                 <span className="font-medium text-muted-foreground">Quantity:</span>
                 <div className="flex items-center border rounded-lg h-12 w-32">
                    <button 
                      className="w-10 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >-</button>
                    <div className="flex-1 text-center font-bold">{quantity}</div>
                    <button 
                      className="w-10 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                 </div>
              </motion.div>

              <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                   size="lg" 
                   className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-secondary shadow-lg shadow-primary/20"
                   onClick={() => addItem(product as any, quantity)}
                >
                   <ShoppingCart className="w-5 h-5 mr-3" />
                   Add to Cart
                </Button>
              </motion.div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
