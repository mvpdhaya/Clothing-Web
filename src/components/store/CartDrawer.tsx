'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';

export default function CartDrawer() {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-full">
      <div className="p-6 flex items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        <button className="p-2 hover:bg-zinc-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-zinc-500 text-center mt-10">Your cart is empty.</p>
      </div>

      <div className="p-6 border-t bg-zinc-50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-zinc-600">Subtotal</span>
          <span className="font-semibold">$0.00</span>
        </div>
        <Button className="w-full" size="lg">Checkout</Button>
      </div>
    </div>
  );
}
