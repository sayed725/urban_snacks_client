"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  CheckCircle2,
  PackageCheck,
  Search,
  CreditCard,
  Truck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import SectionHeader from "@/components/shared/SectionHeader";

const steps = [
  {
    icon: Search,
    title: "Select Items",
    description:
      "Browse our wide category of snacks and pick your favorites.",
    detailedDescription:
      "Explore our diverse menu of delicious urban snacks. From crispy bites to sweet treats, find exactly what you're craving. Filter by category, price, or dietary preferences to discover your perfect snack companion.",
    highlights: [
      "Find sweet, savory, or crunchy snacks",
      "Filter items by your specific cravings",
      "Discover new featured items every week",
    ],
    gradient: "from-amber-400 to-orange-500",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500",
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    description:
      "Add your chosen snacks to the cart and review your selections.",
    detailedDescription:
      "Once you've found your favorites, simply add them to your cart. You can adjust quantities, review your selections, and see your total transparently before moving to the checkout step.",
    highlights: [
      "Easily adjust quantities of items",
      "Review all selections before proceeding",
      "See clear, transparent pricing and totals",
    ],
    gradient: "from-orange-400 to-red-500",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description:
      "Choose between secure online payment or Cash on Delivery (COD).",
    detailedDescription:
      "We offer flexible payment options for your convenience. Pay securely online using your preferred card, or choose Cash on Delivery (COD) to pay when your snacks arrive at your doorstep.",
    highlights: [
      "Pay securely using Stripe integration",
      "Choose Cash on Delivery for convenience",
      "Fast, secure, and hassle-free checkout",
    ],
   gradient: "from-amber-400 to-orange-500",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500"
  },
  {
    icon: CheckCircle2,
    title: "Order Placed",
    description:
      "Your order is successfully placed! Track its real-time status.",
    detailedDescription:
      "Congratulations, your order is locked in! You can now track its journey from our kitchen to your doorstep. Keep an eye on the order status updates in your dashboard.",
    highlights: [
      "Get immediate order confirmation",
      "View order details and status right away",
      "Track history via 'My Orders' dashboard",
    ],
 gradient: "from-orange-400 to-red-500",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500",
  },
  {
    icon: PackageCheck,
    title: "Admin Approves",
    description:
      "Our team approves your order and starts preparing your snacks.",
    detailedDescription:
      "Our admin team swiftly verifies your order details and starts the preparation process. We ensure your snacks are prepared fresh and packaged carefully to maintain their amazing quality.",
    highlights: [
      "Admins verify and confirm instantly",
      "Fresh preparation begins immediately",
      "Careful packaging ensures maximum quality",
    ],
    gradient: "from-amber-400 to-orange-500",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500"
  },
  {
    icon: Truck,
    title: "Delivered Home",
    description:
      "Enjoy your fresh and delicious snacks delivered right to your door.",
    detailedDescription:
      "Your craving is about to be satisfied! Our delivery partner will bring your order straight to your specified address. Enjoy your urban snacks hot, fresh, and perfectly on time.",
    highlights: [
      "Fast delivery to your specific location",
      "Enjoy your snacks fresh and delicious",
      "Seamless handover at your doorstep",
    ],
   gradient: "from-orange-400 to-red-500",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 6000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveStep(index);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <section className="relative py-10 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        {/* Header */}
        <div className="pb-8 text-center  max-w-2xl mx-auto px-4">
          <SectionHeader
            title="How It Works"
            description="Your snack journey simplified in these easy steps"
            badge="Simplified Process"
          />
        </div>

        {/* Timeline navigation — Responsive */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-0 w-full max-w-5xl">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === activeStep;
              const isPassed = index < activeStep;

              return (
                <div key={index} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 group cursor-pointer transition-all duration-500",
                    )}
                  >
                    {/* Node circle */}
                    <motion.div
                      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={cn(
                        "w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 relative",
                        isActive
                          ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg ${step.glowColor} ring-2 sm:ring-4 ring-white dark:ring-slate-900`
                          : isPassed
                          ? "bg-amber-500 text-white ring-1 sm:ring-2 ring-amber-200 dark:ring-amber-800"
                          : "bg-muted text-muted-foreground ring-1 sm:ring-2 ring-border group-hover:ring-orange-300 dark:group-hover:ring-orange-700"
                      )}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <StepIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap hidden md:block",
                        isActive
                          ? "text-orange-600 dark:text-orange-400"
                          : isPassed
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                  </button>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-[2px] sm:h-[3px] mx-1 sm:mx-2 rounded-full bg-border overflow-hidden relative  md:mt-[-28px]">
                      <motion.div
                        initial={false}
                        animate={{ width: isPassed || isActive ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                          isPassed ? "from-amber-400 to-amber-500" : `${step.gradient}`
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side – Interactive Step Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative bg-card rounded-3xl border shadow-xl overflow-hidden h-full">
                {/* Accent bar at top */}
                <div className={cn("h-1.5 bg-gradient-to-r", current.gradient)} />

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col h-full">
                  {/* Step badge & icon */}
                  <div className="flex items-center gap-5 mb-8">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                        current.gradient,
                        current.glowColor
                      )}
                    >
                      <Icon className="w-8 h-8" strokeWidth={1.8} />
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-block text-xs font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-1",
                          "bg-gradient-to-r bg-clip-text text-transparent",
                          current.gradient
                        )}
                      >
                        Step {activeStep + 1} of {steps.length}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                        {current.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                    {current.detailedDescription}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-4 flex-1">
                    {current.highlights.map((text, i) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={cn(
                            "mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                            "bg-gradient-to-br",
                            current.gradient
                          )}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-medium text-foreground/80">
                          {text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Auto-play progress bar */}
                  {isAutoPlaying && (
                    <div className="mt-8 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        key={activeStep}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", current.gradient)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side – Visual Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div
                className={cn(
                  "relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[400px] flex flex-col items-center justify-center",
                  current.glowColor
                )}
              >
                {/* Gradient background */}
                <div className={cn("absolute inset-0 bg-gradient-to-br", current.gradient)} />

                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
                  {/* Floating dots */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-12 left-12 w-4 h-4 bg-white/20 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-20 right-16 w-3 h-3 bg-white/25 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white text-center p-8 sm:p-12 flex flex-col items-center">
                  {/* Large icon */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                      <Icon className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Step number */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-4"
                  >
                    <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-bold tracking-widest uppercase border border-white/10">
                      Step {activeStep + 1}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight drop-shadow-lg"
                  >
                    {current.title}
                  </motion.h3>

                  {/* Short desc */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-base sm:text-lg font-medium text-white/80 max-w-sm leading-relaxed"
                  >
                    {current.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Step Cards */}
     
      </div>
    </section>
  );
};

export default HowItWorks;
