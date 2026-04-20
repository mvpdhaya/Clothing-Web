'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  User,
  Search,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const navItems = [
    { 
      label: 'CLOTHING', 
      href: '/products',
      hasDropdown: true,
      subcategories: [
        { label: 'All Clothing', href: '/products' },
        { label: 'Shirts', href: '/products?category=Shirts' },
        { label: 'T-Shirts', href: '/products?category=T-Shirts' },
        { label: 'Pants', href: '/products?category=Pants' },
        { label: 'Jeans', href: '/products?category=Jeans' }
      ]
    },
    { 
      label: 'ACCESSORIES', 
      href: '/category/accessories',
      hasDropdown: true,
      subcategories: [
        { label: 'All Accessories', href: '/category/accessories' },
        { label: 'Belts', href: '/category/accessories?type=Belts' },
        { label: 'Watches', href: '/category/accessories?type=Watches' },
        { label: 'Wallets', href: '/category/accessories?type=Wallets' },
        { label: 'Sunglasses', href: '/category/accessories?type=Sunglasses' }
      ]
    },
    { label: 'FLASH SALE', href: '/category/sale', hasDropdown: false }
  ];

  return (
    <>
      {/* Top Bar (Scrolls away) */}
      <div className="overflow-hidden whitespace-nowrap bg-[#0a1628] py-2.5 text-center text-[11px] font-semibold tracking-wide text-white w-full">
        <div className="inline-block animate-[scroll_25s_linear_infinite]">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-block px-10">FREE DELIVERY ON ORDERS ABOVE LKR 13,000/-</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Main Navbar (Sticky) */}
      <header className="sticky top-0 z-50 w-full bg-white font-sans shadow-sm">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Flone<span className="text-red-400">.</span>
          </Link>

          <nav className="hidden md:flex items-center h-full gap-9">
            {navItems.map((item) => (
              <div key={item.label} className="relative group h-full flex items-center">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-red-400 transition-all uppercase tracking-widest"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown size={14} className="text-gray-400 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && (
                  <div className="absolute top-[100%] left-0 w-56 bg-white shadow-xl border border-gray-100 py-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                    {item.subcategories?.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-6 py-2.5 text-[13px] font-medium text-gray-600 hover:text-red-400 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/products" className="text-gray-800 hover:text-red-400 transition-colors">
              <Search size={18} />
            </Link>
            <Link href="/profile" className="text-gray-800 hover:text-red-400 transition-colors">
              <User size={18} />
            </Link>
            <Link href="/cart" className="relative text-gray-800 hover:text-red-400 transition-colors">
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </div>
      </header>
    </>
  );
};

export default Navbar;
