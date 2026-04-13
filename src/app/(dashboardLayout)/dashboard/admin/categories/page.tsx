"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/features/category/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ImageUploadField } from "@/components/shared/form/image-upload-field";
import CategoriesLoadingSkeleton from "./_categoriesLoadingSkeleton";
import { XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";


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

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by name, subname..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pr-10"
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
        <div className="flex flex-wrap gap-2">
           <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
           </Select>

           <Select value={isFeaturedFilter} onValueChange={(v) => { setIsFeaturedFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[180px]">
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
             <Button variant="outline" onClick={resetFilters} className="text-muted-foreground hover:text-foreground px-2">
                <XCircle className="h-4 w-4 mr-2" />
                Clear
             </Button>
           )}
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
                          {cat.isFeatured ? (
                             <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">Yes</span>
                          ) : (
                             <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">No</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-center">
                          {cat.isActive ? (
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                          ) : (
                             <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">Inactive</span>
                          )}
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
        <div className="mt-4 border-t pt-6 bg-card border rounded-xl overflow-hidden shadow-sm pb-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {meta.totalPage}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                  className={page === meta.totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
