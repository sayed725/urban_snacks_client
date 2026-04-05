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

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    subName: "",
    isActive: true,
    isFeatured: false,
    description: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categories = response?.data || [];

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", subName: "", isActive: true, isFeatured: false, description: "" });
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
    });
    setIsEditOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

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
                                   if (confirm("Are you sure you want to delete this category?")) {
                                      deleteMutation.mutate(cat.id);
                                   }
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
