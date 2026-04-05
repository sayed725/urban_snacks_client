"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, createItem, updateItem, deleteItem } from "@/features/item/services/item.service";
import { getCategories } from "@/features/category/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
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
    image: "",
    isActive: true,
    isFeatured: false,
    isSpicy: false,
    description: "",
  });

  const { data: itemResponse, isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems({ limit: 100 }),
  });

  const { data: catResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const items = itemResponse?.data || [];
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
      image: "",
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
      image: item.image || "",
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      isSpicy: item.isSpicy || false,
      description: item.description || "",
    });
    setIsEditOpen(true);
  };

  if (itemsLoading) return <div>Loading items...</div>;

  const FormContent = ({ onSubmit, isPending, buttonText, onCancel }: any) => (
      <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Price ($) <span className="text-red-500">*</span></label>
                <Input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Weight <span className="text-red-500">*</span></label>
                <Input required placeholder="e.g. 500g" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex items-center space-x-2">
                <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
                <label className="text-sm">Active</label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch checked={formData.isFeatured} onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })} />
                <label className="text-sm">Featured</label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch checked={formData.isSpicy} onCheckedChange={(c) => setFormData({ ...formData, isSpicy: c })} />
                <label className="text-sm text-red-500 font-bold">Spicy 🌶️</label>
            </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : buttonText}
            </Button>
        </div>
      </form>
  );

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
            <FormContent 
                onSubmit={handleCreateSubmit} 
                isPending={createMutation.isPending} 
                buttonText="Create Item"
                onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
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
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                       <td className="px-6 py-4">
                           {item.image ? (
                               <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border" />
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
                       <td className="px-6 py-4 text-right font-bold text-emerald-600">${item.price}</td>
                       <td className="px-6 py-4 text-center">
                          {item.isActive ? (
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                          ) : (
                             <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">Inactive</span>
                          )}
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
                                   if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                      deleteMutation.mutate(item.id);
                                   }
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <FormContent 
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
