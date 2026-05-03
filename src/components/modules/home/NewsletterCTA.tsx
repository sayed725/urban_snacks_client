"use client";

import { motion } from "framer-motion";
import { Mail, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterCTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px]" />

        {/* Floating emojis */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-[15%] text-4xl opacity-20"
        >
          🍿
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-[20%] text-4xl opacity-20"
        >
          🌶️
        </motion.div>
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 right-[10%] text-3xl opacity-15"
        >
          🥜
        </motion.div>
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-400 text-sm font-bold tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Join the Community
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Never Miss a{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Crunch!
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
            Subscribe to get exclusive deals, new arrivals, and snack tips delivered straight to your inbox.
          </p>

          {/* Email Form */}
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-orange-500 focus:ring-orange-500/20 transition-all text-base"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 border-0"
            >
              Subscribe
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm mt-6"
          >
            Join{" "}
            <span className="text-orange-400 font-bold">2,500+</span>{" "}
            subscribers • No spam, unsubscribe anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
