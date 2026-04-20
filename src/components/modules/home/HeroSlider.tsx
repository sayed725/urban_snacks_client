"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getBanners } from "@/services/banner.service";
import { IBanner } from "@/types/banner.type";

const defaultSlides = [
  {
    id: 1,
    title: "Urban Snacks Collection",
    subtitle: "Discover the perfect bite for every moment. Sweet, salty, and savory treats curated from premium ingredients.",
    badge: "Welcome to Urban Snacks 🎉",
    image: "/assets/urban_snaks_cover_photo.jpg",
  },
  {
    id: 2,
    title: "Fiery & Crunchy Delights",
    subtitle: "Turn up the heat with our selection of bold, intensely flavored snacks that pack a serious punch.",
    badge: "Trending Now 🌶️",
    image: "/assets/urban_snaks_photo1.jpg",
  },
  {
    id: 3,
    title: "Sweet Tooth Satisfaction",
    subtitle: "Indulge your cravings with our artisanal chocolates, gourmet candies, and freshly baked goods.",
    badge: "Our Bestsellers 🍫",
    image: "/assets/urban_snaks_photo2.jpg",
  },
  {
    id: 4,
    title: "Healthy & Wholesome",
    subtitle: "Guilt-free nutrition that doesn't compromise on flavor. Fuel your daily hustle with our organic selections.",
    badge: "Staff Picks 🍃",
    image: "/assets/urban_snaks_photo3.jpg",
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await getBanners({ isActive: true });
        if (data && data.length > 0) {
          // Filter only banners where banner field is true
          const activeBanners = data.filter(b => b.banner);
          if (activeBanners.length > 0) {
             setSlides(activeBanners.sort((a, b) => (a.order || 0) - (b.order || 0)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (isLoading) {
    return <section className="relative w-full h-[90vh] md:h-[75vh] bg-black animate-pulse"></section>;
  }

  if (slides.length === 0) return null;

  return (
    <section 
      className="relative w-full h-[90vh] md:h-[75vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image || "/assets/urban_snaks_cover_photo.jpg"}
            alt={slides[current].title || "Banner"}
            fill
            priority
            className="object-cover"
          />
          {/* Enhanced Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 h-[90%] container mx-auto w-11/12 flex items-center z-10">
        <div className="text-white max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide text-orange-200 uppercase shadow-lg shadow-black/20"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                {slides[current].badge}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-5xl md:text-7xl font-black leading-tight tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                {slides[current].title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-xl"
              >
                {slides[current].subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4"
              >
                <Button asChild className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full shadow-xl shadow-orange-500/20 transition-all duration-300 font-bold text-lg lg:px-10 lg:py-7 hover:scale-[1.02] border-0">
                  <Link href="/products">
                    <span className="relative z-10 flex items-center gap-2">
                       Shop the Collection
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-6 md:right-12 flex items-center gap-6 z-20 ">
        <div className="flex gap-4">
          <button
            onClick={prevSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Hero Progress Dots */}
      <div className="absolute bottom-12 left-6 md:left-12 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative h-2.5 flex items-center cursor-pointer overflow-hidden rounded-full shadow-sm"
            aria-label={`Go to slide ${i + 1}`}
          >
            <motion.div
               animate={{ 
                 width: current === i ? 40 : 10,
                 backgroundColor: current === i ? "rgba(249, 115, 22, 1)" : "rgba(255, 255, 255, 0.4)" 
               }}
               transition={{ duration: 0.3 }}
               className="h-full rounded-full"
            />
          </button>
        ))}
      </div>
    </section>
  );
}