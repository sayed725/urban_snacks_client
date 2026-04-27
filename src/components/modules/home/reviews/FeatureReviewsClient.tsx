"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
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
    <motion.div
      variants={itemVariants}
      className="w-[350px] md:w-[450px] shrink-0"
    >
      <div className="relative group">
        {/* Card Background Bloom */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition duration-700" />

        <Card className="relative h-full border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex flex-col h-full relative">
            {/* Quote Icon - subtle background element */}
            <div className="absolute top-0 right-0 text-orange-500/5 group-hover:text-orange-500/10 transition-colors duration-500">
              <Quote size={100} fill="currentColor" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-5 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    "transition-all duration-300",
                    i < review.rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-slate-200 dark:text-slate-800"
                  )}
                />
              ))}
            </div>

            {/* Comment */}
            <div className="flex-grow mb-5 relative z-10">
              <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                "{review.comment}"
              </p>
            </div>

            {/* Author Section */}
            <div className="flex items-center gap-4 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-orange-500/20 group-hover:border-orange-500/50 transition-colors duration-500">
                  <AvatarImage src={review.customer?.image || ""} alt={review.customer?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white dark:fill-black" />
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors duration-300 flex items-center gap-1.5">
                  {review.customer?.name || "Happy Customer"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                    Verified Buyer
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export const FeatureReviewsSkeleton = () => {
  return (
    <section className="py-10 bg-muted/30 dark:bg-slate-900/50">
      <div className="container w-11/12 mx-auto relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-fluid relative space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto px-4">
            <SectionHeader
              title="The Wall of Love"
              description="Real crunch stories from our snack-loving community."
              badge="Social Proof"
            />
          </div>

          {/* Skeletons Marquee Area */}
          <div className="relative flex overflow-hidden">
            <div className="flex gap-6 w-max">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-[350px] md:w-[450px] shrink-0">
                  <div className="h-[280px] border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-2xl rounded-[2rem] overflow-hidden p-8 flex flex-col">
                    {/* Rating Skeleton */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse" />
                      ))}
                    </div>
                    {/* Comment Skeleton */}
                    <div className="space-y-3 mb-5">
                      <div className="h-5 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-full animate-pulse" />
                      <div className="h-5 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-[85%] animate-pulse" />
                      <div className="h-5 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-[60%] animate-pulse" />
                    </div>
                    {/* Author Skeleton */}
                    <div className="flex items-center gap-4 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="h-12 w-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded w-24 animate-pulse" />
                        <div className="h-2.5 bg-slate-200/50 dark:bg-slate-800/50 rounded w-16 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fade Gradients for Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50/80 dark:from-slate-950/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50/80 dark:from-slate-950/40 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Social Proof Footer */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Join <span className="text-orange-600 font-bold">5,000+</span> happy snackers across the city 🍿
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureReviewsClient = ({ reviews, isLoading }: { reviews: IReview[], isLoading?: boolean }) => {
  if (isLoading) return <FeatureReviewsSkeleton />;
  if (!reviews || reviews.length === 0) return null;

  // Marquee Logic
  const duplicateCount = 3; // Triple to ensure seamless loop on large screens
  const marqueeReviews = [...Array(duplicateCount)].flatMap(() => reviews);

  return (
    <section className="py-10 bg-muted/30 dark:bg-slate-900/50">
      <div className="container w-11/12 mx-auto relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-fluid relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={containerVariants}
            className="space-y-10"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto px-4">
              <SectionHeader
                title="The Wall of Love"
                description="Real crunch stories from our snack-loving community."
                badge="Social Proof"
              />
            </div>

            {/* Infinite Marquee Marquee */}
            <div className="relative flex overflow-hidden">
              <motion.div
                animate={{ x: ["0%", "-33.33%"] }} // Match the duplicateCount (1/3rd for 3x)
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-4 w-max"
                whileHover={{ animationPlayState: "paused" }}
              >
                {marqueeReviews.map((review, idx) => (
                  <ReviewCard key={`${review.id}-${idx}`} review={review} />
                ))}
              </motion.div>

              {/* Fade Gradients for Marquee Edges */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50/80 dark:from-slate-950/40 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50/80 dark:from-slate-950/40 to-transparent z-10 pointer-events-none" />
            </div>

            {/* Social Proof Footer */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 text-center">
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Join <span className="text-orange-600 font-bold">5,000+</span> happy snackers across the city 🍿
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureReviewsClient;
