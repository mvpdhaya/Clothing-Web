'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import ProductCardHome from '@/components/store/ProductCardHome';
import { 
  Product, 
  getNewArrivals, 
  getOnSale, 
  getFlashSale, 
  BANNERS, 
  CATEGORY_NAV 
} from '@/data/mock';

const Hero: React.FC = () => {
  const banner = BANNERS[1]; // New Season Arrivals
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
            <h1 className="text-5xl font-semibold text-gray-800 mb-4">{banner.title}</h1>
            <p className="text-gray-500 mb-8">{banner.subtitle}</p>
            <Link
              href={banner.link}
              className="inline-block px-9 py-3 border-2 border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-all underline-none"
            >
              {banner.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCarousel: React.FC<{
  title: string;
  subtitle: string;
  products: Product[];
  sectionKey: string;
}> = ({ title, subtitle, products, sectionKey }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between mb-12 px-2 md:px-[60px]">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wide">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link
            href="/products"
            className="px-6 py-2 border-2 border-gray-800 text-gray-800 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all whitespace-nowrap"
          >
            SHOP ALL
          </Link>
        </div>
      </div>

      <div className="relative px-2 md:px-[60px]">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 no-scrollbar scroll-smooth pb-4"
        >
          {products.map((product) => {
            const key = `${sectionKey}-${product.id}`;
            return (
              <div key={key} className="flex-none w-[280px] sm:w-[320px] lg:w-[calc((100%-80px)/5)]">
                <ProductCardHome product={product} />
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10"
          aria-label="Scroll right"
        >
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
          {CATEGORY_NAV.map((category) => (
            <Link key={category.id} href={`/category/${category.id.toLowerCase()}`} className="relative overflow-hidden aspect-[3/4] cursor-pointer group block">
              <img
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h3 className="text-white text-lg font-bold uppercase tracking-wide text-center whitespace-pre-line">
                  {category.label}
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
  const banner = BANNERS[0]; // Flash Sale
  return (
    <section className="bg-black relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="flex flex-col justify-center p-20 text-white z-10">
          <h2 className="text-5xl font-bold mb-5 uppercase tracking-wider">{banner.title}</h2>
          <p className="text-gray-300 mb-10 max-w-md leading-relaxed">
            {banner.subtitle}
          </p>
          <Link
            href={banner.link}
            className="inline-block px-12 py-4 border-2 border-white text-white font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all w-fit"
          >
            {banner.cta}
          </Link>
        </div>
        <div className="relative overflow-hidden">
          <img
            src={banner.image}
            alt={banner.title}
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
                href="/products?category=Flash Sale"
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
  const instagramPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=500&fit=crop' },
    { id: 2, image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop' },
    { id: 3, image: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=400&h=500&fit=crop' },
    { id: 4, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=500&fit=crop' },
  ];

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
        products={getNewArrivals()}
        sectionKey="new"
      />
      <CategoryShowcase />
      <PromoBanner />
      <ProductCarousel
        title="FLASH SALE"
        subtitle="For those who deserve elegance & classy look everyday"
        products={getFlashSale()}
        sectionKey="flash"
      />
      <DealsSection />
      <ProductCarousel
        title="ON SALE"
        subtitle="For those who deserve elegance & classy look everyday"
        products={getOnSale()}
        sectionKey="onsale"
      />
      <InstagramStrip />
    </div>
  );
}
