"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X, Minus, Trash2 } from "lucide-react";

interface CreateOrderFormProps {
  onSubmit: (data: any) => void;
  isPending: boolean;
  onCancel: () => void;
  items: any[];
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSubmit, isPending, onCancel, items }) => {
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    paymentStatus: "UNPAID",
    additionalInfo: "",
  });

  const [orderItems, setOrderItems] = useState<{ itemId: string; quantity: number }[]>([]);

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, { itemId: "", quantity: 1 }]);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, key: string, value: any) => {
    const updated = [...orderItems];
    (updated[index] as any)[key] = value;
    setOrderItems(updated);
  };

  const parseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Please add at least one item.");
      return;
    }
    if (orderItems.some(i => !i.itemId)) {
      toast.error("Please select an item for all rows.");
      return;
    }
    onSubmit({
      ...formData,
      paymentMethod: formData.paymentStatus === "PAID" ? "MANUAL" : "COD",
      orderItems
    });
  };

  return (
   <form onSubmit={parseSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
      <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
                  <Input required value={formData.shippingName} onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                  <Input type="email" required value={formData.shippingEmail} onChange={(e) => setFormData({ ...formData, shippingEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
                  <Input required value={formData.shippingPhone} onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                  <Input required value={formData.shippingCity} onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Postal Code <span className="text-red-500">*</span></label>
                  <Input required value={formData.shippingPostalCode} onChange={(e) => setFormData({ ...formData, shippingPostalCode: e.target.value })} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Payment <span className="text-red-500">*</span></label>
                  <Select value={formData.paymentStatus} onValueChange={(v) => setFormData({ ...formData, paymentStatus: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="UNPAID">Unpaid</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Street Address <span className="text-red-500">*</span></label>
                  <Input required value={formData.shippingAddress} onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Input value={formData.additionalInfo} onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })} />
              </div>
          </div>
      </div>

      <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg">Order Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOrderItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Product
              </Button>
          </div>
          
          <div className="space-y-3">
              {orderItems.map((oi, index) => (
                  <div key={index} className="flex gap-3 items-end  bg-slate-50 dark:bg-slate-900 border p-3 rounded-lg relative">
                      <div className="flex-1 space-y-2">
                          <label className="text-xs font-medium">Product Select</label>
                          <Select value={oi.itemId} onValueChange={(v) => updateOrderItem(index, "itemId", v)}>
                              <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select an item" />
                              </SelectTrigger>
                              <SelectContent>
                                  {items.map((it: any) => (
                                      <SelectItem key={it.id} value={it.id}>{it.name} - ৳{it.price}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="w-24 space-y-2">
                          <label className="text-xs font-medium">Quantity</label>
                          <Input 
                              type="number" 
                              min="1" 
                              required 
                              value={oi.quantity} 
                              onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value) || 1)} 
                              className="bg-background"
                          />
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-red-100 hover:text-red-700 h-10 w-10 shrink-0" onClick={() => handleRemoveOrderItem(index)}>
                          <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
              ))}
              {orderItems.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
                      No items added to the order yet.
                  </div>
              )}
          </div>
      </div>

      <div className="pt-4 flex justify-end gap-2 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Order"}
          </Button>
      </div>
    </form>
  )
}

export default CreateOrderForm