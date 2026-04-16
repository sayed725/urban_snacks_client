export interface ICategory {
  id: string;
  name: string;
  subName?: string | null;
  image?: string | null;
  isFeatured: boolean;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}

export interface ICategoryPayload {
  name: string;
  subName?: string;
  image?: string;
  isFeatured?: boolean;
  description?: string;
  isActive?: boolean;
}
