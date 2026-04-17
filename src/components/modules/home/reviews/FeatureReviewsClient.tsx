"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IReview } from "@/types/review.type";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ReviewCard = ({ review }: { review: IReview }) => {
  const userInitial = review.customer?.name?.charAt(0) || "U";
  
  return (
    <motion.div variants={itemVariants} className="h-full py-4">
      <Card className="h-full border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden group">
        <CardContent className="p-8 flex flex-col h-full relative">
          {/* Quote Decor */}
          <div className="absolute top-6 right-8 text-orange-500/10 group-hover:text-orange-500/20 transition-colors duration-500">
            <Quote size={80} fill="currentColor" />
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-6 relative z-10">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  "transition-all duration-300",
                  i < review.rating
                    ? "fill-amber-500 text-amber-500 scale-110"
                    : "text-slate-300 dark:text-slate-700"
                )}
              />
            ))}
          </div>

          {/* Comment */}
          <blockquote className="flex-grow mb-8 relative z-10">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-4">
              "{review.comment}"
            </p>
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <Avatar className="h-12 w-12 border-2 border-orange-500/30 group-hover:border-orange-500 transition-colors duration-500">
              <AvatarImage src={review.customer?.image || ""} alt={review.customer?.name} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                {review.customer?.name || "Happy Customer"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Buyer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeatureReviewsClient = ({ reviews }: { reviews: IReview[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (!api || isHovered) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api, isHovered]);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent dark:via-orange-950/10 overflow-hidden">
      <div className="container mx-auto w-11/12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
             <SectionHeader
                title="What Our Foodies Say"
                description="Real stories from our community about their favorite Urban Snacks moments. We take pride in every crunch and every smile."
                badge="Customer Love"
             />
          </div>

          {/* Carousel */}
          <div 
            className="relative px-4 sm:px-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <ReviewCard review={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="hidden sm:block">
                <CarouselPrevious className="absolute -left-4 lg:-left-6 h-12 w-12 rounded-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-lg" />
                <CarouselNext className="absolute -right-4 lg:-right-6 h-12 w-12 rounded-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-lg" />
              </div>
            </Carousel>
          </div>

          {/* CTA Footer */}
          {/* <motion.div variants={itemVariants} className="text-center pt-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
              Join <span className="text-orange-500 font-bold">5,000+</span> happy snackers across the city 🍿
            </p>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureReviewsClient;
