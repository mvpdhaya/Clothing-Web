import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#333]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-[1400px] mx-auto px-5">
           <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-bold">About Us</span>
          </nav>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-800">About Us</h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
              alt="Team working" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 uppercase tracking-wider">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2026, Flone was born out of a passion for timeless style and modern elegance. We believe that fashion should be a reflection of one's personality—refined, confident, and effortless.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our journey started with a simple goal: to provide high-quality, sustainably sourced menswear that doesn't compromise on design or comfort. Today, we are proud to serve a community of modern gentlemen who appreciate the finer things in life.
            </p>
          </div>
        </div>

        <div className="text-center bg-gray-50 p-12 rounded-2xl mb-20">
          <h2 className="text-3xl font-bold mb-6 uppercase tracking-wider">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto italic border-l-4 border-red-400 pl-6 text-xl">
            "To empower individuals through fashion that inspires confidence and reflects their true selves, while maintaining an unwavering commitment to quality and ethical craftsmanship."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { title: 'Quality', desc: 'We source only the finest fabrics to ensure durability and comfort.' },
            { title: 'Sustainability', desc: 'Our practices focus on reducing waste and ethical production.' },
            { title: 'Innovation', desc: 'Constantly evolving our designs to meet the needs of the modern world.' }
          ].map(item => (
            <div key={item.title}>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-widest text-red-400">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
