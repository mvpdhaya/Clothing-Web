'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem() {
  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-24 bg-zinc-100 rounded-md overflow-hidden flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium">Product Name</h3>
          <p className="text-sm text-zinc-500">Size: M | Color: Black</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <button className="p-1 hover:bg-zinc-100"><Minus className="w-3 h-3" /></button>
            <span className="px-2 text-sm">1</span>
            <button className="p-1 hover:bg-zinc-100"><Plus className="w-3 h-3" /></button>
          </div>
          <button className="text-zinc-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="font-semibold">$0.00</div>
    </div>
  );
}
