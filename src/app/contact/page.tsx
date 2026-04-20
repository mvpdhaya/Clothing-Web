import React from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#333]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-[1400px] mx-auto px-5">
           <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-bold">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-800">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Get in Touch</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Name</label>
                  <input type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-red-400 outline-none transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email</label>
                  <input type="email" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-red-400 outline-none transition-colors" placeholder="Your email" />
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Subject</label>
                <input type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-red-400 outline-none transition-colors" placeholder="Special Request, Inquiry, etc." />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Message</label>
                <textarea rows={6} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-red-400 outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button className="bg-gray-800 text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-400 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Store Information</h2>
            <div className="space-y-10">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-red-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-widest mb-2">Location</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">123 Fashion Street, Suit 456<br />New York, NY 10001, USA</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="text-red-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-widest mb-2">Phone</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">+1 (234) 567-8900<br />Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-red-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-widest mb-2">Email</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">hello@flone.com<br />support@flone.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 h-[300px] w-full bg-gray-100 rounded-lg overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
                  Map Placeholder
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
