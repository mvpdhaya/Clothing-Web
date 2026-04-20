import { useCartStore } from '@/store/cartStore';

export function useCart() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartTotal,
    cartCount
  } = useCartStore();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    total: cartTotal(),
    count: cartCount()
  };
}
