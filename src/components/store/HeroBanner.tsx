import React from 'react';
import { Button } from '../ui/Button';

export default function HeroBanner() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
      
      <div className="container relative z-20 px-6">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Elegance in <span className="text-zinc-400">Every Thread</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-lg leading-relaxed">
            Discover our curated collection of premium essentials designed for the modern lifestyle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              Shop Collection
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Lookbook
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
