"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/shared/SectionHeader";

const TAGS = [
  "All",
  "Beef Jerky",
  "Dried Fruits",
  "Recipes",
  "Snack Tips",
  "Inside Urban"
];

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  tags: string[];
}

const BlogHero = ({ searchQuery, setSearchQuery, selectedTag, setSelectedTag, tags }: BlogHeroProps) => {
  return (
    <section className="relative py-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <SectionHeader
              badge="Crunchy Chronicles"
              title="Stories, Tips & Snacking Secrets"
              description="Dive into the world of Urban Snacks. From perfect pairings to behind-the-scenes magic, satisfy your craving for knowledge."
            />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-xl mx-auto lg:mb-12"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search articles...name, title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-orange-500/20 shadow-xl text-base md:text-lg text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center hidden lg:flex justify-center gap-2 md:gap-3"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedTag === tag
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-500 dark:hover:text-orange-400 backdrop-blur-sm"
                  }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
