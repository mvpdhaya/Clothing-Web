'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import ProductCardHome from '@/components/store/ProductCardHome';
import { useDbStore } from '@/store/dbStore';
import { Product } from '@/types/product';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="w-full h-[450px] bg-gray-50 flex items-center justify-center animate-pulse">
        <div className="max-w-md w-full px-5 text-center">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
      
      {/* Carousel 1 Skeleton */}
      <div className="py-14 max-w-[1400px] mx-auto px-5 animate-pulse">
        <div className="flex items-center justify-between mb-10 md:px-[60px]">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 md:px-[60px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-sm"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const homepageSections = useDbStore((state) => state.homepageSections);
  const banners = useDbStore((state) => state.banners);

  // Find the active Hero Banner section
  const heroSection = homepageSections.find(
    (sec) => sec.name.toLowerCase() === 'hero banner' && sec.active
  );

  const bannerData = heroSection?.banner;

  const bannerTitle = bannerData?.title || (banners.length > 0 ? banners[0].title : 'NEW SEASON ARRIVALS');
  const bannerSubtitle = bannerData?.subtitle || (banners.length > 0 ? banners[0].subtitle : 'Elevate your daily look with our latest items');
  const bannerLink = bannerData?.buttonLink || (banners.length > 0 ? banners[0].link : '/products');
  const bannerCta = bannerData?.buttonText || (banners.length > 0 ? banners[0].cta : 'SHOP NOW');
  const bannerImage = bannerData?.imageUrl || (banners.length > 0 ? banners[0].image : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600');

  return (
    <section 
      className="relative w-full flex items-center bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bannerImage})` 
      }}
    >
      <div className="max-w-[1400px] mx-auto px-5 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-end py-20">
        {/* Spacer to keep text on the right side - mirroring original position */}
        <div className="hidden md:block flex-1" />
        
        <div className="flex-1 text-center z-10 bg-black/10 backdrop-blur-[2px] p-10 rounded-sm border border-white/10">
          <p className="flex items-center justify-center gap-4 text-white tracking-widest mb-3 font-medium">
            <span className="w-10 h-px bg-white"></span>
            Stylish
            <span className="w-10 h-px bg-white"></span>
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight uppercase tracking-tight">{bannerTitle}</h1>
          <p className="text-white/90 text-lg mb-10 max-w-md mx-auto font-medium">
            {bannerSubtitle}
          </p>
          <Link
            href={bannerLink}
            className="inline-block px-12 py-4 border-2 border-white text-white text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-xl"
          >
            {bannerCta}
          </Link>
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
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between mb-6 sm:mb-10 md:px-[60px]">
          <div>
            <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 uppercase tracking-wide">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Link
            href="/products"
            className="px-6 py-2 border-2 border-gray-800 text-gray-800 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all whitespace-nowrap"
          >
            SHOP ALL
          </Link>
        </div>

        <div className="relative md:px-[60px]">
          <button 
            onClick={() => handleScroll('left')}
            className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 no-scrollbar scroll-smooth py-3"
          >
            {products.map((product) => {
              const key = `${sectionKey}-${product.id}`;
              return (
                <div key={key} className="flex-none w-[calc(50%-10px)] sm:w-[320px] lg:w-[calc((100%-80px)/5)]">
                  <ProductCardHome product={product} />
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => handleScroll('right')}
            className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-md z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

const CategoryShowcase: React.FC = () => {
  const categoryNav = useDbStore((state) => state.categoryNav);
  
  if (categoryNav.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wide">
            SHOP OUR TOP CATEGORIES
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {categoryNav.map((category) => (
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

const PromoBanner: React.FC<{ banner: any }> = ({ banner }) => {
  if (!banner) return null;

  const isRight = banner.alignment === 'right';

  // text column: order-2 on mobile always, then lg:order depends on alignment
  const textOrder = isRight ? 'order-2 lg:order-2' : 'order-2 lg:order-1';
  // image column: order-1 on mobile always, then lg:order depends on alignment
  const imageOrder = isRight ? 'order-1 lg:order-1' : 'order-1 lg:order-2';
  // gradient fades from the side the text is on
  const gradientDir = isRight ? 'lg:bg-gradient-to-l' : 'lg:bg-gradient-to-r';

  return (
    <section className="bg-black relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
        <div className={`flex flex-col justify-center p-8 sm:p-14 text-white z-10 ${textOrder}`}>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-5 uppercase tracking-wider">{banner.title}</h2>
          <p className="text-gray-300 mb-8 sm:mb-10 max-w-md leading-relaxed text-sm sm:text-base">
            {banner.subtitle}
          </p>
          <Link
            href={banner.buttonLink || banner.link || '/products'}
            className="inline-block px-8 py-3 sm:px-12 sm:py-4 border-2 border-white text-white font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all w-fit text-xs sm:text-base"
          >
            {banner.buttonText || banner.cta || 'Shop Now'}
          </Link>
        </div>
        <div className={`relative overflow-hidden h-[300px] lg:h-auto ${imageOrder}`}>
          <img
            src={banner.imageUrl || banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradientDir} from-black via-black/40 to-transparent`}></div>
        </div>
      </div>
    </section>
  );
};

const MiddleBanner: React.FC<{ banner: any }> = ({ banner }) => {
  return <PromoBanner banner={banner} />;
};
const DoubleBanner: React.FC<{ banner: any }> = ({ banner }) => {
  if (!banner) return null;

  const titles = (banner.title || "").split(" | ");
  const subtitles = (banner.subtitle || "").split(" | ");
  const buttons = (banner.buttonText || "").split(" | ");
  const links = (banner.buttonLink || "").split(" | ");
  const images = (banner.imageUrl || "").split(" | ");

  const left = {
    title: titles[0] || "Summer Sale Up to 50% Off",
    subtitle: subtitles[0] || "END OF SEASON",
    button: buttons[0] || "SHOP NOW",
    link: links[0] || "/products",
    img: images[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop"
  };

  const right = {
    title: titles[1] || "Autumn Collection 2026",
    subtitle: subtitles[1] || "NEW ARRIVALS",
    button: buttons[1] || "DISCOVER",
    link: links[1] || "/products",
    img: images[1] || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop"
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card */}
          <div className="relative overflow-hidden aspect-video group cursor-pointer">
            <img
              src={left.img}
              alt={left.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white max-w-xs">
              <span className="text-sm tracking-widest mb-2 block">{left.subtitle}</span>
              <h3 className="text-3xl font-bold mb-5 leading-tight">{left.title}</h3>
              <Link
                href={left.link}
                className="inline-block px-9 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-gray-800 transition-all"
              >
                {left.button}
              </Link>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative overflow-hidden aspect-video group cursor-pointer">
            <img
              src={right.img}
              alt={right.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-1/2 left-10 -translate-y-1/2 text-white max-w-xs">
              <span className="text-sm tracking-widest mb-2 block">{right.subtitle}</span>
              <h3 className="text-3xl font-bold mb-5 leading-tight">{right.title}</h3>
              <Link
                href={right.link}
                className="inline-block px-9 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-gray-800 transition-all"
              >
                {right.button}
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
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-wide mb-2">
            SAY HELLO TO OUR INSTAGRAM
          </h2>
          <p className="text-sm text-gray-500">
            Join our community for daily inspiration and a closer look at our creations
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <div key={post.id} className="relative overflow-hidden aspect-[3/4] rounded-2xl cursor-pointer group">
              <img
                src={post.image}
                alt="Instagram"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 lg:bg-black/40 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <img src="/insta.svg" alt="Instagram Icon" className="w-8 h-8" />
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
  const loading = useDbStore((state) => state.loading);
  const products = useDbStore((state) => state.products);
  const banners = useDbStore((state) => state.banners);
  const homepageSections = useDbStore((state) => state.homepageSections);
  const getNewArrivals = useDbStore((state) => state.getNewArrivals);
  const getFlashSale = useDbStore((state) => state.getFlashSale);
  const getOnSale = useDbStore((state) => state.getOnSale);

  if (loading) {
    return <SkeletonLoader />;
  }

  // Fallback banner
  const fallbackBanner = banners.length > 0 ? banners[0] : null;

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <Hero />
      <CategoryShowcase />

      {/* Dynamic sections configured via dashboard database */}
      {homepageSections.length > 0 ? (
        homepageSections
          .filter((sec) => sec.name.toLowerCase() !== 'hero banner')
          .map((section) => {
            if (section.type === 'banner') {
              return (
                <PromoBanner 
                  key={section.id} 
                  banner={section.banner} 
                />
              );
            }
            if (section.type === 'middle_banner') {
              return (
                <MiddleBanner 
                  key={section.id} 
                  banner={section.banner} 
                />
              );
            }
            if (section.type === 'double_banner') {
              return (
                <DoubleBanner 
                  key={section.id} 
                  banner={section.banner} 
                />
              );
            }
            if (section.type === 'products') {
              let sectionProducts: Product[] = [];
              if (section.grid) {
                const grid = section.grid;
                
                // Prioritize explicit products or subcategories regardless of source
                if (grid.selectedProducts && grid.selectedProducts.length > 0) {
                  sectionProducts = products.filter(p => grid.selectedProducts.includes(p.id));
                } else if (grid.selectedSubcategories && grid.selectedSubcategories.length > 0) {
                  // Filter by subcategory (matching case-insensitive and normalized)
                  const selectedSubs = grid.selectedSubcategories.map(s => s.toLowerCase());
                  sectionProducts = products.filter(p => 
                    selectedSubs.includes(p.subcategory.toLowerCase()) ||
                    selectedSubs.includes(p.subcategory.replace('-', ' ').toLowerCase())
                  );
                } else if (grid.source === 'new') {
                  sectionProducts = products.filter(p => p.isNew).slice(0, grid.itemCount);
                } else if (grid.source === 'sale') {
                  sectionProducts = products.filter(p => p.isSale).slice(0, grid.itemCount);
                } else if (grid.source === 'flash') {
                  sectionProducts = products.filter(p => p.isFlashSale).slice(0, grid.itemCount);
                } else {
                  // Unknown source or manual with no selections — show all products up to itemCount
                  sectionProducts = products.slice(0, grid.itemCount || 8);
                }
              } else {
                // No grid config — fall back to all products (up to 8)
                sectionProducts = products.slice(0, 8);
              }
              return (
                <ProductCarousel
                  key={section.id}
                  title={section.name}
                  subtitle={section.grid?.description || ""}
                  products={sectionProducts}
                  sectionKey={section.id}
                />
              );
            }
            return null;
          })
      ) : (
        /* Default Layout Fallbacks */
        <>
          <ProductCarousel
            title="NEW ARRIVALS"
            subtitle="For those who deserve elegance & classy look everyday"
            products={getNewArrivals()}
            sectionKey="new"
          />
          {fallbackBanner && <PromoBanner banner={fallbackBanner} />}
          <ProductCarousel
            title="FLASH SALE"
            subtitle="For those who deserve elegance & classy look everyday"
            products={getFlashSale()}
            sectionKey="flash"
          />
          <ProductCarousel
            title="ON SALE"
            subtitle="For those who deserve elegance & classy look everyday"
            products={getOnSale()}
            sectionKey="onsale"
          />
          <DoubleBanner 
            banner={{
              title: "Summer Sale Up to 50% Off | Autumn Collection 2026",
              subtitle: "END OF SEASON | NEW ARRIVALS",
              buttonText: "SHOP NOW | DISCOVER",
              buttonLink: "/products | /products",
              alignment: "left | left",
              imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop | https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=450&fit=crop"
            }} 
          />
        </>
      )}

      <InstagramStrip />
    </div>
  );
}

