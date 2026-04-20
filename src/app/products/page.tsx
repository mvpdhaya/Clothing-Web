'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Filter as FilterIcon, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/mock';
import { cn, formatPrice } from '@/lib/utils';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { name: 'Nero', hex: '#2d3435' },
  { name: 'Gray', hex: '#5f5e5e' },
  { name: 'Optic White', hex: '#f2f4f4' },
  { name: 'Tan', hex: '#745b3b' },
];
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price-low', label: 'Price: Low → High' },
  { id: 'price-high', label: 'Price: High → Low' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [category, setCategory] = useState<string | null>(initialCategory);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');
  const [gridCols, setGridCols] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (category === 'Sale') list = list.filter(p => p.isSale);
    else if (category) list = list.filter(p => p.category === category);
    if (sizes.length > 0) list = list.filter(p => p.sizes.some(s => sizes.includes(s)));
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, sizes, sort]);

  const toggleSize = (s: string) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearAll = () => { setCategory(null); setSizes([]); setSort('newest'); };

  const handleLayoutChange = (cols: number) => {
    if (!isMobile) setGridCols(cols);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a1a1a]">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center px-5 py-24 text-center lg:px-10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,58,95,0.85) 0%, rgba(15,40,71,0.9) 50%, rgba(26,58,82,0.85) 100%), url("https://images.unsplash.com/photo-1441984908747-523199859266?w=1600&h=400&fit=crop")`,
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
          <span className="font-semibold text-white">{category || 'Collections'}</span>
        </div>

        <h1 className="relative z-10 text-[32px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-lg lg:text-[48px] italic">
          {category || 'Our Collections'}
        </h1>
      </section>

      {/* Filter Bar */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-8 lg:px-10">
          <div className="flex items-center gap-6">

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
                  <svg className="h-4 w-4 fill-current transition-colors" viewBox="0 0 24 24">
                    {cols === 2 && (
                      <>
                        <rect x="5" y="2" width="4" height="20" rx="1" />
                        <rect x="15" y="2" width="4" height="20" rx="1" />
                      </>
                    )}
                    {cols === 3 && (
                      <>
                        <rect x="3" y="2" width="3" height="20" rx="1" />
                        <rect x="10.5" y="2" width="3" height="20" rx="1" />
                        <rect x="18" y="2" width="3" height="20" rx="1" />
                      </>
                    )}
                    {cols === 4 && (
                      <>
                        <rect x="2" y="2" width="2.5" height="20" rx="1" />
                        <rect x="8" y="2" width="2.5" height="20" rx="1" />
                        <rect x="13.5" y="2" width="2.5" height="20" rx="1" />
                        <rect x="19.5" y="2" width="2.5" height="20" rx="1" />
                      </>
                    )}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider font-bold">
              <span className="text-gray-400">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-b-2 border-transparent bg-transparent py-1 pr-6 font-bold text-[#1a1a1a] outline-none hover:border-[#1a1a1a] transition-all"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block text-[12px] font-bold text-[#888] uppercase tracking-widest leading-none">
              {products.length} Items
            </div>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-[1180px] px-5 py-0 pb-24 lg:px-10">
        <div className="pt-2 sm:pt-0"> {/* Small offset to keep it tight */} </div>
        {products.length > 0 ? (
          <div
            className="grid gap-8 transition-all duration-300"
            style={{
              gridTemplateColumns: `repeat(${isMobile ? 2 : gridCols}, minmax(0, 1fr))`,
            }}
          >
            {products.map((product) => {
              const slug = product.name.toLowerCase().replace(/ /g, '-');
              const installment = formatPrice(product.price / 3);

              return (
                <Link
                  key={product.id}
                  href={`/product/${slug}`}
                  className="group relative cursor-pointer overflow-hidden rounded-md bg-[#f7f7f7] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {product.isSale && (
                      <span className="absolute left-4 top-4 z-[2] bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="px-5 pb-5 pt-3 text-center bg-[#f7f7f7]">
                    <h3 className="text-[13px] font-semibold text-gray-800 uppercase tracking-wide leading-tight">
                      {product.name}
                    </h3>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">{formatPrice(product.price)}</div>

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
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-60 border-t border-gray-100 italic font-serif text-4xl text-gray-200">
            No items match your criteria
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-40 text-center font-serif italic text-3xl text-gray-300">Loading Boutique...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

