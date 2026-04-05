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
