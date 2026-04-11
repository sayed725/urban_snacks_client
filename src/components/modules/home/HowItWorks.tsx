"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  CheckCircle2,
  PackageCheck,
  Search,
  CreditCard,
  Truck,
} from "lucide-react";

import SectionHeader from "@/components/shared/SectionHeader";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const services = [
    {
      icon: <Search size={40} />,
      title: "Select Items",
      description:
        "Browse our wide category of snacks and pick your favorites.",
      detailedDescription:
        "Explore our diverse menu of delicious urban snacks. From crispy bites to sweet treats, find exactly what you're craving. Filter by category, price, or dietary preferences to discover your perfect snack companion.",
    },
    {
      icon: <ShoppingCart size={40} />,
      title: "Add to Cart",
      description:
        "Add your chosen snacks to the cart and review your selections.",
      detailedDescription:
        "Once you've found your favorites, simply add them to your cart. You can adjust quantities, review your selections, and see your total transparently before moving to the checkout step.",
    },
    {
      icon: <CreditCard size={40} />,
      title: "Payment or COD",
      description:
        "Choose between secure online payment or Cash on Delivery (COD).",
      detailedDescription:
        "We offer flexible payment options for your convenience. Pay securely online using your preferred card, or choose Cash on Delivery (COD) to pay when your snacks arrive at your doorstep.",
    },
    {
      icon: <CheckCircle2 size={40} />,
      title: "Order Placed",
      description:
        "Your order is successfully placed! Track its real-time status.",
      detailedDescription:
        "Congratulations, your order is locked in! You can now track its journey from our kitchen to your doorstep. Keep an eye on the order status updates in your dashboard.",
    },
    {
      icon: <PackageCheck size={40} />,
      title: "Admin Approves",
      description:
        "Our team approves your order and starts preparing your snacks.",
      detailedDescription:
        "Our admin team swiftly verifies your order details and starts the preparation process. We ensure your snacks are prepared fresh and packaged carefully to maintain their amazing quality.",
    },
    {
      icon: <Truck size={40} />,
      title: "Delivered Home",
      description:
        "Enjoy your fresh and delicious snacks delivered right to your door.",
      detailedDescription:
        "Your craving is about to be satisfied! Our delivery partner will bring your order straight to your specified address. Enjoy your urban snacks hot, fresh, and perfectly on time.",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % services.length);
      }, 6000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleStepClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveStep(index);
  };

  return (
    <section className="bg-muted/30 py-10 ">
      <div className="container w-11/12 mx-auto">
        {/* Header */}
        <div className="pb-8 text-center flex flex-col items-center">
          <SectionHeader
            title="How It Works"
            description="Your snack journey simplified in these easy steps"
            badge="Simplified Process"
          />
        </div>
        {/* Progress Indicators */}
        <div className="flex justify-center  mb-8">
          <div className="flex items-center space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "transition-all duration-300 ease-in-out cursor-pointer",
                  index === activeStep
                    ? "w-10 h-3 bg-orange-500 rounded-full"
                    : "w-3 h-3 bg-orange-200 rounded-full hover:bg-orange-300"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Step Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl shadow-orange-500/5 p-8 border-2 border-orange-100  flex flex-col justify-center"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500">
                  {services[activeStep].icon}
                </div>
                <div>
                  <span className="text-sm md:text-base text-orange-500 font-bold uppercase tracking-wider">
                    Step {activeStep + 1}/6
                  </span>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 text-slate-800">
                    {services[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-muted-foreground md:text-sm lg:text-lg mb-8 leading-relaxed">
                {services[activeStep].detailedDescription}
              </p>

              <div className="space-y-4">
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <div className="bg-orange-100 rounded-full p-1 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      </div>
                      <span className="text-slate-700 md:text-sm lg:text-base font-medium">
                        {activeStep === 0 &&
                          item === 1 &&
                          "Find sweet, savory, or crunchy snacks"}
                        {activeStep === 0 &&
                          item === 2 &&
                          "Filter items by your specific cravings"}
                        {activeStep === 0 &&
                          item === 3 &&
                          "Discover new featured items every week"}

                        {activeStep === 1 &&
                          item === 1 &&
                          "Easily adjust quantities of items"}
                        {activeStep === 1 &&
                          item === 2 &&
                          "Review all selections before proceeding"}
                        {activeStep === 1 &&
                          item === 3 &&
                          "See clear, transparent pricing and totals"}

                        {activeStep === 2 &&
                          item === 1 &&
                          "Pay securely using Stripe integration"}
                        {activeStep === 2 &&
                          item === 2 &&
                          "Choose Cash on Delivery for convenience"}
                        {activeStep === 2 &&
                          item === 3 &&
                          "Fast, secure, and hassle-free checkout"}

                        {activeStep === 3 &&
                          item === 1 &&
                          "Get immediate order confirmation"}
                        {activeStep === 3 &&
                          item === 2 &&
                          "View order details and status right away"}
                        {activeStep === 3 &&
                          item === 3 &&
                          "Track history via 'My Orders' dashboard"}

                        {activeStep === 4 &&
                          item === 1 &&
                          "Admins verify and confirm instantly"}
                        {activeStep === 4 &&
                          item === 2 &&
                          "Fresh preparation begins immediately"}
                        {activeStep === 4 &&
                          item === 3 &&
                          "Careful packaging ensures maximum quality"}

                        {activeStep === 5 &&
                          item === 1 &&
                          "Fast delivery to your specific location"}
                        {activeStep === 5 &&
                          item === 2 &&
                          "Enjoy your snacks fresh and delicious"}
                        {activeStep === 5 &&
                          item === 3 &&
                          "Seamless handover at your doorstep"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Visual Representation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/95 to-orange-600/90 z-10 flex items-center justify-center p-6">
                <div className="text-white p-4 md:p-8 text-center flex flex-col items-center">
                  <div className="flex justify-center mb-8 text-white p-6 bg-white/20 rounded-full backdrop-blur-md shadow-lg border border-white/20">
                    {services[activeStep].icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 tracking-tight drop-shadow-sm">
                    {services[activeStep].title}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl font-medium text-orange-50 max-w-md drop-shadow-sm">
                    {services[activeStep].description}
                  </p>
                </div>
              </div>
              <img 
                 src="https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=2070&auto=format&fit=crop" 
                 alt="Snacks" 
                 className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Overview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={cn(
                "p-3 lg:p-5 rounded-2xl transition-all duration-300 text-center flex flex-col items-center gap-3 cursor-pointer group",
                activeStep === index
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 scale-105 border-transparent"
                  : "bg-white hover:bg-orange-50 border border-orange-100 hover:border-orange-300"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors shadow-sm",
                  activeStep === index
                    ? "bg-white/20 text-white"
                    : "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
                )}
              >
                <span className="font-bold text-lg">{index + 1}</span>
              </div>
              <span className={cn(
                "text-sm font-semibold",
                activeStep === index ? "text-white" : "text-slate-700 group-hover:text-orange-700"
              )}>
                {service.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
