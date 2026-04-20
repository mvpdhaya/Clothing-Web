import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mock';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => void;
  removeFromCart: (productId: string, size: string, hex: string) => void;
  updateCartQuantity: (productId: string, size: string, hex: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, quantity, size, color) => {
        set((state) => {
          const idx = state.cart.findIndex(
            (i) => i.product.id === product.id && i.selectedSize === size && i.selectedColor.hex === color.hex
          );
          if (idx > -1) {
            const next = [...state.cart];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            return { cart: next };
          }
          return { cart: [...state.cart, { product, quantity, selectedSize: size, selectedColor: color }] };
        });
      },
      removeFromCart: (productId, size, hex) => {
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor.hex === hex)
          ),
        }));
      },
      updateCartQuantity: (productId, size, hex, delta) => {
        set((state) => ({
          cart: state.cart.map((i) =>
            i.product.id === productId && i.selectedSize === size && i.selectedColor.hex === hex
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'vogue-cart-storage',
    }
  )
);
