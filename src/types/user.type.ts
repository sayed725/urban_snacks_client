export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

export interface IGetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
