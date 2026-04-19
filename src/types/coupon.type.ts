export enum DiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export interface ICoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  expiryDate: string;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
  isActive?: boolean;
  description?: string;
}

export interface ICouponVerifyResult {
  coupon: ICoupon;
  discountAmount: number;
}

export interface IGetCouponsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  discountType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
