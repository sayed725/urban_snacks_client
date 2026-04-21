"use client";

import React from "react";
import { Star, CheckCircle2, User } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IReview } from "@/types/review.type";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductReviewsProps {
  reviews: IReview[];
  isLoading: boolean;
}

export default function ProductReviews({ reviews, isLoading }: ProductReviewsProps) {
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-10 bg-muted rounded w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-48 bg-muted rounded-3xl col-span-1" />
          <div className="h-48 bg-muted rounded-3xl col-span-2" />
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.rating) === stars).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(r => Math.round(r.rating) === stars).length / totalReviews) * 100 
      : 0
  }));

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Customer Experience</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">What our community says about this snack</p>
        </div>
        <Button asChild className="rounded-full bg-white border-2 border-slate-200 dark:border-white/10 dark:bg-black text-slate-900 dark:text-white hover:bg-slate-50 transition-all font-bold px-6 shadow-sm">
           <Link href="/my-orders">Write a Review</Link>
        </Button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 dark:border-white/5">
        {/* Big Rating */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-black/20 rounded-3xl shadow-sm border border-slate-100 dark:border-white/10">
          <div className="text-7xl font-black text-slate-900 dark:text-white mb-2">{averageRating}</div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                className={cn(
                  "transition-all",
                  star <= Math.round(Number(averageRating)) 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-slate-200 dark:text-slate-800"
                )} 
              />
            ))}
          </div>
          <p className="text-sm font-bold text-muted-foreground">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Breakdown */}
        <div className="lg:col-span-8 space-y-3 px-0 lg:px-6">
          {ratingCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-8">
                <span className="text-sm font-bold">{stars}</span>
                <Star size={12} className="fill-slate-400 text-slate-400" />
              </div>
              <div className="flex-1 h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <div className="w-12 text-right">
                <span className="text-xs font-bold text-muted-foreground">{Math.round(percentage)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 shrink-0">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={review.customer?.image || ""} />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {review.customer?.name?.[0] || <User size={24} />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="md:hidden">
                     <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 dark:text-white capitalize">{review.customer?.name || "Anonymous"}</h4>
                        <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20">
                            <CheckCircle2 size={10} /> Verified Purchase
                        </div>
                     </div>
                     <p className="text-xs text-muted-foreground font-medium">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                     </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="hidden md:flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize">{review.customer?.name || "Anonymous"}</h4>
                            <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20">
                                <CheckCircle2 size={10} /> Verified Purchase
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                    
                    {/* PC Stars */}
                    <div className="flex gap-0.5 p-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            size={14} 
                            className={cn(
                            star <= review.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-slate-200 dark:text-slate-800"
                            )} 
                        />
                        ))}
                        <span className="ml-1 text-xs font-bold text-slate-600 dark:text-slate-400">{review.rating}</span>
                    </div>
                  </div>

                  {/* Mobile Stars */}
                  <div className="md:hidden flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            size={12} 
                            className={cn(
                            star <= review.rating 
                                ? "fill-amber-400 text-amber-400" 
                                : "text-slate-200 dark:text-slate-800"
                            )} 
                        />
                        ))}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
            <div className="w-20 h-20 bg-white dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/10 shadow-sm">
                <Star className="w-10 h-10 text-slate-200 dark:text-slate-800" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No reviews yet</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Be the first to share your experience with this delicious snack!</p>
          </div>
        )}
      </div>
    </div>
  );
}
