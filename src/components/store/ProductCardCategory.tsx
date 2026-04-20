'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/data/mock';
import { formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
}

const ProductCardCategory: React.FC<Props> = ({ product }) => {
  const slug = product.name.toLowerCase().replace(/ /g, '-');
  
  return (
    <Link
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
};

export default ProductCardCategory;
