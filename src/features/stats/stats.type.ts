export interface IAdminStats {
  summary: {
    totalItems: number;
    totalOrders: number;
    totalPayments: number;
    totalRevenue: number;
    totalReviews: number;
  };
  orderStats: {
    byStatus: {
      PLACED: number;
      CANCELLED: number;
      PROCESSING: number;
      SHIPPED: number;
      DELIVERED: number;
    };
    byPaymentMethod: Record<string, number>;
  };
  mostOrderedItems: {
    name: string;
    count: number;
  }[];
  revenueData: {
    date: string;
    revenue: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  }[];
}
