export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  reviews: number;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  material?: string;
  fit?: string;
}
