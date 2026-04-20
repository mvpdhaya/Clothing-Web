'use client';

import React, { useState } from 'react';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  installment: string;
  image: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface InstagramPost {
  id: number;
  image: string;
}

const newArrivals: Product[] = [
  {
    id: 1,
    name: 'DESIGUAL PRINTED SS SHIRT',
    price: 'RS 4,950.00',
    installment: 'Rs 1,650.00',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    badge: 'NEW',
    colors: [{ name: 'Orange', hex: '#f97316' }, { name: 'White', hex: '#ffffff' }],
  },
  {
    id: 2,
    name: 'ZARA LINEN BLEND MANDARIN LS SHIRT',
    price: 'RS 5,950.00',
    installment: 'Rs 1,983.33',
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=500&fit=crop',
    badge: 'NEW',
    colors: [{ name: 'Navy', hex: '#1e3a8a' }, { name: 'Tan', hex: '#d2b48c' }],
  },
  {
    id: 3,
    name: 'SQUALO KNIT POLO 7051',
    price: 'RS 5,950.00',
    installment: 'Rs 1,983.33',
    image: 'https://images.unsplash.com/photo-1625910513413-5fc4e5e6727b?w=400&h=500&fit=crop',
    badge: 'NEW',
    colors: [{ name: 'Green', hex: '#166534' }, { name: 'Gray', hex: '#6b7280' }],
  },
  {
    id: 4,
    name: 'DOBBY CHECK LS SHIRT 4682',
    price: 'RS 5,950.00',
    installment: 'Rs 1,983.33',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop',
    badge: 'NEW',
    colors: [{ name: 'Blue', hex: '#2563eb' }, { name: 'Black', hex: '#000000' }],
  },
  {
    id: 5,
    name: 'EMBROIDED BAGGY DENIM 26504',
    price: 'RS 12,950.00',
    installment: 'Rs 4,316.66',
    image: 'https://images.unsplash.com/photo-1542272604-787c3839105e?w=400&h=500&fit=crop',
    badge: 'NEW',
    colors: [{ name: 'Denim', hex: '#1e3a5f' }],
  },
];

const categories: Category[] = [
  { id: 1, name: 'LONG SLEEVE\nSHIRTS', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=600&fit=crop' },
  { id: 2, name: 'POLO TEES', image: 'https://images.unsplash.com/photo-1625910513413-5fc4e5e6727b?w=400&h=600&fit=crop' },
  { id: 3, name: 'TROUSERS', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop' },
  { id: 4, name: 'DENIMS', image: 'https://images.unsplash.com/photo-1542272604-787c3839105e?w=400&h=600&fit=crop' },
];

const instagramPosts: InstagramPost[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=500&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=400&h=500&fit=crop' },
  { id: 4, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=500&fit=crop' },
];

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1516826957135-7dedea22a4ae?w=600&h=700&fit=crop"
              alt="Male Fashion Model"
              className="w-full max-w-[500px] h-auto object-cover"
            />
          </div>
          <div className="flex-1 text-center">
            <p className="flex items-center justify-center gap-4 text-gray-500 tracking-widest mb-3">
              <span className="w-10 h-px bg-gray-800"></span>
              Stylish
              <span className="w-10 h-px bg-gray-800"></span>
            </p>
            <h1 className="text-5xl font-semibold text-gray-800 mb-4">Male Clothes</h1>
            <p className="text-gray-500 mb-8">30% off Summer Vacation</p>
            <Link
              href="/products"
              className="inline-block px-9 py-3 border-2 border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-all underline-none"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard: React.FC<{
  product: Product;
}> = ({ product }) => {
  const slug = product.name.toLowerCase().replace(/ /g, '-');
  
  return (
    <Link href={`/product/${slug}`} className="group bg-[#f7f7f7] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block rounded-md overflow-hidden">
      <div className="relative bg-gray-100 overflow-hidden aspect-[3/4] rounded-md">
        {product.badge && (
          <span className="absolute top-4 left-4 bg-red-400 text-white px-3 py-1 text-xs font-semibold z-10">
            {product.badge}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="px-5 pb-5 pt-3 text-center bg-[#f7f7f7]">
        <h3 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide leading-tight">
          {product.name}
        </h3>
        <div className="text-xs font-semibold text-gray-500 mt-0.5">{product.price}</div>
        
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {product.colors.slice(0, 5).map((color, idx) => (
              <div
                key={idx}
                title={color.name}
                className="h-3 w-3 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 font-medium">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

const ProductCarousel: React.FC<{
  title: string;
  subtitle: string;
  products: Product[];
  sectionKey: string;
}> = ({ title, subtitle, products, sectionKey }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between mb-12 px-[60px]">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wide">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="px-6 py-2 border-2 border-gray-800 text-gray-800 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all"
          >
            SHOP ALL
          </Link>
        </div>
      </div>

      <div className="relative px-[60px]">
        <button className="absolute left-0 top-[40%] -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10">
          <ChevronLeft size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {products.map((product) => {
            const key = `${sectionKey}-${product.id}`;
            return (
              <ProductCard
                key={key}
                product={product}
              />
            );
          })}
        </div>

        <button className="absolute right-0 top-[40%] -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wide">
            SHOP OUR TOP CATEGORIES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.name.replace('\n', ' ')}`} className="relative overflow-hidden aspect-[3/4] cursor-pointer group block">
              <img
                src={category.image}
                alt={category.name.replace('\n', ' ')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h3 className="text-white text-lg font-bold uppercase tracking-wide text-center whitespace-pre-line">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const PromoBanner: React.FC = () => {
  return (
    <section className="bg-black relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="flex flex-col justify-center p-20 text-white z-10">
          <h2 className="text-5xl font-bold mb-5 uppercase tracking-wider">SQUALO PURE LINEN</h2>
          <p className="text-gray-300 mb-10 max-w-md leading-relaxed">
            Squale Is with Mora providing elegance with squale pure linen collection
          </p>
          <Link
            href="/products"
            className="inline-block px-12 py-4 border-2 border-white text-white font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all w-fit"
          >
            SHOP NOW
          </Link>
        </div>
        <div className="relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&h=600&fit=crop"
            alt="Squalo Pure Linen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

const DealsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden aspect-video group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop"
              alt="Summer Sale"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white max-w-xs">
              <span className="text-sm tracking-widest mb-2 block">END OF SEASON</span>
              <h3 className="text-3xl font-bold mb-5 leading-tight">Summer Sale Up to 50% Off</h3>
              <Link
                href="/products?category=Sale"
                className="inline-block px-9 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-gray-800 transition-all"
              >
                SHOP NOW
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden aspect-video group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop"
              alt="New Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white max-w-xs">
              <span className="text-sm tracking-widest mb-2 block">NEW ARRIVALS</span>
              <h3 className="text-3xl font-bold mb-5 leading-tight">Autumn Collection 2026</h3>
              <Link
                href="/products"
                className="inline-block px-9 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-gray-800 transition-all"
              >
                DISCOVER
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InstagramStrip: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-wide mb-2">
            SAY HELLO TO OUR INSTAGRAM
          </h2>
          <p className="text-sm text-gray-500">
            Join our community for daily inspiration and a closer look at our creations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <div key={post.id} className="relative overflow-hidden aspect-[3/4] rounded-2xl cursor-pointer group">
              <img
                src={post.image}
                alt="Instagram"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="https://instagram.com"
            target="_blank"
            className="inline-block px-12 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
          >
            Visit Instagram
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductCarousel
        title="NEW ARRIVALS"
        subtitle="For those who deserve elegance & classy look everyday"
        products={newArrivals}
        sectionKey="new"
      />
      <CategoryShowcase />
      <PromoBanner />
      <ProductCarousel
        title="FLASH SALE"
        subtitle="For those who deserve elegance & classy look everyday"
        products={newArrivals}
        sectionKey="flash"
      />
      <DealsSection />
      <ProductCarousel
        title="ACCESSORIES COLLECTION"
        subtitle="For those who deserve elegance & classy look everyday"
        products={newArrivals}
        sectionKey="accessories"
      />
      <InstagramStrip />
    </div>
  );
}
