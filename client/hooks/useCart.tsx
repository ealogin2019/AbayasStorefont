import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product, CartItemData } from "@shared/api";
import { api } from "@/lib/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  size?: string;
  qty: number;
  color?: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isLoading: boolean;
  customerId?: string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "sable_cart_v1";
const CUSTOMER_ID_KEY = "sable_customer_id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize customer ID from localStorage or session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_ID_KEY);
      if (stored) {
        setCustomerId(stored);
      } else {
        // Generate a temporary guest ID
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(CUSTOMER_ID_KEY, guestId);
        setCustomerId(guestId);
      }
    } catch {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setCustomerId(guestId);
    }
  }, []);

  // Load cart from API or localStorage on initialization
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadCart = async () => {
      setIsLoading(true);
      try {
        // Try to load from API
        const response = await api.getCart(customerId);
        const formattedItems: CartItem[] = (response.items || []).map((item: CartItemData & { product?: any }) => ({
          id: item.id,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          currency: item.product?.currency || "AED",
          image: item.product?.thumbnail || item.product?.image,
          size: item.size,
          color: item.color,
          qty: item.quantity,
        }));
        setItems(formattedItems);
      } catch (error) {
        // Fallback to localStorage if API fails
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
        } catch {
          setItems([]);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadCart();
  }, [customerId, isInitialized]);

  // Sync to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = async (p: Product, opts?: { size?: string; color?: string; qty?: number }) => {
    if (!customerId) return;

    try {
      // Optimistically update UI
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (it) => it.id === p.id && it.size === opts?.size && it.color === opts?.color,
        );
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex].qty += opts?.qty ?? 1;
          return next;
        }
        return [
          ...prev,
          {
            id: p.id,
            name: p.name,
            price: p.price,
            currency: p.currency,
            image: p.thumbnail ?? p.image,
            size: opts?.size,
            color: opts?.color,
            qty: opts?.qty ?? 1,
          },
        ];
      });

      // Sync with API
      await api.addToCart({
        customerId,
        productId: p.id,
        quantity: opts?.qty ?? 1,
        size: opts?.size,
        color: opts?.color,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Revert optimistic update on error
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    }
  };

  const remove = async (id: string) => {
    try {
      // Optimistically update
      setItems((prev) => prev.filter((p) => p.id !== id));

      // Sync with API
      await api.removeFromCart(id);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      // Revert on error
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    }
  };

  const updateQty = async (id: string, qty: number) => {
    if (qty <= 0) {
      await remove(id);
      return;
    }

    try {
      // Optimistically update
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));

      // Sync with API
      await api.updateCartItem(id, { quantity: qty });
    } catch (error) {
      console.error("Failed to update cart item:", error);
      // Revert on error
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    }
  };

  const clear = async () => {
    if (!customerId) return;

    try {
      setItems([]);
      await api.clearCart(customerId);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      // Reload cart on error
      try {
        const response = await api.getCart(customerId);
        const formattedItems: CartItem[] = (response.items || []).map((item: CartItemData & { product?: any }) => ({
          id: item.id,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          currency: item.product?.currency || "AED",
          image: item.product?.thumbnail || item.product?.image,
          size: item.size,
          color: item.color,
          qty: item.quantity,
        }));
        setItems(formattedItems);
      } catch {}
    }
  };

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, add, remove, updateQty, clear, total, count, isLoading, customerId }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
