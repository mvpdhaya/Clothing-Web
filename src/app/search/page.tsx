'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '@/data/mock';
import ProductCardCategory from '@/components/store/ProductCardCategory';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
  };

  const handleClear = () => {
    setInputValue('');
    setQuery('');
    router.replace('/search', { scroll: false });
  };

  const hasSearched = query.trim().length > 0;

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a1a1a]">

      {/* Hero Search Bar */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden px-5 py-20 text-center lg:px-10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30,58,95,0.85) 0%, rgba(15,40,71,0.9) 50%, rgba(26,58,82,0.85) 100%), url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&h=400&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Noise Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Breadcrumb Insider Hero */}
          <div className="relative z-10 flex items-center justify-center text-xs text-white/70 tracking-widest uppercase mb-4">
            <Link href="/" className="text-white/70 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-white">Search</span>
          </div>

          <h1 className="relative z-10 text-[28px] font-bold uppercase tracking-widest text-white drop-shadow-md lg:text-[42px] mb-8">
            Search
          </h1>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden pr-0 h-14">
              <Search size={18} className="absolute left-5 text-gray-400 pointer-events-none flex-shrink-0" />
              <input
                id="search-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for products, categories..."
                autoFocus
                className="w-full pl-12 pr-16 py-0 h-full text-[15px] text-gray-800 placeholder-gray-400 bg-transparent outline-none border-none font-sans"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-16 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="h-14 w-14 rounded-full bg-[#1a1a1a] text-white hover:bg-gray-700 transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <main className="mx-auto max-w-[1180px] px-5 py-12 pb-24 lg:px-10">

        {/* Result count bar */}
        {hasSearched && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <p className="text-[13px] text-gray-500 uppercase tracking-widest font-semibold">
              {results.length > 0
                ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                : `No results for "${query}"`}
            </p>
          </div>
        )}

        {/* Initial state — show popular categories */}
        {!hasSearched && (
          <div className="pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6 text-center">
              Popular Categories
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['Shirts', 'T-Shirts', 'Jeans', 'Pants', 'Belts', 'Watches', 'Wallets', 'Sunglasses'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setInputValue(tag);
                    setQuery(tag);
                    router.replace(`/search?q=${encodeURIComponent(tag)}`, { scroll: false });
                  }}
                  className="px-5 py-2.5 border border-gray-200 text-[12px] font-semibold uppercase tracking-widest text-gray-700 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 rounded-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search size={48} className="text-gray-200 mb-6" />
            <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-700 mb-3">
              No results found
            </h2>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try a different keyword or browse our categories.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest uppercase hover:bg-gray-700 transition-colors"
              >
                All Products
              </Link>
              <button
                onClick={handleClear}
                className="inline-block px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {hasSearched && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {results.map((product) => (
              <ProductCardCategory key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Search size={32} className="text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
