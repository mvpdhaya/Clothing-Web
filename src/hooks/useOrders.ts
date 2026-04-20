import { Order } from '@/types/order';

export function useOrders() {
  const getOrders = () => [];
  const getOrderById = () => null;
  const placeOrder = (orderDetails: Partial<Order>) => {
    console.log('Placing order:', orderDetails);
    return { success: true };
  };

  return {
    getOrders,
    getOrderById,
    placeOrder
  };
}
