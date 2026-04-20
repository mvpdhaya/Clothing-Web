'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/mock';
import ProductCard from '@/components/store/ProductCard';
import { formatPrice } from '@/lib/utils';
import { Truck } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useCartStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Recommendation products - using first 8 from mock data
  const recProducts = useMemo(() => PRODUCTS.slice(0, 8), []);

  const cardWidth = 300; // Adjusted for project's ProductCard width + gap
  const maxScroll = Math.max(0, (recProducts.length - 4) * cardWidth);

  const scrollCarousel = (direction: number) => {
    setScrollPosition(prev => {
      const newPos = prev + direction * cardWidth;
      return Math.max(0, Math.min(newPos, maxScroll));
    });
  };

  const subtotal = cartTotal();
  const shippingFreeThreshold = 10000;
  const isFreeShipping = subtotal >= shippingFreeThreshold;

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="font-sans text-gray-800 bg-white leading-normal pt-10">
      <main className="max-w-[1280px] mx-auto p-10 max-lg:p-5">
        <h1 className="text-4xl font-semibold tracking-wide mb-10 uppercase text-gray-800">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <h2 className="text-2xl font-serif italic text-gray-800 mb-2">Your cart is currently empty.</h2>
            <p className="text-gray-500 text-sm mb-8">Before proceed to checkout you must add some products to your shopping cart.</p>
            <Link 
              href="/products" 
              className="inline-block px-10 py-4 bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#333] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[60px] max-lg:gap-10">
            {/* Cart Items */}
            <div>
              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr] pb-4 border-b border-gray-200 text-[13px] font-medium text-gray-500 uppercase tracking-[0.5px]">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] py-6 border-b border-gray-100 items-center gap-4 lg:gap-0">
                  <div className="flex gap-5 items-start">
                    <div className="w-[100px] h-[130px] relative bg-gray-50 rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium mb-1 text-gray-800 leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-[13px] text-gray-500 mb-1">{item.selectedColor.name} / {item.selectedSize}</p>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                        className="text-xs text-gray-500 underline bg-transparent border-none cursor-pointer p-0 hover:text-gray-800 mt-2 transition-colors uppercase tracking-widest font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 w-fit lg:justify-self-center">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)}
                      className="w-9 h-9 border-none bg-white cursor-pointer text-lg text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <div className="w-10 h-9 flex items-center justify-center text-sm font-medium bg-transparent">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)}
                      className="w-9 h-9 border-none bg-white cursor-pointer text-lg text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-sm font-medium text-left lg:text-right text-gray-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>


          {/* Order Summary */}
          {cart.length > 0 && (
            <aside className="bg-gray-50 p-7 rounded h-fit">
              <div className="flex items-center gap-2.5 pb-5 border-b-2 border-gray-800 mb-6 text-[13px] font-medium">
                <Truck size={20} className="text-gray-800" />
                <span className="leading-tight text-gray-800">
                  {isFreeShipping 
                    ? "You've qualified for Free delivery!" 
                    : `Free delivery on all orders over ${formatPrice(shippingFreeThreshold)}`}
                </span>
              </div>

              <div className="mb-6">
                <label className="text-[13px] font-medium mb-2.5 block text-gray-800">
                  Order Special Instructions
                </label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full min-h-[80px] border border-gray-200 rounded p-3 text-[13px] resize-y bg-white focus:outline-none focus:border-gray-800 transition-colors"
                  placeholder="Special requests or instructions..."
                />
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-800">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-gray-500">Shipping</span>
                <span className="text-sm font-medium text-green-700">
                  {isFreeShipping ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-800">Total</span>
                <span className="text-xl font-semibold text-gray-800">{formatPrice(subtotal)}</span>
              </div>

              <div className="text-xs text-gray-400 mb-5 mt-2">Taxes calculated at checkout</div>

              <button 
                disabled
                className="block w-full text-center py-4 bg-gray-800 text-white border-none text-[13px] font-semibold tracking-[1.5px] uppercase rounded opacity-60 cursor-not-allowed"
              >
                Check Out
              </button>
            </aside>
          )}
        </div>
        )}

        {/* Recommendations */}
        <section className="mt-24 pb-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-gray-500 mb-3">
                Recommend
              </p>
              <h2 className="text-3xl font-semibold uppercase tracking-wide text-gray-800">
                You May Also Like
              </h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => scrollCarousel(-1)}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={scrollPosition === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(1)}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={scrollPosition >= maxScroll}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="relative overflow-visible">
            <div className="overflow-hidden mx-[-10px] px-[10px]">
              <div 
                className="flex gap-6 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${scrollPosition}px)` }}
              >
                {recProducts.map((product) => (
                  <div key={product.id} className="min-w-[280px] flex-[0_0_280px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
