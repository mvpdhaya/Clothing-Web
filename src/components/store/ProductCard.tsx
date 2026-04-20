'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/data/mock';
import { cn, formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const slug = product.name.toLowerCase().replace(/ /g, '-');
  const installmentPrice = Math.round(product.price / 3);

  return (
    <div className="group bg-[#f5f5f5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer font-sans rounded-lg">
      <Link href={`/product/${slug}`}>
        <div className="relative bg-gray-100 overflow-hidden aspect-[3/4] rounded-lg">
          {/* Badge */}
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


          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        </div>
      </Link>

      <div className="p-5 text-center bg-[#f5f5f5]">
        <Link href={`/product/${slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide min-h-[40px] flex items-center justify-center leading-tight hover:text-red-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="text-base font-semibold text-gray-800 mt-2">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2 leading-relaxed">
          or pay in 3 x <strong className="text-gray-600">{formatPrice(installmentPrice)}</strong>
          <br />
          with KOKO
        </div>
      </div>
    </div>
  );
}

