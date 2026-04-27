"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/services/coupon.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, XCircle, Ticket, Filter, Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import USPagination from "@/components/shared/USPagination";
import { formatPrice } from "@/lib/utils";
import CouponsLoadingSkeleton from "./_couponsLoadingSkeleton";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { CouponFormFields } from "../../../../../components/modules/admin/cupon/CouponFormFields";

const defaultFormData = {
  code: "",
  discountType: "FIXED" as "FIXED" | "PERCENTAGE",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  expiryDate: "",
  usageLimit: 0,
  isActive: true,
  description: "",
};

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({ ...defaultFormData });

  const { data: response, isLoading } = useQuery({
    queryKey: [
      "coupons",
      page,
      debouncedSearch,
      isActiveFilter,
      typeFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getCoupons({
        page,
        limit: 10,
        searchTerm: debouncedSearch,
        isActive:
          isActiveFilter === "all"
            ? undefined
            : isActiveFilter === "active",
        discountType: typeFilter === "all" ? undefined : typeFilter,
        sortBy,
        sortOrder,
      }),
  });

  const coupons = response?.data || [];
  const meta = response?.meta;

  const createMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created successfully");
      setIsCreateOpen(false);
      setFormData({ ...defaultFormData });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create coupon");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon updated successfully");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete coupon");
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      isActive: formData.isActive,
    };
    if (formData.minOrderAmount)
      payload.minOrderAmount = Number(formData.minOrderAmount);
    if (formData.maxDiscountAmount)
      payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
    if (formData.usageLimit)
      payload.usageLimit = Number(formData.usageLimit);
    if (formData.description) payload.description = formData.description;

    createMutation.mutate(payload);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      isActive: formData.isActive,
    };
    if (formData.minOrderAmount)
      payload.minOrderAmount = Number(formData.minOrderAmount);
    if (formData.maxDiscountAmount)
      payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
    if (formData.usageLimit)
      payload.usageLimit = Number(formData.usageLimit);
    if (formData.description) payload.description = formData.description;

    updateMutation.mutate({ id: selectedCoupon.id, payload });
  };

  const openEdit = (coupon: any) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "FIXED",
      discountValue: coupon.discountValue || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      expiryDate: coupon.expiryDate
        ? moment(coupon.expiryDate).format("YYYY-MM-DDTHH:mm")
        : "",
      usageLimit: coupon.usageLimit || 0,
      isActive: coupon.isActive ?? true,
      description: coupon.description || "",
    });
    setIsEditOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setTypeFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered =
    search !== "" ||
    isActiveFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  if (isLoading) return <CouponsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" /> Coupons
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage discount coupons
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-secondary font-semibold hover:bg-primary/90"
              onClick={() => setFormData({ ...defaultFormData })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <CouponFormFields formData={formData} setFormData={setFormData} />
              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-10 h-11 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 rounded-xl"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-auto">
          {/* Mobile/Tablet Filter Drawer */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-auto gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl h-11 px-3 sm:px-4 transition-all">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {isFiltered && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col" showCloseButton={false}>
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" /> Filters
                  </SheetTitle>
                  <SheetClose className="rounded-xl p-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent hover:border-orange-200 dark:hover:border-orange-800">
                    <XCircle className="h-5 w-5 text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400" />
                  </SheetClose>
                </SheetHeader>
                
                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort coupons table</SheetDescription>
                  
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Active Status</h3>
                    <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Discount Type</h3>
                    <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Coupons</h3>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                      const [by, order] = v.split('-');
                      setSortBy(by);
                      setSortOrder(order as "asc" | "desc");
                      setPage(1);
                    }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                        <SelectItem value="code-asc">Code: A-Z</SelectItem>
                        <SelectItem value="code-desc">Code: Z-A</SelectItem>
                        <SelectItem value="expiryDate-asc">Expiry: Soonest</SelectItem>
                        <SelectItem value="expiryDate-desc">Expiry: Latest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50">
                  <Button 
                    onClick={resetFilters} 
                    variant="outline" 
                    disabled={!isFiltered}
                    className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Inline Filters */}
          <div className="hidden lg:flex flex-wrap gap-2 items-center">
            <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
              const [by, order] = v.split('-');
              setSortBy(by);
              setSortOrder(order as "asc" | "desc");
              setPage(1);
            }}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="code-asc">Code: A-Z</SelectItem>
                <SelectItem value="code-desc">Code: Z-A</SelectItem>
                <SelectItem value="expiryDate-asc">Expiry: Soonest</SelectItem>
                <SelectItem value="expiryDate-desc">Expiry: Latest</SelectItem>
              </SelectContent>
            </Select>

            {isFiltered && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-muted-foreground hover:text-orange-600 h-10 px-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-secondary-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-center">Usage</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Toogle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon) => {
                const isExpired =
                  new Date(coupon.expiryDate) < new Date();
                const isLimitReached =
                  coupon.usageLimit !== null &&
                  coupon.usageLimit !== undefined &&
                  coupon.usedCount >= coupon.usageLimit;

                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${coupon.discountType === "PERCENTAGE"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                      >
                        {coupon.discountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue)}
                      {coupon.discountType === "PERCENTAGE" &&
                        coupon.maxDiscountAmount && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (max {formatPrice(coupon.maxDiscountAmount)})
                          </span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {coupon.minOrderAmount
                        ? formatPrice(coupon.minOrderAmount)
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${isExpired
                            ? "text-red-500 font-semibold"
                            : "text-muted-foreground"
                          }`}
                      >
                        {moment(coupon.expiryDate).format("MMM DD, YYYY")}
                      </span>
                      {isExpired && (
                        <span className="block text-xs text-red-400">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold">{coupon.usedCount}</span>
                      <span className="text-muted-foreground">
                        /{coupon.usageLimit ?? "∞"}
                      </span>
                      {isLimitReached && (
                        <span className="block text-xs text-amber-500 font-semibold">
                          Limit reached
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {coupon.isActive && !isExpired ? (
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full font-bold">
                          {isExpired ? "Expired" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-center gap-1">
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({
                              id: coupon.id,
                              payload: { isActive: checked }
                            });
                          }}
                          disabled={updateMutation.isPending}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEdit(coupon)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                          onClick={() => {
                            toast.error("Confirm Deletion", {
                              description: `Delete coupon "${coupon.code}"?`,
                              action: {
                                label: "Delete",
                                onClick: () =>
                                  deleteMutation.mutate(coupon.id),
                              },
                              cancel: {
                                label: "Cancel",
                                onClick: () => { },
                              },
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="mt-4 bg-card border rounded-xl overflow-hidden shadow-sm">
          <USPagination
            page={page}
            totalPage={meta.totalPage}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <CouponFormFields formData={formData} setFormData={setFormData} />
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Coupon"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
