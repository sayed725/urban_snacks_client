"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Percent, Tag, Copy, Check, TicketPercent } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "@/services/coupon.service";
import { ICoupon } from "@/types/coupon.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const themeGradients = [
  {
    gradient: "from-amber-500 to-orange-600",
    bgPattern: "bg-orange-50 dark:bg-orange-950/20",
    icon: Percent,
  },
  {
    gradient: "from-orange-400 to-red-500",
    bgPattern: "bg-red-50 dark:bg-red-950/20",
    icon: Tag,
  },
  {
    gradient: "from-yellow-500 to-amber-500",
    bgPattern: "bg-amber-50 dark:bg-amber-950/20",
    icon: Gift,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const CouponCard = ({ coupon, theme }: { coupon: ICoupon, theme: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const Icon = theme.icon;
  const title = coupon.discountType === "PERCENTAGE" 
    ? `${coupon.discountValue}% Off` 
    : `৳${coupon.discountValue} Off`;
  
  const defaultDescription = coupon.minOrderAmount 
    ? `Valid on orders above ৳${coupon.minOrderAmount}.` 
    : "Valid on all orders.";

  const description = coupon.description || defaultDescription;

  return (
    <motion.div variants={itemVariants} className="group relative h-full">
      {/* Outer Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradient} rounded-3xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
      
      {/* Card Container */}
      <div className={`relative h-full flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-500`}>
        
        {/* Top Content Area */}
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${coupon.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"} text-xs font-bold uppercase tracking-wider`}>
               <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
               {coupon.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed flex-1 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Ticket Separator */}
        <div className="relative h-4 flex items-center">
           <div className="absolute left-[-8px] w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800" />
           <div className="absolute right-[-8px] w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-950/50 border-l border-slate-200 dark:border-slate-800" />
           <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800 mx-4" />
        </div>

        {/* Bottom Code Area */}
        <div className={`p-6 ${theme.bgPattern} flex items-center justify-between gap-4 mt-auto`}>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Use Code</span>
             <span className="font-mono font-bold text-lg lg:text-xl text-slate-900 dark:text-white tracking-wider">{coupon.code}</span>
           </div>
           
           <button 
             onClick={handleCopy}
             className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all w-[110px]`}
           >
             {copied ? (
               <><Check className="w-4 h-4" /> Copied</>
             ) : (
               <><Copy className="w-4 h-4" /> Copy</>
             )}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const SpecialOffers = () => {
  const { data: couponsResponse, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getCoupons({ limit: 10 }),
  });

  const coupons = couponsResponse?.data || [];
  
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api, isHovered]);

  if (!isLoading && coupons.length === 0) {
    return null; 
  }

  return (
    <section className="py-10 bg-muted/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl mb-6">
            <TicketPercent className="w-8 h-8" />
          </div>
          <SectionHeader
            title="Special Offers"
            description="Grab these exclusive deals before they're gone — your taste buds will thank you!"
            badge="Limited Deals"
          />
        </div>

        {isLoading ? (
           <div className="flex justify-center py-10">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
           </div>
        ) : (
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="w-full"
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 pb-12 pt-4 px-2">
                {coupons.map((coupon, index) => (
                  <CarouselItem key={coupon.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-10%" }}
                      className="h-full"
                    >
                      <CouponCard 
                        coupon={coupon as any} 
                        theme={themeGradients[index % themeGradients.length]} 
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
