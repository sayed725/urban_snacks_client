"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import UsersLoadingSkeleton from "./_usersLoadingSkeleton";
import { getAllUsers, updateUserStatus } from "@/services/userAll.service";
import USPagination from "@/components/shared/USPagination";

export default function AdminUsers() {
  const queryClient = useQueryClient();

  // Filters and Pagination State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch, roleFilter, statusFilter, sortBy, sortOrder],
    queryFn: () => getAllUsers({ 
      limit: 10, 
      page, 
      searchTerm: debouncedSearch,
      role: roleFilter === "all" ? undefined : roleFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      sortBy,
      sortOrder
    }),
  });

  const users = response?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" | "BANNED" }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user status");
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status: status as "ACTIVE" | "INACTIVE" | "BANNED" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 font-bold border-none";
      case "INACTIVE": return "bg-gray-100 text-gray-700 font-bold border-none";
      case "BANNED": return "bg-red-100 text-red-700 font-bold border-none";
      default: return "";
    }
  };

  const meta = (response as any)?.meta;

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = search !== "" || roleFilter !== "all" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  if (isLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage user accounts and access</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by name, email..."
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
           <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
           </Select>

           <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
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
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
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
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-center">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                       <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                   {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                               </div>
                               <div>
                                   <div className="font-semibold">{user.name || "Unknown"}</div>
                                   <div className="text-xs text-muted-foreground">{user.email}</div>
                               </div>
                           </div>
                       </td>
                       <td className="px-6 py-4">
                           <Badge variant="outline" className={user.role === "ADMIN" ? "bg-primary text-white border-none" : ""}>
                               {user.role}
                           </Badge>
                       </td>
                       <td className="px-6 py-4 text-muted-foreground">
                           {new Date(user.createdAt).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 text-center">
                           <div className="flex justify-center">
                               {user.role === "ADMIN" ? (
                                   <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                               ) : (
                                   <Select 
                                       defaultValue={user.status} 
                                       onValueChange={(val) => handleStatusChange(user.id, val)}
                                       disabled={statusMutation.isPending}
                                   >
                                      <SelectTrigger className={`h-8 w-32 ${getStatusColor(user.status)} justify-center`}>
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                          <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                          <SelectItem value="BANNED">BANNED</SelectItem>
                                      </SelectContent>
                                   </Select>
                               )}
                           </div>
                       </td>
                    </tr>
                 ))}
                 {users.length === 0 && (
                    <tr>
                       <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                          No users found.
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
    </div>
  );
}
