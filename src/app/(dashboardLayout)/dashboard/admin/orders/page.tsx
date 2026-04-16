"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import { Button } from "@/components/ui/button";
import { Eye, Trash2, Plus, X, Minus, XCircle } from "lucide-react";
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
import moment from "moment";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import OrdersLoadingSkeleton from "./_ordersLoadingSkeleton";
import CreateOrderForm from "@/components/modules/admin/orders/CreateOrderForm";
import { getItems } from "@/services/item.service";
import { OrderStatus } from "@/types/order.type";
import { createOrder, getAllOrders, deleteOrder, changeOrderStatus } from "@/services/order.service";



export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filters and Pagination State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders", page, debouncedSearch, statusFilter, paymentMethodFilter, paymentStatusFilter, sortBy, sortOrder],
    queryFn: () => getAllOrders({ 
      limit: 10, 
      page, 
      searchTerm: debouncedSearch,
      status: statusFilter === "all" ? undefined : statusFilter,
      paymentMethod: paymentMethodFilter === "all" ? undefined : paymentMethodFilter,
      paymentStatus: paymentStatusFilter === "all" ? undefined : paymentStatusFilter,
      sortBy,
      sortOrder
    }),
  });

  const { data: itemsResponse } = useQuery({
    queryKey: ["items-for-orders"],
    queryFn: () => getItems({ limit: 200 }),
  });

  const orders = response?.data || [];
  const meta = (response as any)?.meta;
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

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setPaymentStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || statusFilter !== "all" || paymentMethodFilter !== "all" || paymentStatusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  if (isLoading) return <OrdersLoadingSkeleton />;

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

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by order number, customer name,phone number..."
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
           <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PLACED">Placed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
           </Select>

           <Select value={paymentMethodFilter} onValueChange={(v) => { setPaymentMethodFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
              </SelectContent>
           </Select>

           <Select value={paymentStatusFilter} onValueChange={(v) => { setPaymentStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
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
                <SelectItem value="totalAmount-desc">Price: High to Low</SelectItem>
                <SelectItem value="totalAmount-asc">Price: Low to High</SelectItem>
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
                             {moment(order.createdAt).fromNow()}
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
