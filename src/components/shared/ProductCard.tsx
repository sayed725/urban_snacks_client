"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { IItem } from "@/types/item.type";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IItem;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addItem } = useCartStore();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group flex flex-col border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white/70 dark:bg-black/40 backdrop-blur-xl h-full",
        className
      )}
    >
      {/* Image Section */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-64 w-full bg-secondary overflow-hidden block"
      >
        {product.image ? (
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/30 italic">
            No Sweet Pixels
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 ">
          {product.isSpicy && (
            <Badge className="bg-red-500/90 text-white backdrop-blur-md border-none px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-red-500/20">
              <Flame className="w-3 h-3 mr-1" /> Spicy
            </Badge>
          )}        
        </div>
        <div className="absolute top-2 left-2 ">
        {product.isFeatured && (
            <Badge className="bg-amber-500/90 text-white backdrop-blur-md border-none px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-amber-500/20">
              <Sparkles className="w-3 h-3 mr-1" /> Best Seller
            </Badge>
          )}
          </div>


        {/* Quick View Overlay (Visual only for premium feel) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-black/90 text-black dark:text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-tighter backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-transform">
            View Details
          </div>
        </div>
      </Link>

      {/* Content Section */}



      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="text-xs text-primary font-bold tracking-wider mb-2 uppercase">
            {product.category?.name}
          </div>
          <Link href={`/products/${product.id}`} className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{product.name}</Link>
        </div>
        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <div className="font-black text-2xl text-emerald-600">${product.price}</div>
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-500/25 transition-all duration-300 font-semibold shrink-0 hover:scale-105 border-0 z-10 relative"
            onClick={(e) => {
              e.preventDefault();
              addItem(product as any, 1);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductCard;
