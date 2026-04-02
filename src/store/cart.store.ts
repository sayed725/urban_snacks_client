import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface IItem {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  image?: string | null;
}

export interface CartItem extends IItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: IItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id,
        );

        if (existingItem) {
          if (existingItem.quantity + quantity > product.stockQuantity) {
            toast.error("Cannot add more than available stock");
            return;
          }
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
          toast.success("Cart updated");
        } else {
          if (quantity > product.stockQuantity) {
            toast.error("Cannot add more than available stock");
            return;
          }
          set({ items: [...currentItems, { ...product, quantity }] });
          toast.success("Added to cart");
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
        toast.success("Removed from cart");
      },
      updateQuantity: (itemId, quantity) => {
        const item = get().items.find((i) => i.id === itemId);
        if (item && quantity > item.stockQuantity) {
          toast.error("Cannot exceed available stock");
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "urban-snacks-cart",
    },
  ),
);
