"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, changeOrderStatus, deleteOrder, createOrder } from "@/features/order/services/order.service";
import { getItems } from "@/features/item/services/item.service";
import { OrderStatus } from "@/features/order/order.type";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Plus, X, Minus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CreateOrderForm = ({ onSubmit, isPending, onCancel, items }: any) => {
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    paymentMethod: "COD",
    additionalInfo: "",
  });

  const [orderItems, setOrderItems] = useState<{itemId: string, quantity: number}[]>([]);

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
    if(orderItems.length === 0) {
      toast.error("Please add at least one item.");
      return;
    }
    if (orderItems.some(i => !i.itemId)) {
      toast.error("Please select an item for all rows.");
      return;
    }
    onSubmit({
      ...formData,
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
                  <label className="text-sm font-medium">Payment Method <span className="text-red-500">*</span></label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                          <SelectItem value="STRIPE">Stripe</SelectItem>
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
                  <div key={index} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-900 border p-3 rounded-lg relative">
                      <div className="flex-1 space-y-2">
                          <label className="text-xs font-medium">Product Select</label>
                          <Select value={oi.itemId} onValueChange={(v) => updateOrderItem(index, "itemId", v)}>
                              <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select an item" />
                              </SelectTrigger>
                              <SelectContent>
                                  {items.map((it: any) => (
                                      <SelectItem key={it.id} value={it.id}>{it.name} - ${it.price}</SelectItem>
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

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAllOrders({ limit: 100 }),
  });

  const { data: itemsResponse } = useQuery({
    queryKey: ["items-for-orders"],
    queryFn: () => getItems({ limit: 200 }),
  });

  const orders = response?.data || [];
  const items = itemsResponse?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => changeOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    },
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order created successfully");
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const handleCreateSubmit = (payload: any) => {
    createMutation.mutate(payload);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    statusMutation.mutate({ id: orderId, status: newStatus as OrderStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-gray-100 text-gray-700";
      case "PROCESSING": return "bg-blue-100 text-blue-700";
      case "SHIPPED": return "bg-purple-100 text-purple-700";
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    return status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground text-sm">Track and fulfill customer orders</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-secondary font-semibold hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Manual Order</DialogTitle>
            </DialogHeader>
            {isCreateOpen && (
               <CreateOrderForm 
                   items={items}
                   onSubmit={handleCreateSubmit}
                   isPending={createMutation.isPending}
                   onCancel={() => setIsCreateOpen(false)}
               />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="bg-secondary text-secondary-foreground text-xs uppercase">
                 <tr>
                    <th className="px-6 py-4">Order Number</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-center">Payment</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                       <td className="px-6 py-4">
                           <div className="font-semibold">{order.orderNumber}</div>
                           <div className="text-xs text-muted-foreground">
                             {new Date(order.createdAt).toLocaleDateString()}
                           </div>
                       </td>
                       <td className="px-6 py-4">
                           <div className="font-medium">{order.shippingName}</div>
                           <div className="text-xs text-muted-foreground">{order.shippingPhone}</div>
                       </td>
                       <td className="px-6 py-4 text-right font-bold text-emerald-600">
                           ${order.totalAmount}
                       </td>
                       <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentColor(order.paymentStatus)}`}>
                             {order.paymentStatus}
                           </span>
                           <div className="text-[10px] text-muted-foreground mt-1 uppercase">{order.paymentMethod}</div>
                       </td>
                       <td className="px-6 py-4">
                           <div className="flex justify-center">
                               <Select 
                                   defaultValue={order.status} 
                                   onValueChange={(val) => handleStatusChange(order.id, val)}
                                   disabled={statusMutation.isPending || order.status === "DELIVERED" || order.status === "CANCELLED"}
                               >
                                  <SelectTrigger className={`h-8 w-32 border-none font-bold justify-center ${getStatusColor(order.status)}`}>
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="PLACED">Placed</SelectItem>
                                      <SelectItem value="PROCESSING">Processing</SelectItem>
                                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                  </SelectContent>
                               </Select>
                           </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <Button variant="outline" size="icon" onClick={() => setSelectedOrder(order)}>
                                <Eye className="w-4 h-4" />
                             </Button>
                             <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                                onClick={() => {
                          toast.error("Confirm Deletion", {
                            description: `Are you sure you want to delete order ${order.orderNumber}?`,
                            action: {
                              label: "Delete",
                              onClick: () => deleteMutation.mutate(order.id),
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
                 {orders.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          No orders found.
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                      <p className="font-semibold text-muted-foreground border-b pb-1 mb-2">Shipping Details</p>
                      <p><span className="font-medium">Name:</span> {selectedOrder.shippingName}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shippingPhone}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.shippingEmail}</p>
                      <p><span className="font-medium">Address:</span> {selectedOrder.shippingAddress}</p>
                      <p><span className="font-medium">City:</span> {selectedOrder.shippingCity}</p>
                      <p><span className="font-medium">ZIP/Postal:</span> {selectedOrder.shippingPostalCode}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="font-semibold text-muted-foreground border-b pb-1 mb-2">Payment Info</p>
                      <p><span className="font-medium">Method:</span> {selectedOrder.paymentMethod}</p>
                      <p><span className="font-medium">Status:</span> <Badge variant="outline" className={getPaymentColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge></p>
                      <p><span className="font-medium">Total:</span> <span className="font-bold text-emerald-600">${selectedOrder.totalAmount}</span></p>
                      {selectedOrder.additionalInfo && (
                        <div className="mt-4">
                            <p className="font-semibold text-muted-foreground">Notes:</p>
                            <p className="bg-muted p-2 rounded-md italic">{selectedOrder.additionalInfo}</p>
                        </div>
                      )}
                  </div>
               </div>

               <div>
                   <p className="font-semibold text-muted-foreground border-b pb-1 mb-3 text-sm">Ordered Items</p>
                   <div className="space-y-3">
                       {selectedOrder.orderItems?.map((oi: any) => (
                           <div key={oi.id} className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border">
                               <div className="flex items-center gap-3">
                                   {oi.item?.image ? (
                                       <img src={oi.item.image} alt={oi.item.name} className="w-10 h-10 object-cover rounded-md border" />
                                   ) : (
                                       <div className="w-10 h-10 bg-muted rounded-md border" />
                                   )}
                                   <div>
                                       <p className="font-medium text-sm">{oi.item?.name}</p>
                                       <p className="text-xs text-muted-foreground">${oi.unitPrice} x {oi.quantity}</p>
                                   </div>
                               </div>
                               <div className="font-bold text-sm">
                                   ${oi.subTotal}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
