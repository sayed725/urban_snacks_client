"use client";

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart.store'
import React from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

const FeatureSnacksClient = ({ featuredItems }: { featuredItems: any[] }) => {
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

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
               {featuredItems.map((item) => (
                  <motion.div variants={itemVariants} key={item.id}>
                     <ProductCard product={item} />
                  </motion.div>
               ))}
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3, duration: 0.5 }}
               className="text-center mt-12"
            >
               <Button asChild size="lg" className=" px-8 h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold border-0">
                  <Link href="/products">Explore Full Catalog <ArrowRight className="w-5 h-5 ml-2" /></Link>
               </Button>
            </motion.div>
         </div>
      </section>
   )
}

export default FeatureSnacksClient
