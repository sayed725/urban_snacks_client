"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/services/banner.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, XCircle, Image as ImageIcon, Filter, Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import BannersLoadingSkeleton from "./_bannersLoadingSkeleton";
import { BannerFormFields } from "../../../../../components/modules/admin/banner/BannerFormFields";

const defaultFormData = {
  title: "",
  subtitle: "",
  badge: "",
  image: "",
  order: 0,
  banner: true,
  isActive: true,
  categoryId: "",
  buttonText: "",
};

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({ ...defaultFormData });

  const { data: response, isLoading } = useQuery({
    queryKey: [
      "banners",
      page,
      debouncedSearch,
      isActiveFilter,
      typeFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getBanners({
        page,
        limit: 10,
        searchTerm: debouncedSearch,
        isActive:
          isActiveFilter === "all"
            ? undefined
            : isActiveFilter === "active",
        banner:
          typeFilter === "all"
            ? undefined
            : typeFilter === "hero",
        sortBy,
        sortOrder,
      }),
  });

  const banners = response?.data || [];
  const meta = response?.meta;

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner created successfully");
      setIsCreateOpen(false);
      setFormData({ ...defaultFormData });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create banner");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner updated successfully");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update banner");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete banner");
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      image: formData.image,
      banner: formData.banner,
      isActive: formData.isActive,
    };
    if (formData.title) payload.title = formData.title;
    if (formData.subtitle) payload.subtitle = formData.subtitle;
    if (formData.badge) payload.badge = formData.badge;
    if (formData.order !== undefined) payload.order = Number(formData.order);
    if (formData.categoryId) payload.categoryId = formData.categoryId;
    if (formData.buttonText) payload.buttonText = formData.buttonText;

    createMutation.mutate(payload);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      image: formData.image,
      banner: formData.banner,
      isActive: formData.isActive,
    };
    if (formData.title !== undefined) payload.title = formData.title;
    if (formData.subtitle !== undefined) payload.subtitle = formData.subtitle;
    if (formData.badge !== undefined) payload.badge = formData.badge;
    if (formData.order !== undefined) payload.order = Number(formData.order);
    if (formData.categoryId !== undefined) payload.categoryId = formData.categoryId;
    if (formData.buttonText !== undefined) payload.buttonText = formData.buttonText;

    updateMutation.mutate({ id: selectedBanner.id, payload });
  };

  const openEdit = (banner: any) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      badge: banner.badge || "",
      image: banner.image || "",
      order: banner.order || 0,
      banner: banner.banner ?? true,
      isActive: banner.isActive ?? true,
      categoryId: banner.categoryId || "",
      buttonText: banner.buttonText || "",
    });
    setIsEditOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setTypeFilter("all");
    setSortBy("order");
    setSortOrder("asc");
    setPage(1);
  };

  const isFiltered =
    search !== "" ||
    isActiveFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "order" ||
    sortOrder !== "asc";

  if (isLoading) return <BannersLoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" /> Banners
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your store's promotional banners
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-secondary font-semibold hover:bg-primary/90"
              onClick={() => setFormData({ ...defaultFormData })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Create Your New Banner
            </DialogDescription>
              
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <BannerFormFields formData={formData} setFormData={setFormData} />
              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Banner"}
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
            placeholder="Search titles, subtitles..."
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
                  <SheetDescription className="sr-only">Filter and sort banners table</SheetDescription>
                  
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
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Banner Type</h3>
                    <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="hero">Hero Banner</SelectItem>
                        <SelectItem value="other">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Banners</h3>
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
                        <SelectItem value="order-asc">Display Order (Asc)</SelectItem>
                        <SelectItem value="order-desc">Display Order (Desc)</SelectItem>
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
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
                <SelectItem value="hero">Hero Banner</SelectItem>
                <SelectItem value="other">Secondary</SelectItem>
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
                <SelectItem value="order-asc">Display Order (Asc)</SelectItem>
                <SelectItem value="order-desc">Display Order (Desc)</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
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
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Subtitle</th>
                <th className="px-6 py-4">Badge</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Toggle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                     <div className="w-24 h-14 bg-muted rounded-md overflow-hidden relative border shadow-sm">
                        {banner.image ? (
                           <img src={banner.image} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-muted-foreground">
                              <ImageIcon className="w-4 h-4 mb-1" />
                              No img
                           </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-bold max-w-[180px] truncate" title={banner.title}>
                     {banner.title || <span className="text-muted-foreground font-normal italic">None</span>}
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate" title={banner.subtitle}>
                     {banner.subtitle || <span className="text-muted-foreground italic">None</span>}
                  </td>
                  <td className="px-6 py-4">
                     {banner.badge ? (
                        <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded font-bold">
                           {banner.badge}
                        </span>
                     ) : (
                        <span className="text-muted-foreground italic">-</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        banner.banner
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {banner.banner ? "Hero" : "Secondary"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    {banner.order ?? <span className="font-normal text-muted-foreground">-</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      
                      {banner.isActive ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full font-bold">
                          Inactive
                        </span>
                      )}
                      
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={banner.banner}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: banner.id,
                          payload: { banner: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(banner)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                        onClick={() => {
                          toast.error("Confirm Deletion", {
                            description: `Delete this banner?`,
                            action: {
                              label: "Delete",
                              onClick: () => deleteMutation.mutate(banner.id),
                            },
                            cancel: {
                              label: "Cancel",
                              onClick: () => {},
                            },
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No banners found. Create one to get started.
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
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
           <DialogDescription>
              Edit Your Banner
            </DialogDescription>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <BannerFormFields formData={formData} setFormData={setFormData} />
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Banner"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
