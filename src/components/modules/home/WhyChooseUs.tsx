"use client";

import { motion } from "framer-motion";
import {
  ChefHat,
  Leaf,
  Truck,
  ShieldCheck,
  Heart,
  Recycle,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const highlights = [
  {
    icon: ChefHat,
    title: "Handcrafted Recipes",
    description:
      "Every snack is prepared with authentic recipes perfected over generations for unmatched flavor.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Leaf,
    title: "100% Natural Ingredients",
    description:
      "We use only premium, naturally sourced ingredients — no artificial preservatives or colors.",
    gradient: "from-orange-400 to-red-500",
  },
  {
    icon: Truck,
    title: "Same Day Delivery",
    description:
      "Order before 2 PM and enjoy fresh snacks delivered to your doorstep the very same day.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "Each batch is rigorously tested for taste and safety — your satisfaction is our promise.",
    gradient: "from-red-500 to-orange-600",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Our artisans pour passion into every bite, ensuring a snacking experience you'll never forget.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    description:
      "We care about the planet — all our packaging is biodegradable and sustainably sourced.",
    gradient: "from-orange-500 to-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const WhyChooseUs = () => {
  return (
    <section className="py-10 bg-muted/30 relative overflow-hidden">
      {/* Ambient decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <SectionHeader
            title="Why Choose Us"
            description="What makes Urban Snacks the ultimate destination for your cravings."
            badge="Our Promise"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group relative "
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-md opacity-0 group-hover:opacity-20 dark:group-hover:opacity-40 blur-xl transition-opacity duration-500`}
                />

                <div className="relative h-full p-6 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                  <div
                    className={`w-14 h-14 rounded-md bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
