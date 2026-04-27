"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, updateReviewStatus, deleteReview } from "@/services/review.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Star, XCircle, MessageSquare, User, Package, Eye, Calendar, Filter, Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
import ReviewsLoadingSkeleton from "./_reviewsLoadingSkeleton";
import { cn } from "@/lib/utils";
import moment from "moment";
import USPagination from "@/components/shared/USPagination";

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["reviews", page, debouncedSearch, ratingFilter, statusFilter, sortBy, sortOrder],
    queryFn: () => getReviews({
      limit: 10,
      page,
      searchTerm: debouncedSearch,
      rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      sortBy,
      sortOrder
    }),
  });

  const getReviewStatusColor = (isActive: boolean) => {
    return isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  };

  const reviews = response?.data || [];
  const meta = response?.meta;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateReviewStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update review status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const resetFilters = () => {
    setSearch("");
    setRatingFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || ratingFilter !== "all" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  if (isLoading) return <ReviewsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">User Reviews</h1>
          <p className="text-muted-foreground text-sm">Monitor and manage customer feedback</p>
        </div>
      </div>

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews by customer or order..."
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
                  <SheetDescription className="sr-only">Filter and sort user reviews table</SheetDescription>
                  
                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Rating Star</h3>
                    <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Ratings</SelectItem>
                        {[5, 4, 3, 2, 1].map((r) => (
                          <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Review Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
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
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort Reviews</h3>
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
                        <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                        <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
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
            <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
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
                <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4 text-center">Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review: any) => (
                <tr key={review.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{review.customer?.name}</div>
                        <div className="text-xs text-muted-foreground">{review.customer?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Package className="w-4 h-4 text-muted-foreground" />
                       <span className="font-medium text-xs">{review.order?.orderNumber || review.orderId.split('-')[0]}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {moment(review.createdAt).format("MMM DD, YYYY")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 overflow-hidden max-w-[300px]">
                    <p className="truncate text-muted-foreground italic" title={review.comment}>
                      "{review.comment}"
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch
                      checked={review.isActive}
                      onCheckedChange={(checked) => {
                        toggleStatusMutation.mutate({ id: review.id, isActive: checked });
                      }}
                      disabled={toggleStatusMutation.isPending}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive border-red-200 hover:bg-red-50 hover:text-destructive h-8 w-8"
                      onClick={() => {
                        toast.error("Confirm Deletion", {
                          description: "Are you sure you want to delete this review?",
                          action: {
                            label: "Delete",
                            onClick: () => deleteMutation.mutate(review.id)
                          },
                          cancel: {
                             label: "Cancel",
                             onClick: () => {}
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
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 opacity-20" />
                      <p>No reviews found matching your criteria.</p>
                    </div>
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

      {/* Review Details Modal - Styled like Order Details */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details - {selectedReview?.order?.orderNumber}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
             
          </DialogDescription>
            
          {selectedReview && (
            <div className="space-y-6 mt-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                      <p className="font-semibold text-muted-foreground border-b pb-1 mb-2">Customer Details</p>
                      <p><span className="font-medium">Name:</span> {selectedReview.customer?.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedReview.customer?.email}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="font-semibold text-muted-foreground border-b pb-1 mb-2">Review Info</p>
                      <div className="flex items-center gap-1 mb-1">
                         <span className="font-medium mr-1">Rating:</span>
                         <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-3.5 h-3.5",
                                  star <= selectedReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                         </div>
                      </div>
                      <p><span className="font-medium">Status:</span> <Badge variant="outline" className={cn("ml-1 h-5 text-[10px] font-bold uppercase", getReviewStatusColor(selectedReview.isActive))}>{selectedReview.isActive ? "Active" : "Inactive"}</Badge></p>
                      <p><span className="font-medium">Date:</span> {moment(selectedReview.createdAt).format("MMM DD, YYYY")}</p>
                  </div>
               </div>

               <div>
                   <p className="font-semibold text-muted-foreground border-b pb-1 mb-3 text-sm">Customer's Comment</p>
                   {selectedReview.comment ? (
                     <div className="bg-muted p-3 rounded-md italic text-sm border-l-4 border-primary/30">
                        "{selectedReview.comment}"
                     </div>
                   ) : (
                     <p className="text-sm text-muted-foreground italic">No comment provided.</p>
                   )}
               </div>

               {/* <div>
                   <p className="font-semibold text-muted-foreground border-b pb-1 mb-3 text-sm">Associated Order</p>
                   <div className="bg-muted/30 p-3 rounded-lg border flex justify-between items-center">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-secondary rounded-md border flex items-center justify-center">
                               <Package className="w-5 h-5 text-secondary-foreground" />
                           </div>
                           <div>
                               <p className="font-medium text-sm">Order #{selectedReview.order?.orderNumber || selectedReview.orderId.split('-')[0]}</p>
                               <p className="text-xs text-muted-foreground">Placed on {moment(selectedReview.order?.createdAt).format("MMM DD, YYYY")}</p>
                           </div>
                       </div>
                       <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-semibold"
                        onClick={() => window.open(`/dashboard/admin/orders/${selectedReview.orderId}`, '_blank')}
                      >
                           View full order
                       </Button>
                   </div>
               </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}