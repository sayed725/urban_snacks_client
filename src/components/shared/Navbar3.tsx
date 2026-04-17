"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CartDrawer } from "@/components/shared/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, Truck } from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: session,
    isPending, // loading state
  } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;
  const userInitial =
    session?.user?.name?.charAt(0)?.toUpperCase() ||
    session?.user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const closeMobileMenu = () => setIsOpen(false);

  const dashboardHref = userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders";


  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl py-3 lg:py-3" 
          : "bg-white/40 dark:bg-black/40 backdrop-blur-md border-transparent py-3 lg:py-3"
      )}
    >
      {/* Auth-style Background Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/5 pointer-events-none" />
      
      <div className=" mx-auto w-11/12  px-0 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src="/assets/urban_snaks_logo.png"
                alt="Urban Snacks Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm relative z-10 drop-shadow-sm"
              />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight sm:text-3xl bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">
              Urban Snacks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold transition-colors px-4 py-2 rounded-full group",
                  pathname === item.href
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400",
                )}
              >
                <span className="relative z-10">{item.title}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-orange-100 dark:bg-orange-500/10 rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
            {isPending || !mounted ? (
              <div className="h-8 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse ml-2" />
            ) : isAuthenticated && userRole !== "ADMIN" && (
                <Link
                  href="/my-orders"
                  className={cn(
                    "relative text-sm font-semibold transition-colors px-4 py-2 rounded-full group",
                    pathname.startsWith("/my-orders")
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400",
                  )}
                >
                  <span className="relative z-10">My Orders</span>
                  {pathname.startsWith("/my-orders") && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-orange-100 dark:bg-orange-500/10 rounded-full z-0"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ModeToggle />
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CartDrawer isMobile={false} />
            </motion.div>

            {isPending || !mounted ? (
              <div className="flex items-center gap-2">
                 <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm p-0 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors"
                    >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-secondary font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-black/90 backdrop-blur-xl">
                  <DropdownMenuLabel className="font-normal border-b dark:border-slate-800 pb-2 mb-1">
                     <p className="font-semibold">{session?.user?.name || "User"}</p>
                     <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={dashboardHref}>
                      {userRole === "ADMIN" ? (
                         <><LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard</>
                      ) : (
                         <><Truck className="mr-2 h-4 w-4" /> Track Orders</>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold text-md px-6 hover:scale-105 border-0">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CartDrawer isMobile={true} />
            </motion.div>
            <ModeToggle />
            
            {mounted && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-full bg-white/50 dark:bg-black/50">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
                <SheetHeader className="mb-8 border-b pb-4 text-left">
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access navigation links, cart, and account settings.</SheetDescription>
                  <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={closeMobileMenu}
                  >
                    <img
                      src="/assets/urban_snaks_logo.png"
                      alt="Logo"
                      className="h-8 w-8 rounded-sm"
                    />
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      Urban Snacks
                    </span>
                  </Link>
                </SheetHeader>

                <nav className="flex flex-col gap-6 px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        pathname === item.href
                          ? "text-primary font-bold"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                  
                  {isPending || !mounted ? (
                    <div className="h-6 w-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                  ) : isAuthenticated && userRole !== "ADMIN" && (
                      <Link
                        href="/my-orders"
                        onClick={closeMobileMenu}
                        className={cn(
                          "text-lg font-medium transition-colors",
                          pathname.startsWith("/my-orders")
                            ? "text-primary font-bold"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        My Orders
                      </Link>
                  )}

                  <div className="border-t pt-6 mt-2 space-y-4">
                    {isPending || !mounted ? (
                      <div className="space-y-4">
                        <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-lg animate-pulse" />
                        <div className="flex items-center gap-3 px-3 pt-4">
                           <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse" />
                           <div className="space-y-2 flex-1">
                              <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded animate-pulse" />
                              <div className="h-3 w-32 bg-slate-200/50 dark:bg-slate-800/50 rounded animate-pulse" />
                           </div>
                        </div>
                      </div>
                    ) : isAuthenticated ? (
                      <>
                        <Link
                          href={dashboardHref}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg bg-muted/50 hover:bg-muted"
                        >
                          {userRole === "ADMIN" ? <LayoutDashboard className="h-5 w-5 text-primary" /> : <Truck className="h-5 w-5 text-primary" />}
                          {userRole === "ADMIN" ? "Admin Dashboard" : "Track My Orders"}
                        </Link>
                        
                        <div className="pt-4 flex items-center gap-3 px-3">
                           <Avatar className="h-10 w-10 border">
                             <AvatarFallback className="bg-primary text-secondary font-bold">
                               {userInitial}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-bold text-sm leading-none">{session?.user?.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{session?.user?.email}</p>
                           </div>
                        </div>

                        <button
                          onClick={() => {
                            handleLogout();
                            closeMobileMenu();
                          }}
                          className="flex items-center gap-3 text-lg font-medium text-red-600 w-full text-left p-3 rounded-lg hover:bg-red-50 mt-2"
                        >
                          <LogOut className="h-5 w-5" />
                          Log Out
                        </button>
                      </>
                    ) : (
                      <Button asChild className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold text-lg border-0">
                        <Link href="/login" onClick={closeMobileMenu}>
                          Login to continue
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}