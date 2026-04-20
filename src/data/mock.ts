// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

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

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  cta: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: 'Men',
    label: 'Men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
  },
  {
    id: 'Women',
    label: 'Women',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa30e849b0?w=600&q=80',
  },
  {
    id: 'Kids',
    label: 'Kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
  },
  {
    id: 'Sale',
    label: 'Sale',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  },
];

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic White Oxford',
    price: 1800,
    description:
      'A timeless classic white oxford shirt crafted from 100% premium Egyptian cotton. Perfect for business or casual settings.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#BFDBFE' },
    ],
    reviews: 45,
    rating: 4.5,
    material: '100% Egyptian Cotton',
    fit: 'Regular Fit',
  },
  {
    id: '2',
    name: 'Slim Fit Dark Jeans',
    price: 3200,
    oldPrice: 4500,
    description:
      'Modern slim-fit jeans in premium stretch denim. Feature a 5-pocket design and are perfect for any day.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Dark Navy', hex: '#1E3A5F' },
      { name: 'Charcoal', hex: '#374151' },
    ],
    reviews: 120,
    rating: 4.8,
    isSale: true,
    material: '98% Cotton, 2% Elastane',
    fit: 'Slim Fit',
  },
  {
    id: '3',
    name: 'Premium Linen Shirt',
    price: 2600,
    description:
      'Breathable linen shirt for warm weather. A wardrobe essential in a relaxed silhouette.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Sage', hex: '#86EFAC' },
      { name: 'Cream', hex: '#FEF9C3' },
    ],
    reviews: 32,
    rating: 4.3,
    isNew: true,
    material: '100% French Linen',
    fit: 'Relaxed Fit',
  },
  {
    id: '4',
    name: 'Elegant Wrap Blouse',
    price: 1900,
    description:
      'Flowing wrap blouse in premium crepe fabric with a flattering silhouette.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1564257577-5a3278e32e91?w=800&q=80',
      'https://images.unsplash.com/photo-1583846712773-1e9a8e5bd36d?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blush', hex: '#FCA5A5' },
      { name: 'Ivory', hex: '#FFFBEB' },
    ],
    reviews: 28,
    rating: 4.6,
    material: '100% Crepe',
    fit: 'Wrap Fit',
  },
  {
    id: '5',
    name: 'Floral Midi Dress',
    price: 3400,
    oldPrice: 4200,
    description:
      'Romantic floral midi dress with puff sleeves and a fitted bodice. Perfect for garden parties.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4b45?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Floral Rose', hex: '#F9A8D4' },
      { name: 'Garden Green', hex: '#86EFAC' },
    ],
    reviews: 54,
    rating: 4.7,
    isSale: true,
    material: 'Woven Chiffon',
    fit: 'Regular Fit',
  },
  {
    id: '6',
    name: 'Luxury Cashmere Knit',
    price: 4800,
    description:
      'Ultra-soft cashmere knit sweater in a relaxed silhouette. Winter luxury at its finest.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Camel', hex: '#D97706' },
      { name: 'Cream', hex: '#FEF9C3' },
    ],
    reviews: 15,
    rating: 4.2,
    isNew: true,
    material: '100% Cashmere',
    fit: 'Relaxed Fit',
  },
  {
    id: '7',
    name: 'Classic Denim Jacket',
    price: 4100,
    oldPrice: 5200,
    description:
      'Iconic denim jacket in premium washed denim. A forever classic that elevates any outfit.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Blue Wash', hex: '#3B82F6' },
      { name: 'Black', hex: '#111827' },
    ],
    reviews: 88,
    rating: 4.9,
    isSale: true,
    material: '100% Cotton Denim',
    fit: 'Regular Fit',
  },
  {
    id: '8',
    name: 'Tailored Linen Blazer',
    price: 5800,
    description:
      'A perfectly tailored linen blazer for semi-formal occasions. Structured yet breathable.',
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377ea53d45?w=800&q=80',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Slate', hex: '#475569' },
      { name: 'Navy', hex: '#1E3A8A' },
    ],
    reviews: 42,
    rating: 4.4,
    material: '100% Italian Linen',
    fit: 'Tailored Fit',
  },
  {
    id: '9',
    name: 'High-Waist Trousers',
    price: 2900,
    description:
      'Sleek high-waist trousers with pressed pleats. The cornerstone of a capsule wardrobe.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4b45?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Ivory', hex: '#FFFBEB' },
    ],
    reviews: 36,
    rating: 4.5,
    isNew: true,
    material: 'Wool Blend',
    fit: 'Tailored Fit',
  },
  {
    id: '10',
    name: 'Kids Cotton Tee',
    price: 799,
    description:
      'Soft and comfortable cotton tee for kids. Available in fun colors, perfect for everyday wear.',
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
      'https://images.unsplash.com/photo-1543060507-0a7dfda5a50d?w=800&q=80',
    ],
    sizes: ['2Y', '4Y', '6Y', '8Y', '10Y'],
    colors: [
      { name: 'Yellow', hex: '#FDE68A' },
      { name: 'Sky Blue', hex: '#BAE6FD' },
    ],
    reviews: 60,
    rating: 4.6,
    isNew: true,
    material: '100% Organic Cotton',
    fit: 'Regular Fit',
  },
  {
    id: '11',
    name: 'Kids Denim Dungaree',
    price: 1499,
    oldPrice: 1999,
    description:
      'Adorable denim dungaree for kids with adjustable straps and soft inner lining.',
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf0?w=800&q=80',
      'https://images.unsplash.com/photo-1543060507-0a7dfda5a50d?w=800&q=80',
    ],
    sizes: ['2Y', '4Y', '6Y', '8Y'],
    colors: [
      { name: 'Blue Denim', hex: '#3B82F6' },
      { name: 'Black', hex: '#111827' },
    ],
    reviews: 44,
    rating: 4.7,
    isSale: true,
    material: '100% Cotton Denim',
    fit: 'Regular Fit',
  },
  {
    id: '12',
    name: 'Women Summer Co-ord Set',
    price: 3800,
    oldPrice: 4800,
    description:
      'Trendy co-ord set with a cropped top and wide-leg pants. Ideal for brunches and casual outings.',
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Terracotta', hex: '#C2410C' },
      { name: 'Mint', hex: '#6EE7B7' },
    ],
    reviews: 72,
    rating: 4.8,
    isSale: true,
    material: 'Linen Blend',
    fit: 'Relaxed Fit',
  },
];

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

export const MOCK_USER: User = {
  id: 'user_01',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 9876543210',
  avatar: 'https://i.pravatar.cc/150?img=3',
};

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr_01',
    label: 'Home',
    name: 'Rahul Sharma',
    line1: '42, MG Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 9876543210',
    isDefault: true,
  },
  {
    id: 'addr_02',
    label: 'Office',
    name: 'Rahul Sharma',
    line1: '15, Whitefield Tech Park, Block B',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    phone: '+91 9876543210',
    isDefault: false,
  },
];

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

export const ORDERS: Order[] = [
  {
    id: '#ORD-20240412',
    date: '12 Apr 2025',
    total: 6800,
    status: 'Shipped',
    items: [
      { productId: '2', quantity: 1, size: '32', color: 'Dark Navy' },
      { productId: '1', quantity: 1, size: 'M', color: 'White' },
    ],
    trackingId: 'DTDC9876543210',
    addressId: 'addr_01',
    paymentMethod: 'UPI',
  },
  {
    id: '#ORD-20240318',
    date: '18 Mar 2025',
    total: 2600,
    status: 'Delivered',
    items: [
      { productId: '3', quantity: 1, size: 'L', color: 'Sage' },
    ],
    trackingId: 'BLUEDART123456',
    addressId: 'addr_01',
    paymentMethod: 'Credit Card',
  },
  {
    id: '#ORD-20240210',
    date: '10 Feb 2025',
    total: 7500,
    status: 'Delivered',
    items: [
      { productId: '7', quantity: 1, size: 'L', color: 'Blue Wash' },
      { productId: '4', quantity: 1, size: 'S', color: 'Blush' },
    ],
    trackingId: 'ECOM556677889',
    addressId: 'addr_02',
    paymentMethod: 'Net Banking',
  },
  {
    id: '#ORD-20240501',
    date: '01 May 2025',
    total: 3800,
    status: 'Confirmed',
    items: [
      { productId: '12', quantity: 1, size: 'M', color: 'Terracotta' },
    ],
    trackingId: undefined,
    addressId: 'addr_01',
    paymentMethod: 'UPI',
  },
];

// ─────────────────────────────────────────────
// BANNERS (Homepage Hero)
// ─────────────────────────────────────────────

export const BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'New Summer Collection',
    subtitle: 'Up to 40% off on selected styles',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=80',
    link: '/products?category=Sale',
    cta: 'Shop Now',
  },
  {
    id: 'b2',
    title: 'Premium Linen Edit',
    subtitle: 'Breathable styles for warm days',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
    link: '/category/Men',
    cta: 'Explore',
  },
  {
    id: 'b3',
    title: 'Women\'s New Arrivals',
    subtitle: 'Fresh styles just dropped',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    link: '/category/Women',
    cta: 'Shop Women',
  },
];

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    user: 'Priya M.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    comment: 'Amazing quality, fits perfectly! The fabric feels premium and the stitching is flawless.',
    date: '10 Mar 2025',
  },
  {
    id: 'r2',
    productId: '1',
    user: 'Karan T.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    comment: 'Great shirt for the price. Would have liked more color options.',
    date: '22 Mar 2025',
  },
  {
    id: 'r3',
    productId: '2',
    user: 'Arjun K.',
    avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    comment: 'Best jeans I have bought in a while. The stretch fabric makes it very comfortable.',
    date: '02 Apr 2025',
  },
  {
    id: 'r4',
    productId: '5',
    user: 'Sneha R.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    comment: 'Absolutely love this dress! Perfect for summer events.',
    date: '15 Apr 2025',
  },
  {
    id: 'r5',
    productId: '7',
    user: 'Vikram S.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 5,
    comment: 'Classic jacket, great quality denim. Gets better with every wash.',
    date: '28 Feb 2025',
  },
  {
    id: 'r6',
    productId: '12',
    user: 'Ananya P.',
    avatar: 'https://i.pravatar.cc/150?img=20',
    rating: 4,
    comment: 'Trendy co-ord set, the fabric is light and breathable. Delivery was quick too!',
    date: '05 May 2025',
  },
];
