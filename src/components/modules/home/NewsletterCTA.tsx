"use client";

import { motion } from "framer-motion";
import { Facebook, ThumbsUp } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";

const NewsletterCTA = () => {
  return (
    <section 
      className="py-10 relative bg-fixed bg-center bg-cover bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/assets/urban_paralax.jpg')" }}
    >
      {/* Semi-transparent overlay to ensure readability while letting the image shine through */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Accent glowing blobs for extra flavor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1877F2]/20 rounded-full blur-[150px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
        >
          <SectionHeader
            badge="STAY CONNECTED"
            title="Join the Community"
            // description="Follow our official page for the latest crunch-tastic updates, or join our VIP group to connect with other snack lovers!"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          
          {/* Facebook Page Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 relative overflow-hidden group"
          >
            {/* Inner ambient glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-colors duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center mb-6 shadow-sm backdrop-blur-md border border-white/50 dark:border-transparent">
                <ThumbsUp className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">
                Follow our Official <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Facebook Page</span>
              </h3>
              <p className="text-slate-800 dark:text-slate-300 mb-6 font-medium leading-relaxed text-sm md:text-base">
                Stay in the loop with our latest product launches, flash sales, and mouth-watering behind-the-scenes content.
              </p>

              <div className="mt-auto pt-4">
                <Link 
                  href="https://www.facebook.com/Urbansnacks.store" 
                  target="_blank" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-bold text-sm md:text-base group/btn"
                >
                  <Facebook className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  Follow Page
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Facebook VIP Group Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 relative overflow-hidden group"
          >
            {/* Inner ambient glow */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1877F2]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#1877F2]/30 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center mb-6 shadow-sm backdrop-blur-md border border-white/50 dark:border-transparent">
                <Facebook className="w-6 h-6" />
              </div>
              
               <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">
                 Urban Snacks VIP <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Facebook Group</span>
              </h3>
              
              <p className="text-slate-800 dark:text-slate-300 mb-6 font-medium leading-relaxed text-sm md:text-base">
                Be part of our vibrant community! Secret menus, daily polls, crispy memes, and connect with other snack lovers.
              </p>

              <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-white shadow-sm">AJ</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-white shadow-sm">SK</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-white shadow-sm">MR</div>
                    <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-slate-300 shadow-sm backdrop-blur-sm">+</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-900 dark:text-white leading-tight">12.5k+</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Members</span>
                  </div>
                </div>

                <Link 
                  href="https://www.facebook.com/Urbansnacks.store" 
                  target="_blank" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-bold text-sm md:text-base group/btn"
                >
                  <Facebook className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  Join Group
                </Link>
                
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
