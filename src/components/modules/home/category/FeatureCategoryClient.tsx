"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
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

const FeatureCategoryClient = ({categories}: {categories: any[]}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;
    
    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className='bg-muted/30 overflow-hidden'>
       <section className="py-10 container w-11/12 mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={headerVariants}
          className="flex flex-row justify-between items-center mb-8 sm:mb-10 gap-4"
        >
           <div className="flex-1">
              {/* Custom Mobile Header */}
              <div className="sm:hidden">
                 <h2 className="text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                 Categories
                 </h2>
              </div>
              {/* Standard SectionHeader for sm and up */}
              <div className="hidden sm:block">
                 <SectionHeader 
                    title="Shop by Category"
                    description="Find exactly what you're craving today."
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Carousel Navigation side by side with View All */}
              <div className="flex items-center gap-2">
                 <CarouselPrevious className="static translate-y-0 h-8 w-8 sm:h-10 sm:w-10 text-primary border-primary hover:bg-primary hover:text-white transition-colors" />
                 <CarouselNext className="static translate-y-0 h-8 w-8 sm:h-10 sm:w-10 text-primary border-primary hover:bg-primary hover:text-white transition-colors" />
              </div>

              <Button asChild variant="ghost" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold border-0 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-base">
                 <Link href="/products">View All <ArrowRight className=" hidden sm:block w-3 h-3 sm:w-4 sm:h-4 ml-1" /></Link>
              </Button>
           </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <CarouselContent className="-ml-3 md:-ml-4">
             {categories.map((cat) => (
                <CarouselItem key={cat.id} className="pl-3 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-[28%] lg:basis-1/5">
                  <motion.div variants={itemVariants}>
                    <Link href={`/products?category=${cat.id}`} className="block group relative overflow-hidden rounded-2xl h-36 sm:h-44 bg-secondary border hover:shadow-xl transition-all">
                       {cat.image && <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt={cat.name} />}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4">
                          <h3 className="text-white font-bold text-base sm:text-lg leading-tight mb-1">{cat.name}</h3>
                          <p className="text-white/80 text-[10px] sm:text-xs font-medium bg-black/40 w-fit px-2 py-0.5 rounded backdrop-blur-md">{cat._count?.items || 0} items</p>
                       </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
             ))}
          </CarouselContent>
        </motion.div>
      </Carousel>
      </section>
    </div>
  )
}

export default FeatureCategoryClient
