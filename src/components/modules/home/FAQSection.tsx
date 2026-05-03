"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/shared/SectionHeader";

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
      "We categorize spice levels from Mild to Extra Hot. Each spicy product displays its heat rating on the product card. If you love heat, look for our signature 🌶️ Spicy badge! You can also filter products by 'Spicy Only' on the products page.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes! We offer special pricing for bulk and corporate orders. Whether it's for office snacks, events, or gifts, contact us at abusayedkhan.pro@gmail.com or use our WhatsApp chat for a custom quote.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is placed, you can track it from the 'My Orders' section in your account dashboard. You'll see real-time status updates from 'Processing' to 'Delivered'. You'll also receive email notifications at each step.",
  },
  {
    question: "Is there a minimum order amount?",
    answer:
      "There's no minimum order amount — you can order even a single snack! However, orders above ৳500 qualify for free delivery within Dhaka city.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const FAQSection = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
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
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={itemVariants}>
                <AccordionItem
                  value={`item-${i}`}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-xl px-6 overflow-hidden bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300 data-[state=open]:shadow-lg data-[state=open]:border-orange-200 dark:data-[state=open]:border-orange-900/50"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-5 [&[data-state=open]]:text-orange-600 dark:[&[data-state=open]]:text-orange-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pb-5">
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
