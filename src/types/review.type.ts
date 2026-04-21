import { IUser } from "./user.type";

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  orderId: string;
  customerId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: Partial<IUser>;
  order?: any; // Add order if needed, but the main point is removing item
}

export interface ICreateReviewPayload {
  rating: number;
  comment: string;
  orderId: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
  isActive?: boolean;
}

export interface IGetReviewsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  customerId?: string;
  rating?: number;
  isActive?: boolean;
  itemId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
