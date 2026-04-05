"use client";

import HeroSlider from "@/components/modules/home/HeroSlider";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/features/category/services/category.service";
import { getItems } from "@/features/item/services/item.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: catResponse, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 10 }),
  });
  
  const { data: featuredResponse, isLoading: featuredLoading } = useQuery({
    queryKey: ["items", { isFeatured: true }],
    queryFn: () => getItems({ isFeatured: true, limit: 6 }),
  });

  const categories = catResponse?.data || [];
  const featuredItems = featuredResponse?.data || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* Trust & Features Banner */}
      <section className="bg-secondary text-secondary-foreground py-8 border-y">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><ShoppingBag className="w-8 h-8" /></div>
                  <h3 className="font-bold">Premium Snacks</h3>
                  <p className="text-sm text-muted-foreground mt-1">Curated quality</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><Zap className="w-8 h-8" /></div>
                  <h3 className="font-bold">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground mt-1">Right to your door</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><Star className="w-8 h-8" /></div>
                  <h3 className="font-bold">Top Rated</h3>
                  <p className="text-sm text-muted-foreground mt-1">Loved by thousands</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><span className="text-3xl">🛡️</span></div>
                  <h3 className="font-bold">Secure Checkout</h3>
                  <p className="text-sm text-muted-foreground mt-1">100% protected</p>
               </div>
            </div>
         </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 container mx-auto">
        <div className="flex justify-between items-end mb-10">
           <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Find exactly what you're craving today.</p>
           </div>
           <Button asChild variant="ghost" className="hidden sm:flex hover:text-primary">
              <Link href="/products">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
           </Button>
        </div>

        {catsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {categories.map((cat, idx) => (
                  <Link href={`/products?category=${cat.id}`} key={cat.id} className="group relative overflow-hidden rounded-2xl h-40 bg-secondary border hover:shadow-lg transition-all">
                     {cat.image && <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt={cat.name} />}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                        <p className="text-white/80 text-xs">{cat._count?.items || 0} items</p>
                     </div>
                  </Link>
               ))}
            </div>
        )}
      </section>

      {/* Featured Snacks */}
      <section className="py-20 px-4 bg-muted/30">
         <div className="container mx-auto">
            <div className="text-center mb-12 max-w-2xl mx-auto">
               <Badge className="mb-4 bg-amber-500 text-white border-none py-1 px-3">Top Picks</Badge>
               <h2 className="text-3xl md:text-5xl font-black mb-4">Trending Snacks</h2>
               <p className="text-muted-foreground text-lg">Our most popular and highly demanded treats that everyone is talking about.</p>
            </div>

            {featuredLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                   {[1,2,3].map(i => <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                   {featuredItems.map((item) => (
                      <Link href={`/products/${item.id}`} key={item.id} className="group flex flex-col border rounded-3xl overflow-hidden shadow-sm bg-card hover:shadow-xl transition-all duration-300">
                         <div className="relative h-64 w-full bg-secondary overflow-hidden">
                            {item.image ? (
                               <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                               <div className="flex items-center justify-center w-full h-full text-muted-foreground">No Image</div>
                            )}
                            {item.isSpicy && <Badge className="absolute top-4 right-4 bg-red-500 text-white border-none shadow-md">Spicy 🌶️</Badge>}
                         </div>
                         <div className="p-6">
                            <div className="text-xs text-primary font-bold tracking-wider mb-2 uppercase">
                               {item.category?.name}
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                            <div className="flex items-center justify-between mt-4 border-t pt-4">
                               <div className="font-black text-2xl text-emerald-600">${item.price}</div>
                               <Button variant="outline" className="group-hover:bg-primary group-hover:text-secondary group-hover:border-primary transition-colors">
                                  View Item
                               </Button>
                            </div>
                         </div>
                      </Link>
                   ))}
                </div>
            )}

            <div className="text-center mt-12">
               <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg bg-primary text-secondary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/products">Explore Full Catalog <ArrowRight className="w-5 h-5 ml-2" /></Link>
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
}
