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
import { Plus, Pencil, Trash2, XCircle, Ticket } from "lucide-react";
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
import { useDebounce } from "@/hooks/use-debounce";
import USPagination from "@/components/shared/USPagination";
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

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pr-10"
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
        <div className="flex flex-wrap gap-2">
          <Select
            value={isActiveFilter}
            onValueChange={(v) => {
              setIsActiveFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="FIXED">Fixed</SelectItem>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = v.split("-");
              setSortBy(by);
              setSortOrder(order as "asc" | "desc");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
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
              variant="outline"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground px-2"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
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
                        : `$${coupon.discountValue}`}
                      {coupon.discountType === "PERCENTAGE" &&
                        coupon.maxDiscountAmount && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (max ${coupon.maxDiscountAmount})
                          </span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {coupon.minOrderAmount
                        ? `$${coupon.minOrderAmount}`
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
