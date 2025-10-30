import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@shared/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  size?: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, opts?: { size?: string; qty?: number }) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "sable_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (p: Product, opts?: { size?: string; qty?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.id === p.id && it.size === opts?.size,
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
          qty: opts?.qty ?? 1,
        },
      ];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, add, remove, updateQty, clear, total, count }}
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
