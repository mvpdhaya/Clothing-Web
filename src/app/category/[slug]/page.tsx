'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Filter } from 'lucide-react';
import { useParams } from 'next/navigation';
import { PRODUCTS } from '@/data/mock';
import { formatPrice } from '@/lib/utils';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [gridCols, setGridCols] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setGridCols(2);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categoryName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const categoryProducts = useMemo(() =>
    PRODUCTS.filter(p => p.category.toLowerCase() === slug.toLowerCase() ||
      p.category.toLowerCase().replace(/ /g, '-') === slug.toLowerCase()),
    [slug]
  );

  const handleLayoutChange = (cols: number) => {
    if (!isMobile) setGridCols(cols);
  };

  return (
    <div className="font-sans text-[#1a1a1a] leading-normal bg-white min-h-screen">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center px-5 py-20 text-center lg:px-10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,58,95,0.85) 0%, rgba(15,40,71,0.9) 50%, rgba(26,58,82,0.85) 100%), url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&h=400&fit=crop")`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Breadcrumb Insider Hero */}
        <div className="relative z-10 flex items-center justify-center text-xs text-white/70 tracking-widest uppercase mb-4">
          <Link href="/" className="text-white/70 no-underline transition-colors hover:text-white font-medium">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-white">{categoryName}</span>
        </div>

        <h1 className="relative z-10 text-[28px] font-bold uppercase tracking-widest text-white drop-shadow-md lg:text-[42px]">
          {categoryName}
        </h1>
      </section>

      {/* Filter Bar */}
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-8 lg:px-10">
        <div className="flex items-center gap-5">

          <div className="hidden items-center gap-2 sm:flex">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                onClick={() => handleLayoutChange(cols)}
                className={`flex items-center justify-center rounded p-2 transition-all ${gridCols === cols && !isMobile
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                  : 'border border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a]'
                  }`}
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  {cols === 2 && (
                    <>
                      <rect x="3" y="3" width="7" height="18" />
                      <rect x="14" y="3" width="7" height="18" />
                    </>
                  )}
                  {cols === 3 && (
                    <>
                      <rect x="2" y="3" width="5" height="18" />
                      <rect x="9.5" y="3" width="5" height="18" />
                      <rect x="17" y="3" width="5" height="18" />
                    </>
                  )}
                  {cols === 4 && (
                    <>
                      <rect x="1" y="3" width="3.5" height="18" />
                      <rect x="6.5" y="3" width="3.5" height="18" />
                      <rect x="12" y="3" width="3.5" height="18" />
                      <rect x="17.5" y="3" width="3.5" height="18" />
                    </>
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-[14px]">
            <span>Sort by:</span>
            <select className="cursor-pointer border-b border-[#1a1a1a] bg-transparent py-1 pr-6 font-[inherit] text-[14px] outline-none">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
              <option>Best Selling</option>
            </select>
          </div>
          <div className="text-[14px] text-[#888]">{categoryProducts.length} Products</div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="mx-auto max-w-[1180px] px-5 py-0 pb-[60px] lg:px-10">
        <div className="pt-2 sm:pt-0"></div>
        {categoryProducts.length > 0 ? (
          <div
            className="grid gap-4 transition-all duration-300 sm:gap-10"
            style={{
              gridTemplateColumns: `repeat(${isMobile ? 2 : gridCols}, minmax(0, 1fr))`,
            }}
          >
            {categoryProducts.map((product) => {
              const slug = product.name.toLowerCase().replace(/ /g, '-');
              const installment = formatPrice(product.price / 3);

              return (
                <Link
                  key={product.id}
                  href={`/product/${slug}`}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#f5f5f5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {product.isSale && (
                      <span className="absolute left-3 top-3 z-[2] text-[11px] font-bold uppercase tracking-wider text-[#c44b3f]">
                        SALE
                      </span>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                        {product.colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            title={color.name}
                            className={`h-4 w-4 flex-shrink-0 rounded-full border border-black/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-all hover:ring-1 hover:ring-black/40`}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <div className="flex h-4 min-w-[22px] items-center justify-center rounded-lg border border-[#e5e5e5] bg-white px-1 text-[10px] font-semibold text-[#888]">
                            +{product.colors.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-5 pt-4 text-center bg-transparent">
                    <h3 className="mb-2 flex min-h-[36px] items-center justify-center text-[13px] font-bold uppercase leading-snug tracking-wide text-[#1a1a1a]">
                      {product.name}
                    </h3>
                    <div className="mb-2 text-[15px] font-semibold text-[#1a1a1a]">{formatPrice(product.price)}</div>
                    <div className="text-[13px] leading-relaxed text-[#888]">
                      or pay in 3 x <strong className="text-[#1a1a1a]">{installment}</strong> with
                      <br />
                      KOKO
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-t border-gray-100 italic font-serif text-3xl text-gray-300">
            No products found in this category
          </div>
        )}
      </section>
    </div>
  );
}
