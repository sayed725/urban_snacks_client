"use client";

import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/features/item/services/item.service";
import { getCategories } from "@/features/category/services/category.service";
import { useCartStore } from "@/store/cart.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "");
  const [isSpicy, setIsSpicy] = useState(false);
  const [sortByOption, setSortByOption] = useState<string>("createdAt-desc");

  useEffect(() => {
    setSelectedCategory(categoryParam || "");
  }, [categoryParam]);

  const updateCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("category", id);
    } else {
      params.delete("category");
    }
    router.replace(`/products?${params.toString()}`);
    setSelectedCategory(id);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { addItem } = useCartStore();

  const { data: catResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const categories = catResponse?.data || [];

  const sortParams = sortByOption.split("-");
  const sortBy = sortParams[0];
  const sortOrder = sortParams[1] as "asc" | "desc";

  const { data: itemResponse, isLoading } = useQuery({
    queryKey: ["items", { search: debouncedSearchTerm, categoryId: selectedCategory, isSpicy, sortBy, sortOrder }],
    queryFn: () => getItems({ 
      searchTerm: debouncedSearchTerm || undefined, 
      categoryId: selectedCategory || undefined,
      isSpicy: isSpicy ? true : undefined,
      sortBy: sortBy,
      sortOrder: sortOrder,
      limit: 50 
    }),
  });
  const products = itemResponse?.data || [];

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Our Snacks</h1>
          <p className="text-muted-foreground mt-2">Find the perfectly curated snacks for your cravings</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3 relative flex-wrap sm:flex-nowrap">
           <div className="relative w-full sm:w-[250px] md:w-[300px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search snacks..." 
               className="pl-9 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div className="w-full sm:w-[180px]">
             <Select value={sortByOption} onValueChange={setSortByOption}>
               <SelectTrigger className="w-full bg-background border-slate-200 dark:border-slate-800">
                 <SelectValue placeholder="Sort by" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="createdAt-desc">Newest Arrivals</SelectItem>
                 <SelectItem value="price-asc">Price: Low to High</SelectItem>
                 <SelectItem value="price-desc">Price: High to Low</SelectItem>
                 <SelectItem value="name-asc">Name: A to Z</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="p-5 bg-card border rounded-xl shadow-sm">
             <div className="flex items-center gap-2 mb-4 font-semibold text-lg border-b pb-2">
                <Filter className="w-5 h-5" /> Filters
             </div>
             
             <div className="space-y-4">
                <div>
                   <h3 className="font-medium mb-3 text-sm text-muted-foreground">Category</h3>
                   <div className="space-y-2">
                      <div 
                         className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm ${selectedCategory === "" ? "bg-primary text-secondary font-medium" : "hover:bg-muted"}`}
                         onClick={() => updateCategory("")}
                      >
                         All Snacks
                      </div>
                      {categories.map(cat => (
                         <div 
                           key={cat.id} 
                           className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm ${selectedCategory === cat.id ? "bg-primary text-secondary font-medium" : "hover:bg-muted"}`}
                           onClick={() => updateCategory(cat.id)}
                         >
                           {cat.name}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="border-t pt-4">
                   <h3 className="font-medium mb-3 text-sm text-muted-foreground">Preferences</h3>
                   <div className="flex items-center justify-between">
                      <label className="text-sm cursor-pointer flex items-center gap-2" htmlFor="spicy-mode">
                         <span className="text-lg">🌶️</span> Spicy Only
                      </label>
                      <Switch id="spicy-mode" checked={isSpicy} onCheckedChange={setIsSpicy} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
           {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-80 bg-card border rounded-xl animate-pulse" />
                 ))}
             </div>
           ) : products.length === 0 ? (
             <div className="text-center py-20 bg-card border rounded-xl">
                 <div className="text-6xl mb-4">🍩</div>
                 <h2 className="text-2xl font-bold">No snacks found</h2>
                 <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                 <Button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold px-6 hover:scale-105 border-0" onClick={() => { setSearchTerm(""); updateCategory(""); setIsSpicy(false); }}>
                    Clear Filters
                 </Button>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col border rounded-2xl overflow-hidden shadow-sm bg-card hover:shadow-xl transition-all duration-300">
                    <Link href={`/products/${product.id}`} className="block relative h-48 w-full bg-secondary overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">No Image</div>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {product.isFeatured && <Badge className="bg-amber-500 text-white border-none shadow-md shadow-amber-500/20">Featured</Badge>}
                        {product.isSpicy && <Badge className="bg-red-500 text-white border-none shadow-md shadow-red-500/20">Spicy 🌶️</Badge>}
                      </div>
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-primary font-bold tracking-wider mb-1 uppercase">
                         {product.category?.name}
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <h2 className="text-lg font-bold hover:text-primary transition-colors line-clamp-1">{product.name}</h2>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1 line-clamp-2">
                         {product.description || `Delicious ${product.name} to satisfy your cravings.`}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t">
                         <div className="flex flex-col">
                            <span className="text-lg font-black text-emerald-600">${product.price}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{product.weight}</span>
                         </div>
                         <Button 
                           onClick={() => addItem(product as any, 1)}
                           className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-500/25 transition-all duration-300 font-semibold shrink-0 hover:scale-105 border-0"
                         >
                           <ShoppingCart className="w-4 h-4 mr-2" /> Add
                         </Button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading snacks...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
