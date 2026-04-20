'use client';

import React from 'react';

export default function FilterSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="hover:text-black cursor-pointer">New Arrivals</li>
            <li className="hover:text-black cursor-pointer">Best Sellers</li>
            <li className="hover:text-black cursor-pointer">Clothing</li>
            <li className="hover:text-black cursor-pointer">Accessories</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Price Range</h3>
          <div className="space-y-2">
            <input type="range" className="w-full accent-black" />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>$0</span>
              <span>$1000+</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Size</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                className="w-10 h-10 border rounded-md text-xs hover:border-black transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
