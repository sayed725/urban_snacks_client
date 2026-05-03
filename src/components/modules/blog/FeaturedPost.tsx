"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CalendarDays } from "lucide-react";
interface FeaturedPostProps {
  post: any; // Using any for simplicity in demo, or import BlogPost type
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  if (!post) return null;
  return (
    <section className=" py-10 relative z-10">
      <div className="container w-11/12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Inner ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row relative z-10">
            {/* Image Container */}
            <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 left-6 z-20">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest shadow-lg">
                  🔥 {post.category}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {post.publishedAt}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-600 transition-all duration-300">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                {post.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-auto">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.author.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{post.author.role}</p>
                  </div>
                </div>

                {/* Read Button */}
                <Link
                  href="https://www.facebook.com/Urbansnacks.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold text-sm group/btn"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPost;
