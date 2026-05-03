"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Truck,
  Home,
  Package,
  ClipboardList,
  ChevronRight,
  X,
  ShoppingCart,
  BookOpen,
  ClipboardListIcon,
  Flame,
  Candy,
  Pizza,
  Coffee,
  ChevronDown,
} from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import Image from "next/image";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
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

  const { data: categoriesData } = useQuery({
    queryKey: ["categories", "featured", "active"],
    queryFn: () => getCategories({ limit: 6, sortOrder: "asc", isActive: true, isFeatured: true }),
  });

  const categories = categoriesData?.success && categoriesData?.data 
    ? categoriesData.data.map(cat => {
        const lowerName = cat.name.toLowerCase();
        let Icon = Package;
        if (lowerName.includes('spic') || lowerName.includes('hot')) Icon = Flame;
        else if (lowerName.includes('sweet') || lowerName.includes('dessert') || lowerName.includes('cake')) Icon = Candy;
        else if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('tea')) Icon = Coffee;
        else if (lowerName.includes('pizza') || lowerName.includes('combo')) Icon = Pizza;
        
        return {
          title: cat.name,
          href: `/products?categoryName=${cat.name}`,
          description: cat.subName || cat.description || `Explore our ${cat.name}`,
          icon: Icon,
          image: cat.image
        };
      })
    : [];

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  const menuItems = [
    { title: "Home", href: "/", icon: Home },
    { 
      title: "Products", 
      href: "/products", 
      icon: Package,
      subItems: categories.length > 0 ? categories : [
        { title: "Beef Jerky", href: "/products?categoryName=Beef Jerky", description: "The OG, Smoky Hot", icon: Flame, image: undefined },
        { title: "Chicken Jerky", href: "/products?categoryName=Chicken Jerky", description: "The OG, Smoky Hot", icon: Flame, image: undefined },
      ]
    },
    { title: "Blog", href: "/blog", icon: BookOpen },
    { title: "Contact Us", href: "/contact", icon: ClipboardListIcon },
    ...(userRole !== "ADMIN" ? [{ title: "Cart", href: "/cart", icon: ShoppingCart }] : []),
  ];

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
    <nav
      className={cn(
        "relative lg:sticky top-0 z-50 w-full transition-all duration-500 border-b",
        isScrolled
          ? "bg-white/80 dark:bg-black/70 backdrop-blur-2xl border-slate-200/50 dark:border-white/10 shadow-lg shadow-black/[0.03] dark:shadow-black/20 py-2.5 lg:py-2.5"
          : "bg-white/40 dark:bg-black/40 backdrop-blur-md border-transparent py-3 lg:py-3"
      )}
    >
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] via-transparent to-orange-500/[0.03] pointer-events-none" />

      <div className="mx-auto w-11/12 px-0 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <img
                src="/assets/urban_snaks_logo.png"
                alt="Urban Snacks Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight sm:text-2xl bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Urban Snacks
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
              
              if (item.subItems) {
                return (
                  <div key={item.title} className="relative group/navItem flex items-center h-full py-2">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-1 text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400",
                        isActive
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-slate-600 dark:text-slate-300",
                        "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full",
                        isActive && "after:w-full"
                      )}
                    >
                      {item.title}
                      {/* <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover/navItem:rotate-180" /> */}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover/navItem:opacity-100 group-hover/navItem:translate-y-0 group-hover/navItem:pointer-events-auto transition-all duration-300 z-50">
                      <div className="w-[750px] rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
                        {/* <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 border-b border-orange-100 dark:border-slate-800">
                          <p className="font-bold text-orange-600 dark:text-orange-400">Discover Snacks</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Find the perfect bite for your craving</p>
                        </div> */}
                        <div className="grid grid-cols-3 gap-2 p-4">
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors group/sub"
                              >
                                <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-orange-100 dark:border-orange-900/30">
                                  {sub.image ? (
                                    <Image 
                                      src={sub.image} 
                                      alt={sub.title} 
                                      fill 
                                      sizes="48px"
                                      className="object-cover group-hover/sub:scale-110 transition-transform duration-500" 
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                      <SubIcon className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-sm text-slate-900 dark:text-white group-hover/sub:text-orange-600 dark:group-hover/sub:text-orange-400 transition-colors truncate">{sub.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{sub.description}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        {/* <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                          <Link href="/products" className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors">
                            View All Products <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.href} className="flex items-center h-full py-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400",
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-slate-600 dark:text-slate-300",
                      "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full",
                      isActive && "after:w-full"
                    )}
                  >
                    {item.title}
                  </Link>
                </div>
              );
            })}
            {isPending || !mounted ? (
              <div className="h-8 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse ml-2" />
            ) : isAuthenticated && (
              <div className="flex items-center h-full py-2">
                <Link
                  href={userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders"}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400",
                    pathname.startsWith(userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders")
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-300",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full",
                    pathname.startsWith(userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders") && "after:w-full"
                  )}
                >
                  {userRole === "ADMIN" ? "Dashboard" : "My Orders"}
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <ModeToggle />
            <CartDrawer isMobile={false} />

            {isPending || !mounted ? (
              <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 ring-2 ring-orange-500 dark:ring-orange-500 hover:ring-orange-400 dark:hover:ring-orange-400 transition-all duration-300"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image as string} alt={session?.user?.name || "User"} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-sm">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 mt-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-2 shadow-xl"
                >
                  <DropdownMenuLabel className="font-normal px-3 py-3 border-b dark:border-slate-800 mb-1">
                    <p className="font-bold text-sm">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{session?.user?.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-orange-50 dark:focus:bg-orange-950/30">
                    <Link href={dashboardHref}>
                      {userRole === "ADMIN" ? (
                        <><LayoutDashboard className="mr-2.5 h-4 w-4 text-orange-500" /> Admin Dashboard</>
                      ) : (
                        <><Truck className="mr-2.5 h-4 w-4 text-orange-500" /> Track Orders</>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer rounded-xl px-3 py-2.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-bold text-sm px-6 h-10 hover:scale-105 border-0">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <CartDrawer isMobile={true} />
            <ModeToggle />

            {mounted && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-black/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col" showCloseButton={false}>
                  <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">Access navigation links, cart, and account settings.</SheetDescription>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5"
                      onClick={closeMobileMenu}
                    >
                      <img
                        src="/assets/urban_snaks_logo.png"
                        alt="Logo"
                        className="h-9 w-9 rounded-lg"
                      />
                      <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Urban Snacks
                      </span>
                    </Link>
                    <SheetClose className="rounded-xl p-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent hover:border-orange-200 dark:hover:border-orange-800">
                      <X className="h-5 w-5 text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </SheetHeader>

                  <nav className="flex flex-col flex-1 p-4">
                    {/* Nav links */}
                    <div className="space-y-1">
                      {menuItems.map((item) => {
                        const IconComp = item.icon;
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                        const hasSubItems = !!item.subItems;
                        const isExpanded = expandedMenu === item.title;

                        return (
                          <div key={item.href} className="flex flex-col">
                            <div className="flex items-center w-full group">
                              <Link
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                  "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 hover:text-orange-600 dark:hover:text-orange-400 flex-1",
                                  isActive
                                    ? "text-orange-600 dark:text-orange-400 font-bold"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
                                  "after:absolute after:bottom-1 after:left-4 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-[calc(100%-2rem)]",
                                  isActive && "after:w-[calc(100%-2rem)]"
                                )}
                              >
                                <IconComp className={cn(
                                  "h-5 w-5 transition-colors relative z-10",
                                  isActive ? "text-orange-500" : "text-slate-400 dark:text-slate-500 group-hover:text-orange-500"
                                )} />
                                <span className="text-base font-medium relative z-10">{item.title}</span>
                              </Link>
                              
                              {hasSubItems && (
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setExpandedMenu(isExpanded ? null : item.title);
                                  }}
                                  className="p-3.5 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all flex-shrink-0"
                                >
                                  <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isExpanded && "rotate-180")} />
                                </button>
                              )}
                              {!hasSubItems && (
                                <div className="p-3.5 pointer-events-none flex-shrink-0">
                                  <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-orange-400" />
                                </div>
                              )}
                            </div>

                            {/* Sub-items accordion */}
                            {hasSubItems && (
                              <div 
                                className={cn(
                                  "overflow-hidden transition-all duration-300 ease-in-out pr-2",
                                  isExpanded ? "max-h-96 opacity-100 mt-1 mb-2" : "max-h-0 opacity-0 m-0"
                                )}
                              >
                                <div className="flex flex-col gap-1 border-l-2 border-orange-100 dark:border-slate-800 ml-8 pl-4 py-2">
                                  {item.subItems.map(sub => {
                                    const SubIcon = sub.icon;
                                    const isSubActive = pathname === sub.href;
                                    return (
                                      <Link
                                        key={sub.title}
                                        href={sub.href}
                                        onClick={closeMobileMenu}
                                        className={cn(
                                          "flex items-center gap-3 py-2 px-3 rounded-xl transition-colors",
                                          isSubActive 
                                            ? "bg-orange-50/80 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold" 
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-orange-600 dark:hover:text-orange-400"
                                        )}
                                      >
                                        <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-orange-100 dark:border-orange-900/30">
                                          {sub.image ? (
                                            <Image 
                                              src={sub.image} 
                                              alt={sub.title} 
                                              fill 
                                              sizes="32px"
                                              className="object-cover" 
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                              <SubIcon className="w-4 h-4" />
                                            </div>
                                          )}
                                        </div>
                                        <span className="text-sm">{sub.title}</span>
                                      </Link>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {isPending || !mounted ? (
                        <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                      ) : isAuthenticated && userRole !== "ADMIN" && (
                        <Link
                          href="/my-orders"
                          onClick={closeMobileMenu}
                          className={cn(
                            "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group hover:text-orange-600 dark:hover:text-orange-400",
                            pathname.startsWith("/my-orders")
                              ? "text-orange-600 dark:text-orange-400 font-bold"
                              : "text-slate-600 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
                            "after:absolute after:bottom-1 after:left-4 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-[calc(100%-2rem)]",
                            pathname.startsWith("/my-orders") && "after:w-[calc(100%-2rem)]"
                          )}
                        >
                          <ClipboardList className={cn(
                            "h-5 w-5 transition-colors relative z-10",
                            pathname.startsWith("/my-orders") ? "text-orange-500" : "text-slate-400 dark:text-slate-500 group-hover:text-orange-500"
                          )} />
                          <span className="text-base font-medium relative z-10">My Orders</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-slate-300 dark:text-slate-600 relative z-10 group-hover:text-orange-400 transition-colors" />
                        </Link>
                      )}
                    </div>

                    {/* Divider + Account Section */}
                    <div className="mt-auto border-t pt-4 space-y-3">
                      {isPending || !mounted ? (
                        <div className="space-y-3">
                          <div className="h-14 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                          <div className="flex items-center gap-3 px-3 pt-2">
                            <div className="h-10 w-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-full animate-pulse" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded animate-pulse" />
                              <div className="h-3 w-32 bg-slate-200/50 dark:bg-slate-800/50 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ) : isAuthenticated ? (
                        <>
                          {/* User Profile Card */}
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/30">
                            <Avatar className="h-11 w-11 ring-2 ring-orange-200 dark:ring-orange-800">
                              <AvatarImage src={session?.user?.image as string} alt={session?.user?.name || "User"} className="object-cover" />
                              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                                {userInitial}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-sm leading-none truncate">{session?.user?.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{session?.user?.email}</p>
                            </div>
                          </div>

                          {/* Dashboard Link */}
                          <Link
                            href={dashboardHref}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            {userRole === "ADMIN"
                              ? <LayoutDashboard className="h-5 w-5 text-orange-500" />
                              : <Truck className="h-5 w-5 text-orange-500" />}
                            <span className="text-sm font-semibold">
                              {userRole === "ADMIN" ? "Admin Dashboard" : "Track My Orders"}
                            </span>
                            <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/50" />
                          </Link>

                          {/* Logout */}
                          <button
                            onClick={() => {
                              handleLogout();
                              closeMobileMenu();
                            }}
                            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-semibold">Log Out</span>
                          </button>
                        </>
                      ) : (
                        <Button asChild className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-bold text-base border-0">
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
    </nav>
  );
}