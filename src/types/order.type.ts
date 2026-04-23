import { IReview } from "./review.type";
import { ICoupon } from "./coupon.type";


export enum OrderStatus {
  PLACED = "PLACED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export interface IOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  item: {
    id: string;
    name: string;
    price: number;
    mainImage?: string | null;
    category?: { id: string; name: string } | null;
    image?: string[] | null;
  };
}

export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  additionalInfo?: string | null;
  cancelReason?: string | null;
  deliveryCharge?: number;
  discountAmount?: number;
  couponId?: string | null;
  coupon?: ICoupon | null;
  createdAt: string;
  updatedAt: string;
  orderItems: IOrderItem[];
  reviews?: IReview[];
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  payment?: {
    id: string;
    amount: number;
    transactionId?: string | null;
    status: PaymentStatus;
    invoiceUrl?: string | null;
    createdAt: string;
  } | null;
}

export interface ICreateOrderPayload {
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentMethod: string;
  paymentStatus?: string;
  additionalInfo?: string;
  deliveryCharge?: number;
  couponCode?: string;
  orderItems: {
    itemId: string;
    quantity: number;
  }[];
}

export interface IGetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
