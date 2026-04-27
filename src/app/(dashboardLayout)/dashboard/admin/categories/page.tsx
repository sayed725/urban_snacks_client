"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Filter, Search, RefreshCw, XCircle } from "lucide-react";
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
import { ImageUploadField } from "@/components/shared/form/image-upload-field";
import CategoriesLoadingSkeleton from "./_categoriesLoadingSkeleton";
import { useDebounce } from "@/hooks/use-debounce";
import USPagination from "@/components/shared/USPagination";


export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Filters and Pagination State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    subName: "",
    isActive: true,
    isFeatured: false,
    description: "",
    image: "",
  });


  const { data: response, isLoading } = useQuery({
    queryKey: ["categories", page, debouncedSearch, isActiveFilter, isFeaturedFilter, sortBy, sortOrder],
    queryFn: () => getCategories({
      page,
      limit: 10,
      searchTerm: debouncedSearch,
      isActive: isActiveFilter === "all" ? undefined : isActiveFilter === "active",
      isFeatured: isFeaturedFilter === "all" ? undefined : isFeaturedFilter === "featured",
      sortBy,
      sortOrder
    }),
  });

  const categories = response?.data || [];
  const meta = response?.meta;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", subName: "", isActive: true, isFeatured: false, description: "", image: "" });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: selectedCategory.id, payload: formData });
  };

  const openEdit = (cat: any) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      subName: cat.subName || "",
      isActive: cat.isActive,
      isFeatured: cat.isFeatured,
      description: cat.description || "",
      image: cat.image || "",
    });
    setIsEditOpen(true);

  };

  if (isLoading) return <CategoriesLoadingSkeleton />;

  const resetFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setIsFeaturedFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || isActiveFilter !== "all" || isFeaturedFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">Manage item categories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-secondary font-semibold hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Name (Optional)</label>
                <Input
                  value={formData.subName}
                  onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <ImageUploadField
                  field={{
                    name: "image",
                    state: { value: formData.image, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, image: val })
                  } as any}
                  label="Category Image"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active Status</label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Featured</label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
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
            placeholder="Search by name, subname..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-10 h-11 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 rounded-xl"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
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
                  <SheetDescription className="sr-only">Filter and sort categories table</SheetDescription>
                  
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

                  {/* Featured Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Featured</h3>
                    <Select value={isFeaturedFilter} onValueChange={(v) => { setIsFeaturedFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="Featured" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="non-featured">Regular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Categories</h3>
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
                        <SelectItem value="name-asc">Name: A-Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z-A</SelectItem>
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

            <Select value={isFeaturedFilter} onValueChange={(v) => { setIsFeaturedFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="non-featured">Regular</SelectItem>
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
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
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

      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-secondary-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Sub Name</th>
                <th className="px-6 py-4 text-center">Items Count</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cat.subName || "-"}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">
                    {cat._count?.items || 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={cat.isFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: cat.id,
                          payload: { isFeatured: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={cat.isActive}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: cat.id,
                          payload: { isActive: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(cat)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                        onClick={() => {
                          toast.error("Confirm Deletion", {
                            description: `Are you sure you want to delete the category "${cat.name}"?`,
                            action: {
                              label: "Delete",
                              onClick: () => deleteMutation.mutate(cat.id),
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
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPage > 1 && (
        <div className="mt-4 bg-card border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Name (Optional)</label>
              <Input
                value={formData.subName}
                onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <ImageUploadField
                field={{
                  name: "image",
                  state: { value: formData.image, meta: { isTouched: false, errors: [] } },
                  handleChange: (val: string) => setFormData({ ...formData, image: val })
                } as any}
                label="Category Image"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active Status</label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Featured</label>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })}
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
