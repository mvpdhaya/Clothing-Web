'use client';

import React from 'react';
import { useDbStore } from '@/store/dbStore';
import { Hammer, MessageCircle, Mail } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  const storeSettings = useDbStore((state) => state.storeSettings);
  const message = storeSettings?.maintenanceMessage || 'Our store is currently under maintenance. We will be back soon!';
  const logoName = storeSettings?.storeName || 'AXZRON';

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-gray-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-blue-50/50 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-2xl w-full">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 uppercase">
            {logoName}<span className="text-red-400">.</span>
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center animate-pulse border border-gray-100">
            <Hammer className="w-10 h-10 text-gray-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Enhancing Your Experience
        </h2>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-lg mx-auto">
          {message}
        </p>

        {/* Social Links / Contact */}
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-gray-200" />
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Get in touch</span>
            <div className="h-px w-12 bg-gray-200" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {storeSettings?.socialLinks?.filter(l => l.active && l.value).map((social, idx) => {
               const label = social.label.toLowerCase();
               return (
                 <a 
                   key={idx}
                   href={social.value}
                   className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                   title={social.label}
                 >
                    {label.includes('instagram') && (
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    )}
                    {label.includes('facebook') && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    )}
                    {label.includes('whatsapp') && <MessageCircle size={18} />}
                    {!['instagram', 'facebook', 'whatsapp'].some(s => label.includes(s)) && <Mail size={18} />}
                 </a>
               );
            })}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-10 text-sm text-gray-400 font-medium">
        &copy; {new Date().getFullYear()} {logoName} LUXURY APPAREL. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};

export default MaintenanceMode;
