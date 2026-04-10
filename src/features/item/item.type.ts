import { ICategory } from "../category/category.type";

export interface IItem {
  id: string;
  name: string;
  isFeatured: boolean;
  packSize?: number | null;
  isSpicy?: boolean | null;
  weight: string;
  price: number;
  expiryDate?: string | null;
  isActive: boolean;
  image?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Pick<ICategory, "id" | "name" | "subName">;
}

export interface IItemPayload {
  name: string;
  weight: string;
  price: number;
  categoryId: string;
  isFeatured?: boolean;
  packSize?: number;
  isSpicy?: boolean;
  expiryDate?: string;
  image?: string;
  description?: string;
  isActive?: boolean;
}

export interface IGetItemsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  search?: string; // Keep for backward compatibility if needed locally
  categoryId?: string;
  isFeatured?: boolean;
  isSpicy?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
