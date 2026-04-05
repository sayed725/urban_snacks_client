"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, ShoppingCart, Truck } from "lucide-react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/store/cart.store";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartStore();

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
    window.location.href = "/";
  };

  const closeMobileMenu = () => setIsOpen(false);

  const dashboardHref = userRole === "ADMIN" ? "/dashboard/admin" : "/my-orders";

  if (isPending) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-secondary w-full">
        <div className="container mx-auto px-4 lg:px-0 py-3">
          <div className="h-10 flex items-center justify-between">
            <div className="w-24 h-8 bg-muted animate-pulse rounded" />
            <div className="hidden lg:flex gap-8">
              <div className="w-16 h-5 bg-muted animate-pulse rounded" />
              <div className="w-16 h-5 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
              <div className="w-24 h-10 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-secondary w-full shadow-sm">
      <div className="container mx-auto w-11/12 lg:w-full px-0 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/urban_snaks_logo.png"
              alt="Urban Snacks Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm"
            />
            <span className="text-2xl font-bold tracking-tight sm:text-3xl text-primary">
              Urban Snacks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary font-bold"
                    : "text-foreground",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                )}
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated && userRole !== "ADMIN" && (
                <Link
                  href="/my-orders"
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith("/my-orders")
                      ? "text-primary font-bold"
                      : "text-foreground",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                  )}
                >
                  My Orders
                </Link>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative group flex items-center justify-center p-2 rounded-full transition-colors border shadow-sm bg-background hover:border-primary">
                <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                {totalItems() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-secondary text-[10px] font-bold h-5 min-w-5 flex items-center justify-center px-1.5 rounded-full shadow-sm ring-2 ring-background">
                    {totalItems()}
                  </span>
                )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border shadow-sm"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-secondary font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl">
                  <DropdownMenuLabel className="font-normal border-b pb-2 mb-1">
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
              <Button asChild className="bg-primary text-secondary font-semibold hover:bg-primary/90 rounded-full px-6 shadow-sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/cart" className="relative group mr-2">
                <ShoppingCart className="h-6 w-6 text-foreground" />
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-secondary text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-background">
                    {totalItems()}
                  </span>
                )}
            </Link>
            <ModeToggle />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="border shadow-sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
                <SheetHeader className="mb-8 border-b pb-4 text-left">
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
                    <span className="text-xl font-bold tracking-tight text-primary">
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
                  
                  {isAuthenticated && userRole !== "ADMIN" && (
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
                    {isAuthenticated ? (
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
                      <Button asChild className="w-full h-12 text-lg bg-primary text-secondary font-semibold">
                        <Link href="/login" onClick={closeMobileMenu}>
                          Login to continue
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}