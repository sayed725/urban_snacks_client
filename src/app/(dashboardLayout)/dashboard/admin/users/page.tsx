"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUserStatus } from "@/features/user/services/user.service";
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

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
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

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage user accounts and access</p>
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
    </div>
  );
}
