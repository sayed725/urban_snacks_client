"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeatureCategory = ({catsLoading, categories}: {catsLoading: boolean, categories: any[]}) => {
  return (
    <div className='bg-muted/30 overflow-hidden'>
       <section className="py-10 container w-11/12 mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={headerVariants}
          className="flex justify-between items-end mb-10"
        >
           <div>
              <SectionHeader
                 title="Shop by Category"
                 description="Find exactly what you're craving today."
              />
           </div>
           <Button asChild variant="ghost" className="hidden sm:flex bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold border-0">
              <Link href="/products">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
           </Button>
        </motion.div>

        {catsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
            </div>
        ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
               {categories.map((cat, idx) => (
                  <motion.div variants={itemVariants} key={cat.id}>
                    <Link href={`/products?category=${cat.id}`} className="block group relative overflow-hidden rounded-2xl h-40 bg-secondary border hover:shadow-lg transition-all">
                       {cat.image && <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt={cat.name} />}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                          <p className="text-white/80 text-xs">{cat._count?.items || 0} items</p>
                       </div>
                    </Link>
                  </motion.div>
               ))}
            </motion.div>
        )}
      </section>
    </div>
  )
}

export default FeatureCategory