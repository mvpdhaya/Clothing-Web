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
import { useDbStore } from '@/store/dbStore';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  const categoryNav = useDbStore((state) => state.categoryNav);
  const storeSettings = useDbStore((state) => state.storeSettings);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Hide footer on profile, checkout and auth pages
  if (pathname === '/checkout' || pathname === '/profile' || pathname === '/login' || pathname === '/forgot-password' || pathname === '/update-password') {
    return null;
  }
  
  const logoName = storeSettings?.storeName || 'AXZRON';
  const tagline = storeSettings?.storeTagline || "Premium fashion for the modern gentleman.";

  return (
    <footer className="bg-gray-100 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-gray-200 font-sans">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10 w-full">
          {/* LEFT SIDE */}
          <div className="lg:max-w-sm mb-6 sm:mb-0">
            <Link href="/" className="text-2xl font-bold text-gray-800 mb-4 block">
              {logoName}<span className="text-red-400">.</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              © 2026 {logoName}.
              <br />
              All Rights Reserved
              <br />
              <br />
              {tagline}
            </p>

            <div className="flex gap-3 sm:gap-4">
              {storeSettings?.socialLinks?.filter(link => link.active).map((social, idx) => {
                const label = social.label.toLowerCase();
                return (
                  <a 
                    key={idx}
                    href={social.value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans group"
                    title={social.label}
                  >
                    {/* Facebook Icon */}
                    {label.includes('facebook') && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    )}
                    {/* Instagram Icon */}
                    {label.includes('instagram') && (
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    )}
                    {/* Twitter / X Icon */}
                    {(label.includes('twitter') || label === 'x') && (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {/* YouTube Icon */}
                    {label.includes('youtube') && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )}
                    {/* WhatsApp Icon */}
                    {label.includes('whatsapp') && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 2C6.446 2 1.967 6.479 1.967 12.064c0 1.971.564 3.811 1.541 5.367L2 22l4.734-1.243c1.554.848 3.327 1.332 5.21 1.332 5.584 0 10.063-4.479 10.063-10.063C22.094 6.479 17.615 2 12.031 2zm6.208 14.288c-.255.72-1.484 1.305-2.035 1.385-.432.063-.997.108-1.611-.089a8.411 8.411 0 01-3.488-2.072 10.22 10.22 0 01-2.42-3.432c-.371-.823-.621-1.62-.621-2.417 0-1.127.568-1.747 1.077-2.115.176-.127.362-.19.548-.19.186 0 .372.006.529.014.167.008.343.014.509.412.186.449.636 1.543.69 1.658.054.116.09.251.012.406-.078.155-.117.253-.235.39-.117.138-.245.308-.34.42-.11.127-.225.266-.098.484.127.218.566.932 1.214 1.509.833.743 1.533 1.002 1.769 1.13c.23.125.362.106.494-.047.132-.153.568-.66.72-.885.152-.224.303-.19.51-.113.205.077 1.301.613 1.527.726s.377.17.431.263c.054.094.054.544-.202 1.264z" />
                      </svg>
                    )}
                    {/* Pinterest Icon */}
                    {label.includes('pinterest') && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.397 2.965 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C24.012 5.367 18.643 0 12.017 0z" />
                      </svg>
                    )}
                    {/* Default Globe Fallback */}
                    {!['facebook', 'instagram', 'twitter', 'x', 'youtube', 'whatsapp', 'pinterest'].some(s => label.includes(s)) && <Globe size={16} />}
                  </a>
                );
              })}
              
              {/* Fallback if no active social links */}
              {(!storeSettings?.socialLinks || storeSettings.socialLinks.filter(l => l.active && l.value).length === 0) && (
                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans">
                  <Globe size={16} />
                </a>
              )}
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
                  { label: 'Contact', href: '/contact' }
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
                {categoryNav.map((category) => (
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
                  <MapPin size={16} /> {storeSettings?.storeAddress || '123 Boutique Boulevard, Colombo 03'}
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone size={16} /> {storeSettings?.storePhone || '+94 76 212 7588'}
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                  <Mail size={16} /> {storeSettings?.storeEmail || 'hello@axzron.com'}
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
