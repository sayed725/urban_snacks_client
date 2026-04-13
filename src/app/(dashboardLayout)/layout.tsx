"use client";

import { AppSidebar } from "@/components/layout/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebarStore } from "@/store/sidebar.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isCollapsed, setCollapsed } = useSidebarStore();

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <SidebarProvider
      open={!isCollapsed}
      onOpenChange={(open) => setCollapsed(!open)}
    >
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex py-3 shrink-0 items-center gap-2 border-b bg-white dark:bg-black px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border mx-2" />

            {/* Dynamic Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathSegments.length - 1;

                  return (
                    <React.Fragment key={`dashboard-breadcrumb-${href}`}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">
                            {segment.replace(/-/g, " ")}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild className="capitalize">
                            <Link href={href}>
                              {segment.replace(/-/g, " ")}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto ">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}