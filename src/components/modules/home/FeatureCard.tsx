"use client";

import { CheckCheck, CreditCard, ShieldCheck, ShoppingBag, Signal, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FeatureCard = () => {
  return (
    <section className="bg-secondary text-secondary-foreground py-5 border-y overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border"
        >
          <motion.div variants={itemVariants} className="px-4">
            <div className="flex justify-center mb-2 text-primary">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-semibold tracking-tight">Premium Snacks</h3>
            <p className="text-sm text-muted-foreground mt-1">Curated quality</p>
          </motion.div>
          <motion.div variants={itemVariants} className="px-4">
            <div className="flex justify-center mb-2 text-primary">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="font-semibold tracking-tight">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground mt-1">Right to your door</p>
          </motion.div>
          <motion.div variants={itemVariants} className="px-4">
            <div className="flex justify-center mb-2 text-primary">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="font-semibold tracking-tight">Top Rated</h3>
            <p className="text-sm text-muted-foreground mt-1">Loved by thousands</p>
          </motion.div>
          <motion.div variants={itemVariants} className="px-4 border-l-0">
            <div className="flex justify-center mb-2 text-primary">
             <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold tracking-tight">Secure Pay</h3>
            <p className="text-sm text-muted-foreground mt-1">100% protected</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCard;