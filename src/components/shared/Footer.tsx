import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaAngleRight, 
  FaChevronUp 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pt-12 pb-3 bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-t border-white/20 dark:border-white/10 relative overflow-hidden text-slate-800 dark:text-slate-200">
      {/* Auth-style Background Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5 pointer-events-none" />
      
      {/* Main footer content */}
      <div className="mx-auto w-11/12 px-0 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-10 lg:gap-16">
          {/* Logo + Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src="/assets/urban_snaks_logo.png"
                alt="Urban Snacks Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded"
              />
            <span className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Urban Snacks
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Urban Snacks is your go-to destination for premium quality treats. We provide the best snacks to keep your cravings satisfied.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Quick Links</h3>
            <ul className="space-y-3 text-muted-foreground flex flex-wrap gap-5">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping-policy" 
                  className="hover:text-primary transition-colors"
                >
                 Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-conditions" 
                  className="hover:text-primary transition-colors"
                >
                 Terms & Conditions
                </Link>
              </li>
            </ul>

            {/* Newsletter signup */}
            <div className="mt-10">
              <h4 className="text-lg font-medium mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Stay Updated</h4>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="bg-transparent border-gray-500 focus:border-primary focus:ring-primary/30"
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold px-6 hover:scale-105 border-0 whitespace-nowrap"
                >
                  Subscribe <FaAngleRight className="ml-2" />
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Contact</h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-primary shrink-0" />
                55 Main Street, 2nd block,<br className="sm:hidden" /> New York City
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-3 text-primary shrink-0" />
                abusayedkhan.pro@gmail.com
              </p>
              <p className="flex items-center">
                <FaPhoneAlt className="mr-3 text-primary shrink-0" />
                +880 1627142598
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top + Copyright */}
      <div className="mt-16 border-t border-gray-800 pt-3">
        <div className="w-11/12 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm">
            <p>
              © {new Date().getFullYear()} <span className="text-primary font-semibold">Urban Snacks</span>. 
              All rights reserved.
            </p>

            <div className="flex gap-6">
              <a 
                href="https://www.facebook.com/abu.ssayed.khan.2024" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://github.com/sayed725" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/abu-sayed-khan-922801317" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {/* <div className="fixed bottom-8 right-8 z-50 md:bottom-12 md:right-12">
        <a 
          href="#top" 
          className="block"
          aria-label="Back to top"
        >
          <Button 
            size="icon" 
            className="rounded-full bg-[#1cb89e] hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-300 h-12 w-12"
          >
            <FaChevronUp className="h-5 w-5" />
          </Button>
        </a>
      </div> */}
    </footer>
  );
}