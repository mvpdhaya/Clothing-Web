
// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: 'Clothing' | 'Accessories' | 'Flash Sale';
  subcategory: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isSale?: boolean;
  isFlashSale?: boolean;
  flashSaleEnds?: string; // ISO date string
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


export interface CategoryNav {
  id: string;
  label: string;
  subcategories: { id: string; label: string }[];
  image: string;
}

// ─────────────────────────────────────────────
// NAVIGATION CATEGORIES
// ─────────────────────────────────────────────

export const CATEGORY_NAV: CategoryNav[] = [
  {
    id: 'Clothing',
    label: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
    subcategories: [
      { id: 'All Clothing',  label: 'All Clothing' },
      { id: 'Shirts',        label: 'Shirts' },
      { id: 'T-Shirts',      label: 'T-Shirts' },
      { id: 'Pants',         label: 'Pants' },
      { id: 'Jeans',         label: 'Jeans' },
    ],
  },
  {
    id: 'Accessories',
    label: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    subcategories: [
      { id: 'All Accessories', label: 'All Accessories' },
      { id: 'Belts',           label: 'Belts' },
      { id: 'Watches',         label: 'Watches' },
      { id: 'Wallets',         label: 'Wallets' },
      { id: 'Sunglasses',      label: 'Sunglasses' },
    ],
  },
  {
    id: 'Flash Sale',
    label: 'Flash Sale',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    subcategories: [],
  },
  {
    id: 'Dummy',
    label: 'DUMMY',
    image: '/dummy-category.png',
    subcategories: [],
  },
];

// ─────────────────────────────────────────────
// PRODUCTS — CLOTHING > SHIRTS
// ─────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: 'c-sh-01',
    name: 'Classic White Oxford Shirt',
    price: 1800,
    description: 'A timeless classic white oxford shirt crafted from 100% premium Egyptian cotton. Perfect for business or casual settings.',
    category: 'Clothing',
    subcategory: 'Shirts',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#BFDBFE' },
    ],
    
    isNew: true,
    material: '100% Egyptian Cotton', fit: 'Regular Fit',
  },
  {
    id: 'c-sh-02',
    name: 'Premium Linen Shirt',
    price: 2600,
    description: 'Breathable linen shirt for warm weather. A wardrobe essential in a relaxed silhouette.',
    category: 'Clothing',
    subcategory: 'Shirts',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage', hex: '#86EFAC' },
      { name: 'Cream', hex: '#FEF9C3' },
    ],
    
    isNew: true,
    material: '100% French Linen', fit: 'Relaxed Fit',
  },
  {
    id: 'c-sh-03',
    name: 'Tailored Linen Blazer Shirt',
    price: 3200,
    oldPrice: 4200,
    description: 'A refined shirt-blazer hybrid in premium Italian linen. Transitions from office to evening effortlessly.',
    category: 'Clothing',
    subcategory: 'Shirts',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377ea53d45?w=800&q=80',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate', hex: '#475569' },
      { name: 'Navy', hex: '#1E3A8A' },
    ],
    
    isSale: true,
    material: '100% Italian Linen', fit: 'Tailored Fit',
  },

  // ─── CLOTHING > T-SHIRTS ───
  {
    id: 'c-ts-01',
    name: 'Essential Cotton Crew Tee',
    price: 899,
    description: 'The perfect everyday tee. Crafted from ring-spun cotton for a smooth, comfortable feel all day long.',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#111827' },
      { name: 'Grey', hex: '#9CA3AF' },
    ],
    
    isNew: true,
    material: '100% Ring-Spun Cotton', fit: 'Regular Fit',
  },
  {
    id: 'c-ts-02',
    name: 'Graphic Print Oversized Tee',
    price: 1299,
    oldPrice: 1799,
    description: 'Bold graphic print on a relaxed oversized silhouette. A streetwear staple made from heavyweight cotton.',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Black', hex: '#1F2937' },
      { name: 'Vintage White', hex: '#F9F5F0' },
    ],
    
    isSale: true,
    material: '280gsm Heavyweight Cotton', fit: 'Oversized Fit',
  },
  {
    id: 'c-ts-03',
    name: 'Premium Pima Cotton V-Neck',
    price: 1100,
    description: 'Luxuriously soft Pima cotton V-neck that drapes beautifully. Ideal for layering or wearing solo.',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Forest', hex: '#166534' },
      { name: 'Burgundy', hex: '#7F1D1D' },
    ],
    
    material: '100% Pima Cotton', fit: 'Slim Fit',
  },

  // ─── CLOTHING > PANTS ───
  {
    id: 'c-pt-01',
    name: 'High-Waist Tailored Trousers',
    price: 2900,
    description: 'Sleek high-waist trousers with pressed pleats. The cornerstone of a capsule wardrobe.',
    category: 'Clothing',
    subcategory: 'Pants',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4b45?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Ivory', hex: '#FFFBEB' },
      { name: 'Camel', hex: '#D97706' },
    ],
    
    isNew: true,
    material: 'Wool Blend', fit: 'Tailored Fit',
  },
  {
    id: 'c-pt-02',
    name: 'Relaxed Linen Drawstring Pants',
    price: 2200,
    oldPrice: 2900,
    description: 'Easy-fit linen pants with an elastic drawstring waist. Summer comfort meets minimal style.',
    category: 'Clothing',
    subcategory: 'Pants',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand', hex: '#D2B48C' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Olive', hex: '#6B7C4D' },
    ],
    
    isSale: true,
    material: '100% Linen', fit: 'Relaxed Fit',
  },
  {
    id: 'c-pt-03',
    name: 'Slim Chino Pants',
    price: 1999,
    description: 'Classic slim-cut chinos in a soft cotton-stretch blend. Versatile enough for work or weekend.',
    category: 'Clothing',
    subcategory: 'Pants',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Khaki', hex: '#C3A882' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Black', hex: '#111827' },
    ],
    
    material: '97% Cotton, 3% Elastane', fit: 'Slim Fit',
  },

  // ─── CLOTHING > JEANS ───
  {
    id: 'c-jn-01',
    name: 'Slim Fit Dark Jeans',
    price: 3200,
    oldPrice: 4500,
    description: 'Modern slim-fit jeans in premium stretch denim. Feature a 5-pocket design and are perfect for any day.',
    category: 'Clothing',
    subcategory: 'Jeans',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Dark Navy', hex: '#1E3A5F' },
      { name: 'Charcoal', hex: '#374151' },
    ],
    
    isSale: true,
    material: '98% Cotton, 2% Elastane', fit: 'Slim Fit',
  },
  {
    id: 'c-jn-02',
    name: 'Classic Straight Leg Jeans',
    price: 2800,
    description: 'The forever classic straight-leg jean in rigid selvedge denim. Gets better with every wear.',
    category: 'Clothing',
    subcategory: 'Jeans',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Indigo', hex: '#3730A3' },
      { name: 'Light Wash', hex: '#93C5FD' },
    ],
    
    isNew: true,
    material: '100% Selvedge Denim', fit: 'Straight Fit',
  },
  {
    id: 'c-jn-03',
    name: 'Distressed Skinny Jeans',
    price: 2400,
    oldPrice: 3200,
    description: 'Edgy distressed skinny jeans with raw hem details. A bold statement piece for any wardrobe.',
    category: 'Clothing',
    subcategory: 'Jeans',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    ],
    sizes: ['26', '28', '30', '32', '34'],
    colors: [
      { name: 'Ripped Blue', hex: '#3B82F6' },
      { name: 'Black Distressed', hex: '#1F2937' },
    ],
    
    isSale: true,
    material: '99% Cotton, 1% Lycra', fit: 'Skinny Fit',
  },

  // ─── ACCESSORIES > BELTS ───
  {
    id: 'a-bl-01',
    name: 'Full-Grain Leather Belt',
    price: 1499,
    description: 'Handcrafted from full-grain vegetable-tanned leather. Ages beautifully with a rich patina over time.',
    category: 'Accessories',
    subcategory: 'Belts',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    ],
    sizes: ['32', '34', '36', '38', '40'],
    colors: [
      { name: 'Tan', hex: '#C8956C' },
      { name: 'Dark Brown', hex: '#5C3D2E' },
      { name: 'Black', hex: '#111827' },
    ],
    
    isNew: true,
    material: 'Full-Grain Leather', fit: 'One Size',
  },
  {
    id: 'a-bl-02',
    name: 'Woven Canvas Belt',
    price: 799,
    oldPrice: 1099,
    description: 'Casual woven canvas belt with a brushed nickel buckle. Light and versatile for everyday wear.',
    category: 'Accessories',
    subcategory: 'Belts',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    ],
    sizes: ['S/M', 'L/XL'],
    colors: [
      { name: 'Olive', hex: '#6B7C4D' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Khaki', hex: '#C3A882' },
    ],
    
    isSale: true,
    material: 'Canvas + Nickel Buckle', fit: 'Adjustable',
  },

  // ─── ACCESSORIES > WATCHES ───
  {
    id: 'a-wt-01',
    name: 'Minimalist Mesh Strap Watch',
    price: 4999,
    description: 'Ultra-thin minimalist watch with a stainless steel mesh strap. Swiss quartz movement. 30m water resistant.',
    category: 'Accessories',
    subcategory: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gold', hex: '#C9A96E' },
      { name: 'Rose Gold', hex: '#E8B4B8' },
    ],
    
    isNew: true,
    material: 'Stainless Steel + Sapphire Glass', fit: 'One Size',
  },
  {
    id: 'a-wt-02',
    name: 'Classic Leather Strap Watch',
    price: 3499,
    oldPrice: 4999,
    description: 'Timeless round-dial watch with a genuine leather strap. A wardrobe staple for any occasion.',
    category: 'Accessories',
    subcategory: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black Dial / Brown Strap', hex: '#111827' },
      { name: 'White Dial / Tan Strap', hex: '#F9FAFB' },
    ],
    
    isSale: true,
    material: 'Genuine Leather Strap + Mineral Glass', fit: 'One Size',
  },
  {
    id: 'a-wt-03',
    name: 'Sport Chronograph Watch',
    price: 6499,
    description: 'Bold sport chronograph with a silicone strap and 100m water resistance. Built for the active lifestyle.',
    category: 'Accessories',
    subcategory: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#111827' },
      { name: 'Navy Blue', hex: '#1E3A8A' },
    ],
    
    material: 'Stainless Steel Case + Silicone Strap', fit: 'One Size',
  },

  // ─── ACCESSORIES > WALLETS ───
  {
    id: 'a-wl-01',
    name: 'Slim Bifold Leather Wallet',
    price: 1299,
    description: 'Minimal bifold wallet crafted from top-grain leather. Holds up to 8 cards with a slim profile.',
    category: 'Accessories',
    subcategory: 'Wallets',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Tan', hex: '#C8956C' },
      { name: 'Black', hex: '#111827' },
      { name: 'Dark Brown', hex: '#5C3D2E' },
    ],
    
    isNew: true,
    material: 'Top-Grain Leather', fit: 'One Size',
  },
  {
    id: 'a-wl-02',
    name: 'RFID Blocking Card Holder',
    price: 899,
    oldPrice: 1299,
    description: 'Ultra-slim RFID-blocking card holder. Holds 6 cards securely with a quick-access slot.',
    category: 'Accessories',
    subcategory: 'Wallets',
    images: [
      'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#111827' },
      { name: 'Midnight Navy', hex: '#1E3A8A' },
    ],
    
    isSale: true,
    material: 'Genuine Leather + RFID Shield', fit: 'One Size',
  },

  // ─── ACCESSORIES > SUNGLASSES ───
  {
    id: 'a-sg-01',
    name: 'Classic Aviator Sunglasses',
    price: 1799,
    description: 'Timeless aviator silhouette with UV400 polarized lenses. Lightweight titanium frame.',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Gold / Green Lens', hex: '#C9A96E' },
      { name: 'Silver / Blue Lens', hex: '#C0C0C0' },
    ],
    
    isNew: true,
    material: 'Titanium Frame + Polarized Glass', fit: 'One Size',
  },
  {
    id: 'a-sg-02',
    name: 'Retro Square Frame Sunglasses',
    price: 1399,
    oldPrice: 1999,
    description: 'Bold retro square frames with gradient tinted lenses. A statement accessory for any outfit.',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Tortoise', hex: '#7B4F2E' },
      { name: 'Black', hex: '#111827' },
      { name: 'Transparent', hex: '#E5E7EB' },
    ],
    
    isSale: true,
    material: 'Acetate Frame + UV400 Lens', fit: 'One Size',
  },
  {
    id: 'a-sg-03',
    name: 'Rimless Oval Sunglasses',
    price: 2199,
    description: 'Minimalist rimless oval sunglasses with ultra-light titanium temples. Barely-there luxury.',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Silver / Smoke Lens', hex: '#C0C0C0' },
      { name: 'Gold / Brown Lens', hex: '#C9A96E' },
    ],
    
    isNew: true,
    material: 'Titanium Temples + Glass Lens', fit: 'One Size',
  },

  // ─── FLASH SALE ───
  {
    id: 'fs-01',
    name: 'Classic Denim Jacket',
    price: 2499,
    oldPrice: 5200,
    description: 'Iconic denim jacket in premium washed denim. A forever classic that elevates any outfit.',
    category: 'Flash Sale',
    subcategory: 'Flash Sale',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue Wash', hex: '#3B82F6' },
      { name: 'Black', hex: '#111827' },
    ],
    
    isSale: true, isFlashSale: true,
    flashSaleEnds: '2026-04-21T23:59:00',
    material: '100% Cotton Denim', fit: 'Regular Fit',
  },
  {
    id: 'fs-02',
    name: 'Minimalist Mesh Strap Watch',
    price: 1999,
    oldPrice: 4999,
    description: 'Swiss quartz movement. Ultra-thin minimal design. Flash sale exclusive pricing.',
    category: 'Flash Sale',
    subcategory: 'Flash Sale',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gold', hex: '#C9A96E' },
    ],
    
    isSale: true, isFlashSale: true,
    flashSaleEnds: '2026-04-21T23:59:00',
    material: 'Stainless Steel + Sapphire Glass', fit: 'One Size',
  },
  {
    id: 'fs-03',
    name: 'Slim Bifold Leather Wallet',
    price: 499,
    oldPrice: 1299,
    description: 'Top-grain leather bifold. 8-card capacity. Flash sale exclusive pricing.',
    category: 'Flash Sale',
    subcategory: 'Flash Sale',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Tan', hex: '#C8956C' },
      { name: 'Black', hex: '#111827' },
    ],
    
    isSale: true, isFlashSale: true,
    flashSaleEnds: '2026-04-21T23:59:00',
    material: 'Top-Grain Leather', fit: 'One Size',
  },
  {
    id: 'fs-04',
    name: 'Graphic Print Oversized Tee',
    price: 499,
    oldPrice: 1799,
    description: '280gsm heavyweight cotton oversized tee. Flash sale — limited stock.',
    category: 'Flash Sale',
    subcategory: 'Flash Sale',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Black', hex: '#1F2937' },
      { name: 'Vintage White', hex: '#F9F5F0' },
    ],
    
    isSale: true, isFlashSale: true,
    flashSaleEnds: '2026-04-21T23:59:00',
    material: '280gsm Heavyweight Cotton', fit: 'Oversized Fit',
  },
];

// ─────────────────────────────────────────────
// HELPER — get products by subcategory
// ─────────────────────────────────────────────

export const getBySubcategory = (sub: string): Product[] => {
  if (sub === 'All Clothing')    return PRODUCTS.filter(p => p.category === 'Clothing');
  if (sub === 'All Accessories') return PRODUCTS.filter(p => p.category === 'Accessories');
  if (sub === 'Flash Sale')      return PRODUCTS.filter(p => p.isFlashSale);
  return PRODUCTS.filter(p => p.subcategory === sub);
};

export const getNewArrivals = (): Product[] => PRODUCTS.filter(p => p.isNew).slice(0, 8);
export const getOnSale = (): Product[]      => PRODUCTS.filter(p => p.isSale && !p.isFlashSale).slice(0, 8);
export const getFlashSale = (): Product[]   => PRODUCTS.filter(p => p.isFlashSale);

// ─────────────────────────────────────────────
// DISCOUNT UTILITY
// ─────────────────────────────────────────────

export const getDiscountPercent = (price: number, oldPrice?: number): number => {
  if (!oldPrice) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

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
// WISHLIST (mock)
// ─────────────────────────────────────────────

export const MOCK_WISHLIST: string[] = ['c-jn-01', 'a-wt-01', 'fs-01'];

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
      { productId: 'c-jn-01', quantity: 1, size: '32', color: 'Dark Navy' },
      { productId: 'c-sh-01', quantity: 1, size: 'M',  color: 'White' },
    ],
    trackingId: 'DTDC9876543210',
    addressId: 'addr_01',
    paymentMethod: 'UPI',
  },
  {
    id: '#ORD-20240318',
    date: '18 Mar 2025',
    total: 4999,
    status: 'Delivered',
    items: [
      { productId: 'a-wt-01', quantity: 1, size: 'One Size', color: 'Silver' },
    ],
    trackingId: 'BLUEDART123456',
    addressId: 'addr_01',
    paymentMethod: 'Credit Card',
  },
  {
    id: '#ORD-20240210',
    date: '10 Feb 2025',
    total: 5198,
    status: 'Delivered',
    items: [
      { productId: 'a-sg-01', quantity: 1, size: 'One Size', color: 'Gold / Green Lens' },
      { productId: 'a-wl-01', quantity: 1, size: 'One Size', color: 'Tan' },
      { productId: 'c-ts-01', quantity: 2, size: 'L',        color: 'White' },
    ],
    trackingId: 'ECOM556677889',
    addressId: 'addr_02',
    paymentMethod: 'Net Banking',
  },
  {
    id: '#ORD-20240501',
    date: '01 May 2025',
    total: 2499,
    status: 'Confirmed',
    items: [
      { productId: 'fs-01', quantity: 1, size: 'L', color: 'Blue Wash' },
    ],
    trackingId: undefined,
    addressId: 'addr_01',
    paymentMethod: 'UPI',
  },
];

// ─────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────

export const BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Flash Sale — Up to 70% Off',
    subtitle: 'Limited time. Limited stock. Act fast.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80',
    link: '/category/Flash Sale',
    cta: 'Shop Flash Sale',
  },
  {
    id: 'b2',
    title: 'New Season. New Arrivals.',
    subtitle: 'Shirts, T-Shirts, Pants & Jeans — just dropped.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80',
    link: '/category/Clothing',
    cta: 'Shop Clothing',
  },
  {
    id: 'b3',
    title: 'Complete the Look',
    subtitle: 'Watches, Wallets, Belts & Sunglasses.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=80',
    link: '/category/Accessories',
    cta: 'Shop Accessories',
  },
];


