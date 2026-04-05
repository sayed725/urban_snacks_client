"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ChevronsUpDown,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Box,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;
  const role = user.role;

  const managementItems = [
    {
      title: "Dashboard",
      href: `/dashboard/admin`,
      icon: LayoutDashboard,
      roles: ["ADMIN"],
    },
    {
      title: "All Items",
      href: "/dashboard/admin/items", // using Box for items
      icon: Box,
      roles: ["ADMIN"],
    },
    {
      title: "Categories",
      href: "/dashboard/admin/categories",
      icon: Package,
      roles: ["ADMIN"],
    },
    {
      title: "Manage Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingBag,
      roles: ["ADMIN"],
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
      roles: ["ADMIN"],
    },
  ].filter((item) => item.roles.includes(role as string));

  const publicItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Store", href: "/products", icon: ShoppingBag },
  ];

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader>
        <div className="flex flex-col gap-3 px-4 py-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg w-full object-cover select-none"
          >
            <img
              src="/assets/urban_snaks_logo.png"
              alt="Logo"
              className="rounded-sm w-full h-[60px] object-contain"
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {role === "ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Public Routes Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarMenu>
            {publicItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">
                      {user.name || user.email?.split("@")[0]}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 font-bold">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-black dark:text-white">
                        My Account
                      </span>
                      <span className="truncate text-sm text-muted-foreground capitalize">
                        {role?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.signOut();
                    router.push("/");
                    toast.success("Logged out successfully");
                    router.refresh();
                  }}
                  className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-0.5 size-4 mt-0.5 focus:text-destructive" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
