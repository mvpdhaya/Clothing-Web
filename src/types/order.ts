export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: { productId: string; quantity: number; size: string; color: string }[];
  trackingId?: string;
  addressId: string;
  paymentMethod: string;
}
