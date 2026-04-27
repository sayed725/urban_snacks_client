"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome, MdStorefront, MdShoppingCart } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";

const navItems = [
  { title: "Home", href: "/", icon: MdHome },
  { title: "Shop", href: "/products", icon: MdStorefront },
  { title: "Cart", href: "/cart", icon: MdShoppingCart },
];

export default function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Show when scrolled down a bit
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = "+8801627142598";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}`;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-3xl px-2 flex justify-around items-center transition-transform duration-500 lg:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
              isActive 
                ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[11px] font-bold">{item.title}</span>
            
            {/* Cart Badge */}
            {item.href === "/cart" && mounted && totalItems() > 0 && (
              <span className="absolute top-1.5 right-2 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                {totalItems()}
              </span>
            )}
          </Link>
        );
      })}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 text-slate-500 hover:text-[#25D366]"
      >
        <FaWhatsapp className="w-6 h-6 mb-1 text-[#25D366]" />
        <span className="text-[11px] font-bold text-[#25D366]">Whatsapp</span>
      </a>
    </div>
  );
}
