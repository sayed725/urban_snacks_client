"use client";

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart.store'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeatureSnacks = ({ featuredLoading, featuredItems }: { featuredLoading: boolean, featuredItems: any[] }) => {
   const { addItem } = useCartStore();
   return (
      <section className="py-10 bg-muted/30 overflow-hidden">
         <div className="container mx-auto w-11/12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={headerVariants}
              className="text-center mb-10 max-w-2xl mx-auto"
            >
               <SectionHeader
                  title="Trending Snacks"
                  description="Our most popular and highly demanded treats that everyone is talking about."
                  badge="Top Picks"
               />
            </motion.div>

            {featuredLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />)}
               </div>
            ) : (
               <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-10%" }}
                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8"
               >
                  {featuredItems.map((item) => (
                     <motion.div variants={itemVariants} key={item.id} className="group flex flex-col border rounded-3xl overflow-hidden shadow-sm bg-card hover:shadow-xl transition-all duration-300">
                        <div className="relative h-64 w-full bg-secondary overflow-hidden">
                           {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           ) : (
                              <div className="flex items-center justify-center w-full h-full text-muted-foreground">No Image</div>
                           )}
                           {item.isSpicy && <Badge className="absolute top-4 right-4 bg-red-500 text-white border-none shadow-md">Spicy 🌶️</Badge>}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                           <div className="flex-grow">
                              <div className="text-xs text-primary font-bold tracking-wider mb-2 uppercase">
                                 {item.category?.name}
                              </div>
                              <Link href={`/products/${item.id}`} className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
                           </div>
                           <div className="flex items-center justify-between mt-4 border-t pt-4">
                              <div className="font-black text-2xl text-emerald-600">${item.price}</div>
                              <Button 
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-500/25 transition-all duration-300 font-semibold shrink-0 hover:scale-105 border-0 z-10 relative"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addItem(item as any, 1);
                                }}
                              >
                                 <ShoppingCart className="w-4 h-4 mr-2" /> Add
                              </Button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </motion.div>
            )}

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3, duration: 0.5 }}
               className="text-center mt-12"
            >
               <Button asChild size="lg" className="rounded-md px-8 h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold border-0">
                  <Link href="/products">Explore Full Catalog <ArrowRight className="w-5 h-5 ml-2" /></Link>
               </Button>
            </motion.div>
         </div>
      </section>
   )
}

export default FeatureSnacks