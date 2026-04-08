import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FeatureSnacks = ({featuredLoading, featuredItems}: {featuredLoading: boolean, featuredItems: any[]}) => {
  return (
    <section className="py-20 px-4 bg-muted/30">
         <div className="container mx-auto">
            <div className="text-center mb-12 max-w-2xl mx-auto">
               <Badge className="mb-4 bg-amber-500 text-white border-none py-1 px-3">Top Picks</Badge>
               <h2 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Trending Snacks</h2>
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
  )
}

export default FeatureSnacks