'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/mock';
import ProductCardHome from '@/components/store/ProductCardHome';
import { useCartStore } from '@/store/cartStore';
import { cn, formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = useMemo(() => 
    PRODUCTS.find(p => p.id === slug || p.name.toLowerCase().replace(/ /g, '-') === slug), 
    [slug]
  );

  const [currentImg, setCurrentImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [openAcc, setOpenAcc] = useState<string>('desc');
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <p className="font-display text-3xl font-bold mb-4 text-[#333]">Product Not Found</p>
        <Link href="/products" className="bg-[#1a3a5c] text-white text-xs px-6 py-3 uppercase tracking-wider font-bold">Back to Shop</Link>
      </div>
    );
  }

  const relatedRef = useRef<HTMLDivElement>(null);
  const accRef = useRef<HTMLDivElement>(null);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 10);
  const accessories = PRODUCTS.filter(p => p.category !== product.category).slice(0, 10);

  const chgImg = (d: number) => setCurrentImg((p) => (p + d + product.images.length) % product.images.length);
  const updQty = (d: number) => setQty((p) => Math.max(1, p + d));
  const toggleAcc = (id: string) => setOpenAcc((p) => (p === id ? '' : id));

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const colorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
    addToCart(product, qty, selectedSize, colorObj);
  };

  const handleBuyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const colorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
    addToCart(product, qty, selectedSize, colorObj);
    router.push('/cart');
  };

  return (
    <div className="text-[#333] leading-relaxed bg-white">
      {/* Breadcrumb */}
      <div className="py-5 text-sm text-[#999]">
        <div className="mx-auto max-w-[1400px] px-5">
          <Link href="/" className="text-[#666] no-underline transition-colors hover:text-[#333]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="text-[#666] no-underline transition-colors hover:text-[#333]">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-[#333]">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="mx-auto mb-[60px] max-w-[1400px] px-5">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-[60px]">
          {/* Gallery */}
          <div className="flex gap-4 lg:sticky lg:top-[90px] lg:h-fit">
            <div className="hidden flex-col gap-2.5 sm:flex w-20">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setCurrentImg(i)} 
                  className={`relative h-[100px] w-20 cursor-pointer overflow-hidden border-2 transition-colors ${currentImg === i ? 'border-[#333]' : 'border-transparent hover:border-[#999]'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
            <div className="relative flex-1 bg-[#f5f5f5]">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={product.images[currentImg]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <button 
                onClick={() => chgImg(-1)} 
                className="absolute left-[15px] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm text-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-[#333] hover:text-white"
              >
                ❮
              </button>
              <button 
                onClick={() => chgImg(1)} 
                className="absolute right-[15px] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm text-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-[#333] hover:text-white"
              >
                ❯
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-[90px] h-fit lg:pr-2.5">
            <h1 className="mb-3 text-[22px] sm:text-[32px] font-bold uppercase tracking-wider text-[#333]">{product.name}</h1>
            <div className="mb-2 text-2xl font-semibold text-[#333]">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="mb-2 text-lg text-[#94a3b8] line-through">{formatPrice(product.oldPrice)}</div>
            )}


            <div className="mb-5 inline-flex cursor-pointer items-center gap-2 border-b border-transparent text-sm text-[#666] transition-colors hover:border-[#666]">📏 Size Chart</div>

            {product.colors.length > 0 && (
              <>
                <div className="mb-2 text-sm text-[#666]">Color : {selectedColor}</div>
                <div className="mb-5 flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button 
                      key={c.name} 
                      onClick={() => setSelectedColor(c.name)} 
                      className={`flex h-[50px] min-w-[50px] items-center justify-center border-2 px-3 text-xs transition-all ${selectedColor === c.name ? 'border-[#333] font-semibold text-[#333]' : 'border-[#ddd] text-[#333] hover:border-[#999]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {product.sizes.length > 0 && (
              <>
                <div className={cn("mb-2 text-sm", sizeError ? "text-red-500 font-bold" : "text-[#666]")}>
                  Size : {selectedSize || (sizeError ? "Please Select" : "")}
                </div>
                <div className="mb-6 flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button 
                      key={s} 
                      onClick={() => { setSelectedSize(s); setSizeError(false); }} 
                      className={`relative flex h-[50px] w-[50px] items-center justify-center border-2 text-sm transition-all ${selectedSize === s ? 'border-[#333] bg-[#333] font-semibold text-white' : 'border-[#ddd] text-[#333] hover:border-[#999]'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mb-3 flex flex-wrap gap-3">
              <div className="flex h-[52px] items-center border border-[#ddd]">
                <button onClick={() => updQty(-1)} className="flex h-full w-11 items-center justify-center bg-white text-lg text-[#333] transition-colors hover:bg-[#f5f5f5]">−</button>
                <input type="text" value={qty} readOnly className="h-full w-12 border-none text-center text-base font-medium outline-none" />
                <button onClick={() => updQty(1)} className="flex h-full w-11 items-center justify-center bg-white text-lg text-[#333] transition-colors hover:bg-[#f5f5f5]">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="h-[52px] flex-1 border border-[#1a3a5c] text-[#1a3a5c] text-sm font-semibold uppercase tracking-wider bg-white transition-colors hover:bg-gray-50"
              >
                Add to Cart
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="mb-3 w-full h-[52px] bg-[#1a3a5c] text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#0f2540]"
            >
              Buy Now
            </button>

            <div className="mb-5 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-[#555]"><span className="text-lg text-[#25d366]">💬</span> Ask an Expert</div>
              <div className="flex items-center gap-3 text-sm text-[#555]"><span className="text-lg text-blue-500">🌐</span> Unmatched Value For Money</div>

              <div className="flex items-center gap-3 text-sm text-[#555]"><span className="text-lg text-gray-500">🔄</span> 14-days Easy Exchange</div>
            </div>

            <div className="mb-6 border border-[#eee] p-[18px]">
              <div className="relative mb-3 text-center text-sm text-[#666]">
                <span className="relative z-10 bg-white px-4 uppercase font-semibold text-[11px] tracking-widest">Guarantee Safe Checkout</span>
                <div className="absolute left-0 top-1/2 h-px w-full bg-[#eee]" />
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {['Visa', 'MC', 'Discover', 'Amex', 'PayPal', 'JCB'].map((p) => (
                  <div key={p} className="h-7 rounded border border-gray-200 bg-white px-2 text-[10px] font-bold flex items-center text-[#666]">{p}</div>
                ))}
              </div>
            </div>

            {/* Accordions */}
            {[
              { id: 'desc', title: 'Description', content: <><p className="text-sm leading-[1.8] text-[#555]">{product.description}</p><p className="mt-2.5 text-sm font-semibold text-[#333]">Actual colour may vary slightly due to screen and lighting.</p></> },
              { id: 'ship', title: 'Shipping & Returns', content: <p className="text-sm leading-[1.8] text-[#555]">Free shipping on all orders over Rs 10,000. Standard delivery within 3-5 business days. Easy 14-day returns and exchanges. Items must be unworn with original tags attached.</p> }
            ].map((acc) => (
              <div key={acc.id} className="border-t border-[#eee]">
                <div onClick={() => toggleAcc(acc.id)} className="flex cursor-pointer items-center justify-between py-[18px] text-[15px] font-semibold uppercase tracking-wider text-[#333]">
                  {acc.title}
                  <span className={`text-sm transition-transform ${openAcc === acc.id ? 'rotate-45' : ''}`}>+</span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openAcc === acc.id ? 'max-h-[600px] pb-5' : 'max-h-0'}`}>
                  {acc.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Related Products */}
      {[
        { title: 'YOU MAY ALSO LIKE', items: related, ref: relatedRef },
        { title: 'ACCESSORIES', items: accessories, ref: accRef }
      ].map((sec) => (
        <section key={sec.title} className="mb-12">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-6 flex items-center justify-between md:px-[60px]">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#333]">{sec.title}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleScroll(sec.ref, 'left')}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#ddd] bg-white text-sm text-[#333] transition-all hover:border-[#333] hover:bg-[#333] hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => handleScroll(sec.ref, 'right')}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#ddd] bg-white text-sm text-[#333] transition-all hover:border-[#333] hover:bg-[#333] hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div 
              ref={sec.ref}
              className="flex overflow-x-auto gap-5 no-scrollbar scroll-smooth py-3 md:px-[60px]"
            >
              {sec.items.map((p) => (
                <div key={`sec-${p.id}`} className="flex-none w-[calc(50%-10px)] sm:w-[280px] lg:w-[calc((100%-80px)/5)]">
                  <ProductCardHome product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
