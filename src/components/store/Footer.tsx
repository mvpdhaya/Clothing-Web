'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Camera,
  Globe,
  MessageCircle,
  Play,
} from 'lucide-react';

const Footer: React.FC = () => {
  const socialIcons = [Globe, MessageCircle, Camera, Play];

  return (
    <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200 font-sans">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div>
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
            <div className="flex gap-4">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all font-sans"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-5">ABOUT US</h4>
            <ul className="space-y-2 list-none p-0">
              {[
                { label: 'About us', href: '/about' },
                { label: 'Store location', href: '/contact' },
                { label: 'Contact', href: '/contact' },
                { label: 'Orders tracking', href: '/orders' },
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

          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-5">USEFUL LINKS</h4>
            <ul className="space-y-2 list-none p-0">
              {[
                { label: 'Returns', href: '/returns' },
                { label: 'Support Policy', href: '/contact' },
                { label: 'Size guide', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Privacy Policy', href: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-5">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 list-none p-0">
              {[
                { label: 'My Account', href: '/profile' },
                { label: 'Order History', href: '/orders' },
                { label: 'Newsletter', href: '#' },
                { label: 'Gift Cards', href: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
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
    </footer>
  );
};

export default Footer;
