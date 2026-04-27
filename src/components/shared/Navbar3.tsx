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
} from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { authClient } from "@/lib/auth-client";


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
    isPending,
  } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;

  const menuItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Products", href: "/products", icon: Package },
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
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-semibold transition-all duration-300 px-5 py-2.5 rounded-xl group",
                    isActive
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400",
                  )}
                >
                  <span className="relative z-10">{item.title}</span>
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/15 rounded-xl"
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-transparent group-hover:bg-slate-100/80 dark:group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                  )}
                </Link>
              );
            })}
            {isPending || !mounted ? (
              <div className="h-8 w-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse ml-2" />
            ) : isAuthenticated && (
              <Link
                href={userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders"}
                className={cn(
                  "relative text-sm font-semibold transition-all duration-300 px-5 py-2.5 rounded-xl group",
                  pathname.startsWith(userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders")
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400",
                )}
              >
                <span className="relative z-10">{userRole === "ADMIN" ? "Dashboard" : "My Orders"}</span>
                {pathname.startsWith(userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders") && (
                  <div
                    className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/15 rounded-xl"
                  />
                )}
                {!pathname.startsWith(userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders") && (
                  <div className="absolute inset-0 bg-transparent group-hover:bg-slate-100/80 dark:group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                )}
              </Link>
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
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                              isActive
                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <IconComp className={cn(
                              "h-5 w-5 transition-colors",
                              isActive ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-500"
                            )} />
                            <span className="text-base font-medium">{item.title}</span>
                            <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/50" />
                          </Link>
                        );
                      })}

                      {isPending || !mounted ? (
                        <div className="h-12 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                      ) : isAuthenticated && userRole !== "ADMIN" && (
                        <Link
                          href="/my-orders"
                          onClick={closeMobileMenu}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                            pathname.startsWith("/my-orders")
                              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <ClipboardList className={cn(
                            "h-5 w-5 transition-colors",
                            pathname.startsWith("/my-orders") ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-500"
                          )} />
                          <span className="text-base font-medium">My Orders</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/50" />
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