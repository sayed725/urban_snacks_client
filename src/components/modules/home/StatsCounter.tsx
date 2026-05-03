"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Package, Grid3X3, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "Happy Customers",
    description: "Snack lovers served",
  },
  {
    icon: Package,
    value: 50,
    suffix: "+",
    label: "Unique Snacks",
    description: "Handcrafted varieties",
  },
  {
    icon: Grid3X3,
    value: 10,
    suffix: "+",
    label: "Categories",
    description: "Diverse flavors",
  },
  {
    icon: TrendingUp,
    value: 99,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "5-star reviews",
  },
];

function AnimatedCounter({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const StatsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600" />
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
      </div>

      <div
        ref={ref}
        className="container w-11/12 mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-bold tracking-wider uppercase text-white/90 mb-4">
            By The Numbers
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Thousands
          </h2>
          <p className="text-white/80 text-lg mt-3 max-w-md mx-auto">
            The numbers speak for themselves — here&apos;s our journey so far.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                  </div>
                  <div className="text-3xl lg:text-4xl font-black text-white mb-1 tabular-nums">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      inView={isInView}
                    />
                  </div>
                  <p className="text-white font-bold text-sm">{stat.label}</p>
                  <p className="text-white/60 text-xs mt-1">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
