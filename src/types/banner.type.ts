export interface IBanner {
  id: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  order?: number;
  banner: boolean;
  isActive: boolean;
  categoryId?: string;
  buttonText?: string;
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
  categoryId?: string;
  buttonText?: string;
}
