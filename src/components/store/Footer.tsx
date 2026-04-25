'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Globe,
  MessageCircle,
  Play,
} from 'lucide-react';

import { usePathname } from 'next/navigation';
import { CATEGORY_NAV } from '@/data/mock';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const socialIcons = [Globe, MessageCircle, Play];

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Hide footer on profile, order, and auth pages
  if (pathname === '/profile' || pathname.startsWith('/orders') || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/update-password') {
    return null;
  }

  return (
    <footer className="bg-gray-100 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-200 font-sans">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10 w-full">
          {/* LEFT SIDE */}
          <div className="lg:max-w-sm mb-6 sm:mb-0">
            <Link href="/" className="text-2xl font-bold text-gray-800 mb-4 block">
              Flone<span className="text-red-400">.</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              © 2026 Flone.
              <br />
              All Rights Reserved
              <br />
              <br />
              Premium men's fashion for the modern gentleman.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {/* Globe */}
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans">
                <Globe size={16} />
              </a>
              {/* Message */}
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans">
                <MessageCircle size={16} />
              </a>
              {/* Instagram - custom SVG */}
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:border-gray-800 transition-all font-sans group">
                <img src="/insta.svg" alt="Instagram" className="w-4 h-4 invert group-hover:invert-0" />
              </a>
              {/* Play */}
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans">
                <Play size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 lg:gap-20 w-full lg:w-auto">
            <div className="border-b border-gray-200 sm:border-none pb-4 sm:pb-0">
              <h4 
                className="flex items-center justify-between text-sm font-semibold text-gray-800 uppercase tracking-wide mb-0 sm:mb-5 cursor-pointer sm:cursor-default"
                onClick={() => toggleSection('about')}
              >
                ABOUT US
                <span className="sm:hidden text-lg leading-none">{openSection === 'about' ? '−' : '+'}</span>
              </h4>
              <ul className={`space-y-2 list-none p-0 mt-4 sm:mt-0 ${openSection === 'about' ? 'block' : 'hidden'} sm:!block`}>
                {[
                  { label: 'About us', href: '/about' },
                  { label: 'Store location', href: '/contact' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Careers', href: '#' }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-b border-gray-200 sm:border-none pb-4 sm:pb-0">
              <h4 
                className="flex items-center justify-between text-sm font-semibold text-gray-800 uppercase tracking-wide mb-0 sm:mb-5 cursor-pointer sm:cursor-default"
                onClick={() => toggleSection('shop')}
              >
                SHOP
                <span className="sm:hidden text-lg leading-none">{openSection === 'shop' ? '−' : '+'}</span>
              </h4>
              <ul className={`space-y-2 list-none p-0 mt-4 sm:mt-0 ${openSection === 'shop' ? 'block' : 'hidden'} sm:!block`}>
                {CATEGORY_NAV.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.id.toLowerCase()}`} className="text-sm text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider">
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 sm:pt-0">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-5">CONTACT US</h4>
              <ul className="space-y-3 list-none p-0">
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPin size={16} /> 123 Fashion Street, NY 10001
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone size={16} /> +1 234 567 8900
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Mail size={16} /> hello@flone.com
                </li>
              </ul>
              <div className="flex gap-3 mt-5">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((p) => (
                  <div key={p} className="h-6 px-1.5 border border-gray-300 rounded text-[9px] font-bold flex items-center text-gray-400">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
