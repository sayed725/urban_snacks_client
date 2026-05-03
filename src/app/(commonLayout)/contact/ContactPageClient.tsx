"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Truck } from "lucide-react";
import ContactSection from "@/components/modules/home/ContactSection";
import FAQSection from "@/components/modules/home/FAQSection";

const operations = [
  {
    icon: <Clock className="w-6 h-6 text-orange-500" />,
    title: "Operating Hours",
    details: ["Sunday - Thursday", "9:00 AM - 8:00 PM", "Closed on Fridays"],
  },
  {
    icon: <Truck className="w-6 h-6 text-amber-500" />,
    title: "Delivery Schedule",
    details: [
      "Same-day delivery: Order by 2 PM",
      "Next-day delivery: Order after 2 PM",
      "Outside Dhaka: 2-3 Business Days",
    ],
  },
  {
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    title: "Pickup & Corporate",
    details: [
      "Bulk orders require 48h notice",
      "Corporate catering available",
      "Store pickup available during hours",
    ],
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ContactPageClient() {
  return (
    <div className="bg-background overflow-hidden">
      {/* 1. Hero Section */}
      {/* <section className="relative pt-10 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto w-11/12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Whether you're craving a single snack, planning a corporate event, or just want to say hi — we're here for you.
            </p>
          </motion.div>
        </div>
      </section> */}

      {/* 2. Contact Form Section */}
      {/* ContactSection already has its own padding and background, we just render it */}
      <div className="">
        <ContactSection />
      </div>

      {/* 3. Operations & Delivery Info */}
      <section className="py-10 relative">
        <div className="container w-11/12 mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {operations.map((op, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-sm">
                  {op.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {op.title}
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {op.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Map Embed */}
      <section className="py-10">
        <div className="container w-11/12 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl h-[400px] md:h-[500px]"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-20" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.204555021575!2d90.0984857!3d23.7455431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755ecab183b5d21%3A0xc3b8fb32e7c9f6d7!2sNawabganj%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative z-10 w-full h-full grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* 5. FAQ Section Snippet */}
      {/* FAQSection also has its own padding and background */}
      <FAQSection />
    </div>
  );
}
