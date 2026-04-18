"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemById } from "@/services/item.service";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, CheckCircle2, Package, Flame, Sparkles, Weight, Calendar, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";
import SectionHeader from "@/components/shared/SectionHeader";
import { getItems } from "@/services/item.service";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: response, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
  });

  const product = response?.data;

  // Build gallery array from mainImage + image[]
  const allImages: string[] = product
    ? [product.mainImage, ...(Array.isArray(product.image) ? product.image : [])].filter(Boolean) as string[]
    : [];

  // Related products query
  const { data: relatedResponse } = useQuery({
    queryKey: ["related-items", product?.categoryId, id],
    queryFn: () => getItems({ 
      categoryId: product?.categoryId, 
      limit: 5,
    }),
    enabled: !!product?.categoryId,
  });

  const relatedItems = relatedResponse?.data?.filter((item: any) => item.id !== id).slice(0, 4) || [];

  const nextImage = () => {
    if (allImages.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 pt-8 pb-20">
          <div className="h-6 bg-muted rounded w-32 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24 space-y-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-3xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse pt-4">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-10 bg-muted rounded w-40" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded-2xl" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
              <div className="h-px bg-muted w-full" />
              <div className="flex items-center gap-4">
                <div className="h-11 bg-muted rounded-xl w-36" />
                <div className="h-6 bg-muted rounded w-32 ml-auto" />
              </div>
              <div className="h-14 bg-muted rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Snack not found</h1>
          <p className="text-muted-foreground">The snack you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/products"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Store</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-8 pb-20">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left: Image Gallery — Sticky */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4 lg:sticky lg:top-24"
          >
            {/* Hero Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary border border-white/10 shadow-2xl shadow-black/5 group">
              <AnimatePresence mode="wait">
                {allImages.length > 0 ? (
                  <motion.img
                    key={allImages[activeImageIndex]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    src={allImages[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="w-16 h-16 opacity-30" />
                  </div>
                )}
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-2 left-2  z-10">
                {product.isFeatured && (
                  <Badge className="bg-amber-500/90 text-white backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-3 h-3 mr-1" /> Best Seller
                  </Badge>
                )}
              </div>

              <div className="absolute top-2 right-2 z-10">
                   {product.isSpicy && (
                  <Badge className="bg-red-500/90 text-white backdrop-blur-md border-none py-1.5 px-3 text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-500/20">
                    <Flame className="w-3 h-3 mr-1" /> Spicy
                  </Badge>
                )}
              </div>

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    {activeImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 shadow-sm",
                      activeImageIndex === i
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col pt-2"
          >
            {/* Category */}
            <div className="text-primary font-bold tracking-widest uppercase text-xs mb-3">
              {product.category?.name}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3">
              {product.name}
            </h1>

            {/* Semi-title */}
            {product.semiTitle && (
              <p className="text-lg text-muted-foreground/80 font-medium italic mb-5">
                &ldquo;{product.semiTitle}&rdquo;
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-emerald-600">${product.price}</span>
            </div>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 bg-muted/40 rounded-2xl px-4 py-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Weight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Weight</p>
                  <p className="font-bold text-sm">{product.weight}</p>
                </div>
              </div>

              {product.packSize && (
                <div className="flex items-center gap-3 bg-muted/40 rounded-2xl px-4 py-3 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Pack Size</p>
                    <p className="font-bold text-sm">{product.packSize} pcs</p>
                  </div>
                </div>
              )}

              {product.expiryDate && (
                <div className="flex items-center gap-3 bg-muted/40 rounded-2xl px-4 py-3 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Best Before</p>
                    <p className="font-bold text-sm">{new Date(product.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-emerald-500/5 rounded-2xl px-4 py-3 border border-emerald-500/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Status</p>
                  <p className="font-bold text-sm text-emerald-600">In Stock</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {(product.description) && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">About this snack</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="mt-auto space-y-5 pt-6 border-t">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-muted-foreground">Quantity</span>
                <div className="flex items-center bg-muted/50 rounded-xl border overflow-hidden">
                  <button
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-14 h-11 flex items-center justify-center font-bold text-lg border-x">{quantity}</div>
                  <button
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground ml-auto font-medium">
                  Total: <span className="text-foreground font-bold text-lg">${(product.price * quantity).toFixed(2)}</span>
                </span>
              </div>

              {/* Add to Cart Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg"
                  className="w-full h-10 lg:h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 border-0"
                  onClick={() => addItem(product as any, quantity)}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        {relatedItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-28 space-y-12"
          >
            <div className="max-w-2xl">
               <SectionHeader
                  title="You Might Also Like"
                  badge="Related Snacks"
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedItems.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
