"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";

const tips = [
  {
    title: "5 Creative Ways to Enjoy Beef Jerky",
    excerpt:
      "From trail mix combos to gourmet salads — discover unexpected ways to level up your jerky game beyond the bag.",
    category: "Snack Hacks",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    href: "/blog",
  },
  {
    title: "The Health Benefits of Dried Snacks",
    excerpt:
      "Packed with protein and low in carbs — learn why dried snacks are a smart choice for health-conscious munchers.",
    category: "Nutrition",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop",
    href: "/blog",
  },
  {
    title: "Perfect Snack Pairings for Movie Night",
    excerpt:
      "Sweet meets spicy! Our curated guide to building the ultimate snack platter for your next binge-watching session.",
    category: "Lifestyle",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&h=400&fit=crop",
    href: "/blog",
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

const SnackTips = () => {
  return (
    <section className="py-10 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <SectionHeader
            title="Snack Tips & Stories"
            description="Get inspired with snacking ideas, nutrition insights, and community stories."
            badge="From Our Blog"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {tips.map((tip) => (
            <motion.div
              key={tip.title}
              variants={itemVariants}
              className="group"
            >
              <Link href={tip.href} className="block h-full">
                <div className="relative h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                      {tip.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tip.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Article
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                      {tip.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 group-hover:gap-3 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SnackTips;
