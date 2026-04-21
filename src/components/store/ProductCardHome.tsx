'use client';

import React from 'react';
import Link from 'next/link';

import { Product } from '@/data/mock';
import { formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
}

const ProductCardHome: React.FC<Props> = ({ product }) => {
  const slug = product.name.toLowerCase().replace(/ /g, '-');
  
  return (
    <Link href={`/product/${slug}`} className="group bg-[#f7f7f7] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block rounded-md overflow-hidden">
      <div className="relative bg-gray-100 overflow-hidden aspect-[3/4] rounded-md">
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-red-400 text-white px-3 py-1 text-xs font-semibold z-10">
            NEW
          </span>
        )}
        {!product.isNew && product.isSale && (
          <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 text-xs font-semibold z-10">
            SALE
          </span>
        )}

        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
};

export default ProductCardHome;
