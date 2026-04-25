'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CATEGORY_NAV } from '@/data/mock';
import { useCartStore } from '@/store/cartStore';

const Navbar: React.FC = () => {
  const { cartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isAccountSection = pathname === '/profile' || pathname.startsWith('/orders/');
  const activeTab = searchParams.get('tab') || 'profile';

  const totalItems = mounted ? cartCount() : 0;

  // Hide Navbar on auth pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/update-password') {
    return null;
  }

  const navItems = CATEGORY_NAV.map(cat => ({
    label: cat.label.toUpperCase(),
    href: cat.id === 'Flash Sale' ? '/category/Flash Sale' : `/category/${cat.id.toLowerCase()}`,
    hasDropdown: cat.subcategories.length > 0,
    subcategories: cat.subcategories.map(sub => ({
      label: sub.label,
      href: sub.id === `All ${cat.label}` ? `/category/${cat.id.toLowerCase()}` : `/products?subcategory=${sub.id}`
    }))
  }));

  return (
    <>
      {/* Top Bar (Scrolls away) */}
      <div className="overflow-hidden whitespace-nowrap bg-[#0a1628] py-1.5 text-center text-[11px] font-semibold tracking-wide text-white w-full">
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
          <div className="flex items-center h-[72px]">
            {/* Left: Logo */}
            <div className="flex-1">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                Flone<span className="text-red-400">.</span>
              </Link>
            </div>

            {/* Center: Nav Items (desktop only) */}
            <nav className="hidden md:flex items-center h-full gap-9">
              {isAccountSection ? (
                <>
                  <Link
                    href="/profile?tab=orders"
                    className={`text-sm font-semibold transition-all uppercase tracking-widest ${
                      activeTab === 'orders' || pathname.startsWith('/orders/')
                        ? 'text-red-400'
                        : 'text-gray-800 hover:text-red-400'
                    }`}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/profile?tab=profile"
                    className={`text-sm font-semibold transition-all uppercase tracking-widest ${
                      activeTab === 'profile' && !pathname.startsWith('/orders/')
                        ? 'text-red-400'
                        : 'text-gray-800 hover:text-red-400'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                navItems.map((item) => (
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
                        {item.subcategories?.map((sub, idx) => (
                          <Link
                            key={`${sub.label}-${idx}`}
                            href={sub.href}
                            className="block px-6 py-2.5 text-[13px] font-medium text-gray-600 hover:text-red-400 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </nav>

            {/* Right: Actions */}
            <div className="flex-1 flex justify-end items-center gap-4">
              {!isAccountSection && (
                <div className="hidden md:flex items-center gap-5">
                  <Link href="/search" className="text-gray-800 hover:text-red-400 transition-colors">
                    <Search size={18} />
                  </Link>
                  <Link href="/profile" className="text-gray-800 hover:text-red-400 transition-colors">
                    <User size={18} />
                  </Link>
                  <Link href="/cart" className="relative text-gray-800 hover:text-red-400 transition-colors">
                    <ShoppingBag size={18} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* Mobile: cart + hamburger */}
              <div className="flex md:hidden items-center gap-4">
                {!isAccountSection && (
                  <Link href="/cart" className="relative text-gray-800 hover:text-red-400 transition-colors">
                    <ShoppingBag size={20} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-800 hover:text-red-400 transition-colors p-1"
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/" className="text-xl font-bold text-gray-800" onClick={() => setMenuOpen(false)}>
            Flone<span className="text-red-400">.</span>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <nav className="overflow-y-auto h-[calc(100%-140px)]">
          {isAccountSection ? (
            <div className="px-6 py-4 space-y-1">
              <Link
                href="/profile?tab=orders"
                className="block py-3 text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-red-400 transition-colors border-b border-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/profile?tab=profile"
                className="block py-3 text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-red-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          ) : (
            <div className="px-6 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-gray-50 last:border-0">
                  <Link
                    href={item.href}
                    className="block py-3.5 text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-red-400 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.hasDropdown && item.subcategories && (
                    <div className="pl-4 pb-2 space-y-1">
                      {item.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          className="block py-2 text-[13px] text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 px-6 py-5 flex items-center gap-6 bg-white">
          <Link href="/search" className="text-gray-700 hover:text-red-400 transition-colors" onClick={() => setMenuOpen(false)}>
            <Search size={20} />
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-red-400 transition-colors" onClick={() => setMenuOpen(false)}>
            <User size={20} />
          </Link>
          <Link href="/cart" className="relative text-gray-700 hover:text-red-400 transition-colors" onClick={() => setMenuOpen(false)}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
