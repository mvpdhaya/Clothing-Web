import React from 'react';
import Link from 'next/link';
import { ChevronRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#333]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-[1400px] mx-auto px-5">
           <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-bold">Returns & Exchanges</span>
          </nav>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-800">Returns & Exchanges</h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 py-20">
        <div className="text-center mb-20">
          <RotateCcw className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">Hassle-Free Returns</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. If for any reason you're not happy, we're here to help with an easy return and exchange process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="border border-gray-100 p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="text-green-500 w-5 h-5" /> 14-Day Window
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              You have 14 days from the date of delivery to return or exchange your items. All returns must be in their original condition: unworn, unwashed, and with all tags attached.
            </p>
            <ul className="text-xs text-gray-400 font-bold uppercase tracking-widest space-y-2 list-none p-0">
              <li>✓ Original Tags Attached</li>
              <li>✓ Unworn & Unwashed</li>
              <li>✓ Original Packaging</li>
            </ul>
          </div>
          <div className="border border-gray-100 p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
              <Truck className="text-blue-500 w-5 h-5" /> Free Exchanges
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Exchanges are always free! If you need a different size or color, we'll cover the shipping for your new item. For returns, a small restocking fee may apply unless the item is defective.
            </p>
            <Link href="/contact" className="text-red-400 font-bold text-xs uppercase tracking-widest hover:underline transition-all">
              Start an Exchange →
            </Link>
          </div>
        </div>

        <div className="space-y-12">
           <section>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 border-b pb-2">How to Return</h3>
              <div className="space-y-4">
                 {[
                   { step: 1, text: 'Submit a return request via our contact page or your account dashboard.' },
                   { step: 2, text: 'Wait for approval and receive your prepaid shipping label (for eligible returns).' },
                   { step: 3, text: 'Pack your items securely and drop them off at the nearest shipping center.' },
                   { step: 4, text: 'Once received, we will process your refund or exchange within 5-7 business days.' }
                 ].map(item => (
                   <div key={item.step} className="flex gap-4 items-start">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{item.step}</span>
                      <p className="text-gray-600 text-sm">{item.text}</p>
                   </div>
                 ))}
              </div>
           </section>

           <section>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 border-b pb-2">Refund Policy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Refunds will be issued to the original payment method used during purchase. Please note that it may take an additional 3-5 business days for the refund to appear on your statement depending on your bank.
              </p>
           </section>
        </div>

        <div className="mt-20 text-center">
           <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-6">Still have questions?</p>
           <Link href="/contact" className="bg-gray-800 text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-400 transition-colors">
              Contact Concierge
           </Link>
        </div>
      </div>
    </div>
  );
}
