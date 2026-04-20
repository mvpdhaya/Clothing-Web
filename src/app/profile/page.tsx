'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { ORDERS, PRODUCTS, MOCK_USER } from '@/data/mock';
import { cn, formatPrice } from '@/lib/utils';
import Image from 'next/image';
import {
  User, ShoppingBag, MapPin, Heart,
  Settings, RotateCcw
} from 'lucide-react';

const MENU = [
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
  const [tab, setTab] = useState('orders');

  return (
    <div className="min-h-screen bg-white font-sans text-brand-black pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        <div className="mb-16">
          <nav aria-label="Breadcrumb" className="flex text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link className="hover:text-brand-black transition-colors" href="/">Home</Link></li>
              <li><span className="px-2">/</span></li>
              <li><span className="text-brand-black">Account</span></li>
            </ol>
          </nav>
          <h1 className="text-6xl md:text-7xl font-bold font-serif italic mb-3 tracking-tight leading-none">
            My Account
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="flex flex-col items-start mb-12">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 relative bg-gray-100 flex items-center justify-center">
                {MOCK_USER.avatar ? (
                  <Image src={MOCK_USER.avatar} alt={MOCK_USER.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-brand-black">{MOCK_USER.name}</h3>
              <p className="text-[11px] text-gray-500 mt-1 tracking-widest uppercase">{MOCK_USER.email}</p>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Menu</h4>
              {MENU.map((item) => {
                const isActive = tab === item.id && !item.href;
                const linkClass = cn(
                  "flex items-center text-sm transition-transform hover:translate-x-1",
                  isActive ? "text-brand-black font-bold underline underline-offset-4" : "text-gray-500"
                );
                
                return item.href ? (
                  <Link key={item.id} href={item.href} className={linkClass}>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button key={item.id} onClick={() => setTab(item.id)} className={cn(linkClass, "text-left")}>
                    <span>{item.label}</span>
                  </button>
                )
              })}
              
              <div className="pt-8 mt-8 border-t border-gray-100">
                 <button className="flex items-center text-[11px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 underline underline-offset-4 transition-colors">
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-grow min-w-0">
            {/* Orders Tab */}
            {tab === 'orders' && (
              <div>
                <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-serif italic font-bold">Order History</h2>
                  <span className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">{ORDERS.length} orders</span>
                </div>

                <div className="space-y-16">
                  {ORDERS.map(order => {
                    const orderProducts = order.items.map(item => PRODUCTS.find(p => p.id === item.productId)).filter(Boolean);
                    
                    let statusColorClasses = "text-gray-500 border-gray-200";
                    if (order.status === 'Delivered') {
                      statusColorClasses = "text-brand-black border-brand-black bg-brand-black text-white";
                    } else if (order.status === 'Shipped') {
                      statusColorClasses = "text-brand-black border-brand-black";
                    }

                    return (
                      <div key={order.id} className="group border border-gray-100 p-8 rounded-sm hover:border-gray-300 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                          <div className="flex flex-wrap gap-12">
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Order ID</p>
                              <p className="text-sm font-bold tracking-wider">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Date</p>
                              <p className="text-sm tracking-wider">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Total</p>
                              <p className="text-sm tracking-wider">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                          <div>
                            <span className={cn("inline-flex items-center px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border", statusColorClasses)}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-6 mb-8">
                            {orderProducts.map(p => p && (
                              <Link href={`/product/${p.name.toLowerCase().replace(/ /g, '-')}`} key={p.id} className="flex flex-col gap-3 group/item">
                                <div className="w-20 aspect-[3/4] bg-gray-50 rounded-sm overflow-hidden relative border border-gray-100">
                                  <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover/item:scale-105" sizes="80px" />
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate w-20 text-center group-hover/item:text-brand-black transition-colors" title={p.name}>{p.name}</span>
                              </Link>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
                            <button className="bg-brand-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
                              {order.status === 'Shipped' ? 'Track Order' : 'View Details'}
                            </button>
                            {order.status === 'Delivered' && (
                              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-brand-black transition-colors underline underline-offset-4">
                                Buy Again
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <div>
                <h2 className="text-2xl font-serif italic font-bold mb-12 border-b border-gray-100 pb-4">Profile Settings</h2>
                <div className="max-w-2xl">
                  <div className="flex items-center gap-8 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {MOCK_USER.avatar ? (
                         <Image src={MOCK_USER.avatar} alt={MOCK_USER.name} fill className="object-cover" sizes="96px" />
                      ) : (
                         <User strokeWidth={1.5} className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <button className="text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2 border border-brand-black hover:bg-brand-black hover:text-white transition-colors">
                        Change Photo
                      </button>
                      <p className="text-[10px] text-gray-500 mt-3 tracking-widest uppercase">Member since Jan 2024</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                    {[
                      { label: 'First Name', val: MOCK_USER.name.split(' ')[0] },
                      { label: 'Last Name', val: MOCK_USER.name.split(' ').slice(1).join(' ') },
                      { label: 'Email', val: MOCK_USER.email, full: true },
                      { label: 'Phone', val: MOCK_USER.phone, full: true },
                    ].map(f => (
                      <div key={f.label} className={cn('relative', f.full && 'sm:col-span-2')}>
                        <input 
                          id={`input-${f.label}`}
                          type="text"
                          className="peer w-full border-b border-gray-200 bg-transparent px-0 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors placeholder-transparent" 
                          defaultValue={f.val} 
                          placeholder={f.label}
                        />
                        <label 
                          htmlFor={`input-${f.label}`}
                          className="absolute left-0 -top-4 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:-top-4 peer-focus:text-[9px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-focus:text-brand-black"
                        >
                          {f.label}
                        </label>
                      </div>
                    ))}
                    
                    <div className="sm:col-span-2 pt-8">
                       <button className="bg-brand-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors w-full sm:w-auto">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs */}
            {!['orders', 'profile'].includes(tab) && (
              <div className="flex flex-col items-center justify-center py-32 text-center font-sans border border-gray-100 rounded-sm">
                <Settings strokeWidth={1} className="w-10 h-10 text-gray-300 mb-6" />
                <p className="font-serif italic text-2xl text-gray-400 mb-2">Coming Soon</p>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">This section is under construction</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
