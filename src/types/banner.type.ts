export interface IBanner {
  id: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  order?: number;
  banner: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBannerPayload {
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  order?: number;
  banner?: boolean;
  isActive?: boolean;
}
