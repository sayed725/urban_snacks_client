"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service";
import { getCategories } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ImageIcon, XCircle, Filter, Search, RefreshCw } from "lucide-react";
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
import AddItemForm from "@/components/modules/admin/items/AddItemForm";
import ItemsLoadingSkeleton from "./_itemsLoadingSkeleton";
import { useDebounce } from "@/hooks/use-debounce";
import USPagination from "@/components/shared/USPagination";
import { formatPrice } from "@/lib/utils";


export default function AdminItems() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    price: 0,
    categoryId: "",
    mainImage: "",
    semiTitle: "",
    image: [] as string[],
    isActive: true,
    isFeatured: false,
    isSpicy: false,
    description: "",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [categoryIdFilter, setCategoryIdFilter] = useState("all");
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data: itemResponse, isLoading: itemsLoading } = useQuery({
    queryKey: ["items", page, debouncedSearch, categoryIdFilter, isActiveFilter, sortBy, sortOrder],
    queryFn: () => getItems({
      limit: 10,
      page,
      searchTerm: debouncedSearch,
      categoryId: categoryIdFilter === "all" ? undefined : categoryIdFilter,
      isActive: isActiveFilter === "all" ? undefined : isActiveFilter === "active",
      sortBy,
      sortOrder
    }),
  });

  const { data: catResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const items = itemResponse?.data || [];
  const meta = itemResponse?.meta;
  const categories = catResponse?.data || [];


  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item updated successfully");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete item");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      weight: "",
      price: 0,
      categoryId: "",
      mainImage: "",
      semiTitle: "",
      image: [],
      isActive: true,
      isFeatured: false,
      isSpicy: false,
      description: "",
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    updateMutation.mutate({ id: selectedItem.id, payload: formData });
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      weight: item.weight || "",
      price: item.price || 0,
      categoryId: item.categoryId || "",
      mainImage: item.mainImage || "",
      semiTitle: item.semiTitle || "",
      image: Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []),
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy || false,
      description: item.description || "",
    });
    setIsEditOpen(true);
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryIdFilter("all");
    setIsActiveFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || categoryIdFilter !== "all" || isActiveFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  if (itemsLoading) return <ItemsLoadingSkeleton />;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">Items Catalog</h1>
          <p className="text-muted-foreground text-sm">Manage snacks and inventory</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(val) => {
          if (val) resetForm();
          setIsCreateOpen(val);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-secondary font-semibold hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            
            <AddItemForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleCreateSubmit}
              isPending={createMutation.isPending}
              buttonText="Create Item"
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items by name..."
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
                  <SheetDescription className="sr-only">Filter and sort items catalog table</SheetDescription>
                  
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Category</h3>
                    <Select value={categoryIdFilter} onValueChange={(v) => { setCategoryIdFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</h3>
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

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Items</h3>
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
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
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
            <Select value={categoryIdFilter} onValueChange={(v) => { setCategoryIdFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={isActiveFilter} onValueChange={(v) => { setIsActiveFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
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
                <th className="px-6 py-4 w-16">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    {item.mainImage || (item.image && item.image[0]) ? (
                      <img src={item.mainImage || item.image[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center border">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.weight} {item.isSpicy && '🌶️'}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={item.isFeatured}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isFeatured: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={item.isActive}
                      onCheckedChange={(checked) => {
                        updateMutation.mutate({
                          id: item.id,
                          payload: { isActive: checked }
                        });
                      }}
                      disabled={updateMutation.isPending}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                        onClick={() => {
                          toast.error("Confirm Deletion", {
                            description: `Are you sure you want to delete ${item.name}?`,
                            action: {
                              label: "Delete",
                              onClick: () => deleteMutation.mutate(item.id)
                            },
                            cancel: {
                              label: "Cancel",
                              onClick: () => { }
                            }
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No items found. Time to add some tasty snacks!
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <AddItemForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            buttonText="Update Item"
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
