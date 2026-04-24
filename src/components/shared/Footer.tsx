"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  ExternalLink,
} from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";

const footerLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Shipping Policy", href: "/shipping-policy" },
  { title: "Terms & Conditions", href: "/terms-conditions" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/abu.ssayed.khan.2024",
    icon: FaFacebookF,
    color: "hover:bg-blue-500 hover:border-blue-500",
  },
  {
    name: "GitHub",
    href: "https://github.com/sayed725",
    icon: FaGithub,
    color: "hover:bg-slate-800 dark:hover:bg-white hover:border-slate-800 dark:hover:border-white",
    textColor: "dark:group-hover:text-slate-900",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/abu-sayed-khan-922801317",
    icon: FaLinkedinIn,
    color: "hover:bg-blue-600 hover:border-blue-600",
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      {/* Ambient gradient decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main footer content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={containerVariants}
        className="relative z-10 mx-auto w-11/12 pt-10 pb-2"
      >
        <div className="flex flex-col md:flex-row justify-between gap-12 lg:gap-8">
          {/* Logo + Brand + Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <img
                  src="/assets/urban_snaks_logo.png"
                  alt="Urban Snacks Logo"
                  className="w-11 h-11 rounded-lg relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Urban Snacks
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Your go-to destination for premium quality treats. We provide the best snacks to keep your cravings satisfied, delivered right to your doorstep.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3">
                Stay Updated
              </h4>
              <form className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    required
                    className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:border-orange-400 focus:ring-orange-400/20 transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-500/25 transition-all duration-300 font-bold px-5 hover:scale-105 border-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300 dark:bg-orange-700 group-hover:bg-orange-500 transition-colors" />
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-300 dark:bg-orange-700 group-hover:bg-orange-500 transition-colors" />
                  All Products
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    55 Main Street, 2nd block,<br />New York City
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                  <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <a
                  href="mailto:abusayedkhan.pro@gmail.com"
                  className="text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  abusayedkhan.pro@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                  <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <a
                  href="tel:+8801627142598"
                  className="text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  +880 1627142598
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-6 pt-2 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
            <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap justify-center">
              © {new Date().getFullYear()}
              <span className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Urban Snacks
              </span>
              . All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`group w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all duration-300 hover:text-white hover:shadow-lg hover:scale-110 ${social.color}`}
                  >
                    <Icon className={`w-4 h-4 text-muted-foreground group-hover:text-white transition-colors ${social.textColor || ""}`} />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}