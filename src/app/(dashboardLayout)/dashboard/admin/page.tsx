"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { IAdminStats } from "@/types/stats.type";
import { getAdminStats } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { cn, formatPrice } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Layers,
  ShoppingBag,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboardPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => getAdminStats(),
  });

  const stats: IAdminStats | undefined = response?.data;

  // Memoized Chart Data for Performance
  const chartData = useMemo(() => {
    return stats?.revenueData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      revenue: item.revenue,
    }));
  }, [stats]);

  if (isLoading) return <DashboardSkeleton />;
  if (!stats) return <div className="p-8">Error loading statistics.</div>;

  return (
    <div className="flex-1 space-y-6 ">
      <div className="flex justify-between items-center bg-card p-5 rounded-xl border">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Platform Insights
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time overview of Urban Snacks operations and revenue.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            Live System Status: Healthy
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          {/* --- KPI SECTION: TOP ROW --- */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={formatPrice(stats.summary.totalRevenue)}
              description="Gross revenue overall"
              icon={<Banknote className="h-4 w-4 text-emerald-600" />}
              trend="All-time"
              trendUp={true}
            />
            <MetricCard
              title="Total Orders"
              value={stats.summary.totalOrders.toString()}
              description="All orders placed"
              icon={<ShoppingBag className="h-4 w-4 text-blue-600" />}
              trend={`${stats.orderStats.byStatus.DELIVERED || 0} delivered`}
              trendUp={true}
            />
            <MetricCard
              title="Payments"
              value={stats.summary.totalPayments.toString()}
              description="Total payment records"
              icon={<Banknote className="h-4 w-4 text-orange-600" />}
              trend=""
              trendUp={true}
            />
            <MetricCard
              title="Inventory Health"
              value={stats.summary.totalItems.toString()}
              description="Active snacks & items"
              icon={<Layers className="h-4 w-4 text-purple-600" />}
              trend="Items active"
              trendUp={true}
            />
            <MetricCard
              title="Total Users"
              value={stats.summary.totalUsers.toString()}
              description="Registered accounts"
              icon={<UserCheck className="h-4 w-4 text-pink-600" />}
              trend="Platform users"
              trendUp={true}
            />
            <MetricCard
              title="Categories"
              value={stats.summary.totalCategories.toString()}
              description="Product categories"
              icon={<Layers className="h-4 w-4 text-indigo-600" />}
              trend="Active categories"
              trendUp={true}
            />
            <MetricCard
              title="Promotions"
              value={stats.summary.totalBanners.toString()}
              description="Active banners"
              icon={<TrendingUp className="h-4 w-4 text-cyan-600" />}
              trend="Hero banners"
              trendUp={true}
            />
            <MetricCard
              title="Coupons"
              value={stats.summary.totalCoupons.toString()}
              description="Available coupons"
              icon={<ShoppingBag className="h-4 w-4 text-rose-600" />}
              trend="Discount codes"
              trendUp={true}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* --- REVENUE TREND ANALYSIS --- */}
            <Card className="lg:col-span-4 shadow-sm shadow-muted">
              <CardHeader>
                <CardTitle className="font-extrabold tracking-tight">Financial Performance (Last 30 Days)</CardTitle>
                <CardDescription>
                  Daily revenue correlation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f59e0b"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f59e0b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-border"
                        stroke="currentColor"
                      />
                      <XAxis
                        dataKey="date"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `৳${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* --- TOP PERFORMING ITEMS --- */}
            <Card className="lg:col-span-3 shadow-sm shadow-muted">
              <CardHeader>
                <CardTitle className="font-extrabold tracking-tight">Most Ordered Snacks</CardTitle>
                <CardDescription>
                  Top items by volume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stats.mostOrderedItems?.map((item, idx) => (
                    <div
                      key={`top-item-${idx}`}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium leading-none group-hover:underline">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-secondary text-primary px-2 py-1 rounded-full">
                          {item.count} sold
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!stats.mostOrderedItems || stats.mostOrderedItems.length === 0) && (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* --- ORDER STATUSES --- */}
            <Card className="flex flex-col shadow-sm shadow-muted">
              <CardHeader>
                <CardTitle className="font-extrabold tracking-tight">Order Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                 <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <span className="font-medium text-slate-600 dark:text-slate-300">Placed</span>
                    <span className="font-extrabold text-lg tabular-nums">{stats.orderStats.byStatus.PLACED || 0}</span>
                 </div>
                 <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Processing</span>
                    <span className="font-extrabold text-lg tabular-nums">{stats.orderStats.byStatus.PROCESSING || 0}</span>
                 </div>
                 <div className="flex justify-between items-center bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <span className="font-medium text-purple-600 dark:text-purple-400">Shipped</span>
                    <span className="font-extrabold text-lg tabular-nums">{stats.orderStats.byStatus.SHIPPED || 0}</span>
                 </div>
                 <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <span className="font-medium text-green-600 dark:text-green-400">Delivered</span>
                    <span className="font-extrabold text-lg tabular-nums">{stats.orderStats.byStatus.DELIVERED || 0}</span>
                 </div>
                 <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <span className="font-medium text-red-600 dark:text-red-400">Cancelled</span>
                    <span className="font-extrabold text-lg tabular-nums">{stats.orderStats.byStatus.CANCELLED || 0}</span>
                 </div>
              </CardContent>
            </Card>

            {/* --- RECENT ORDERS --- */}
            <Card className="shadow-sm shadow-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-extrabold tracking-tight">Recent Orders</span>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentOrders?.map((order) => (
                    <div key={order.id} className="flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
                       <div className="flex justify-between items-center">
                          <span className="font-extrabold tracking-tight">{order.orderNumber}</span>
                          <span className="font-bold text-primary tabular-nums">{formatPrice(order.totalAmount)}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{order.user?.name || order.user?.email || "Guest"}</span>
                          <Badge variant="outline">{order.status}</Badge>
                       </div>
                    </div>
                  ))}
                  {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                    <p className="text-sm text-muted-foreground">No recent orders.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* Sub-components and Helpers for cleaner code */

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  trendUp,
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm shadow-muted transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-muted/60 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {description}
        </p>
        {trend && (
          <div
            className={`mt-4 flex items-center text-xs font-bold ${trendUp ? "text-emerald-600" : "text-amber-600"}`}
          >
            {trendUp ? (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3" />
            )}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-xl" />
        <Skeleton className="col-span-3 h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
