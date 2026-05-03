"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/shared/SectionHeader";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "We offer same-day delivery for orders placed before 2 PM within Dhaka city. For orders outside Dhaka, delivery typically takes 2-3 business days. You can track your order status in real-time from your dashboard.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Stripe (all major credit/debit cards), SSLCommerz for local payments, and Cash on Delivery (COD). All online transactions are secured with industry-standard encryption.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "If you receive a damaged or incorrect item, please contact us within 24 hours of delivery with a photo. We'll arrange a replacement or full refund immediately. Due to the nature of food products, we cannot accept returns for taste preferences.",
  },
  {
    question: "Are your snacks suitable for people with allergies?",
    answer:
      "Each product page lists all ingredients and allergen information. Many of our snacks are nut-free, gluten-free, or dairy-free — check the product details before ordering. If you have specific concerns, please reach out to our support team.",
  },
  {
    question: "How spicy are your spicy snacks?",
    answer:
      "We categorize spice levels from Mild to Extra Hot. Each spicy product displays its heat rating on the product card. If you love heat, look for our signature 🌶️ Spicy badge!",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes! We offer special pricing for bulk and corporate orders. Whether it's for office snacks, events, or gifts, contact us at abusayedkhan.pro@gmail.com or use our WhatsApp chat for a custom quote.",
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

const FAQSection = () => {
  return (
    <section className="py-10 bg-muted/30 relative overflow-hidden">
      {/* Ambient glowing background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          {/* <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8" />
          </div> */}
          <SectionHeader
            title="Frequently Asked Questions"
            description="Everything you need to know about Urban Snacks — answered."
            badge="Got Questions?"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="max-w-5xl mx-auto pb-10"
        >
          <Accordion 
            type="single" 
            collapsible 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <AccordionItem
                  value={`item-${i}`}
                  className="h-full border border-slate-200/80 dark:border-slate-800 rounded-2xl px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 data-[state=open]:shadow-lg data-[state=open]:border-orange-300 dark:data-[state=open]:border-orange-500/50 relative overflow-hidden group"
                >
                  {/* Subtle active glow indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-600 opacity-0 group-data-[state=open]:opacity-100 transition-opacity duration-300" />
                  
                  <AccordionTrigger className="text-left text-base lg:text-lg font-bold text-slate-900 dark:text-white hover:no-underline hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-6 [&[data-state=open]]:text-orange-600 dark:[&[data-state=open]]:text-orange-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
