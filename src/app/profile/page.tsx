'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_USER, ORDERS, MOCK_ADDRESSES, Address, PRODUCTS } from '@/data/mock';

/* ─── tiny icon helpers ─── */
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

type Tab = 'profile' | 'orders';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryTab = searchParams.get('tab') as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(queryTab || 'profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [userName, setUserName] = useState(MOCK_USER.name);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (queryTab && (queryTab === 'profile' || queryTab === 'orders')) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  /* edit profile form state */
  const [editFirst, setEditFirst] = useState(userName.split(' ')[0] ?? '');
  const [editLast, setEditLast] = useState(userName.split(' ')[1] ?? '');
  const [editNewsOffers, setEditNewsOffers] = useState(false);

  /* add address form state */
  const [addrFirst, setAddrFirst] = useState('');
  const [addrLast, setAddrLast] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrApt, setAddrApt] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostal, setAddrPostal] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(`${editFirst} ${editLast}`.trim());
    setShowEditProfile(false);
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: addrDefault ? 'Home' : 'Other',
      name: `${addrFirst} ${addrLast}`.trim(),
      line1: addrLine + (addrApt ? `, ${addrApt}` : ''),
      city: addrCity,
      state: '',
      pincode: addrPostal,
      phone: addrPhone,
      isDefault: addrDefault,
    };

    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, ...payload } : a));
    } else {
      const newAddr: Address = {
        id: `addr_${Date.now()}`,
        ...payload,
      };
      setAddresses(prev => [...prev, newAddr]);
    }
    /* reset */
    closeAddressModal();
  };

  const closeAddressModal = () => {
    setAddrFirst(''); setAddrLast(''); setAddrLine(''); setAddrApt('');
    setAddrCity(''); setAddrPostal(''); setAddrPhone(''); setAddrDefault(false);
    setShowAddAddress(false);
    setEditingAddress(null);
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    const names = addr.name.split(' ');
    setAddrFirst(names[0] || '');
    setAddrLast(names.slice(1).join(' ') || '');
    const lines = addr.line1.split(', ');
    setAddrLine(lines[0] || '');
    setAddrApt(lines[1] || '');
    setAddrCity(addr.city);
    setAddrPostal(addr.pincode);
    setAddrPhone(addr.phone);
    setAddrDefault(addr.isDefault);
    setShowAddAddress(true);
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      {/* ── MODAL: Edit Profile ── */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-[22px] font-semibold mb-6">Edit profile</h2>
            <form onSubmit={saveProfile}>
              <div className="flex gap-3.5 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="First name"
                    value={editFirst}
                    onChange={e => setEditFirst(e.target.value)}
                    className="w-full px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Last name"
                    value={editLast}
                    onChange={e => setEditLast(e.target.value)}
                    className="w-full px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-[#888] mb-1.5">Email</label>
                <input
                  type="email"
                  value={MOCK_USER.email}
                  readOnly
                  className="w-full px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none bg-[#fafafa] text-gray-500"
                />
              </div>
              <div className="flex items-center gap-2.5 my-4">
                <input
                  type="checkbox"
                  id="news-offers"
                  checked={editNewsOffers}
                  onChange={e => setEditNewsOffers(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
                />
                <label htmlFor="news-offers" className="text-[14px] text-[#333] cursor-pointer">
                  Email me with news and offers
                </label>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-5 py-2.5 border border-[#ccc] rounded-lg text-[14px] font-medium bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-[14px] font-medium hover:bg-[#333] transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Address ── */}
      {showAddAddress && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55"
          onClick={() => setShowAddAddress(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-[22px] font-semibold mb-6">{editingAddress ? 'Edit address' : 'Add address'}</h2>
            <form onSubmit={saveAddress}>
              {/* Country */}
              <div className="mb-4">
                <div className="w-full px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block text-xs text-[#888] mb-0.5">Country/region</span>
                    <span className="text-black">Sri Lanka</span>
                  </div>
                  <ChevronDownIcon />
                </div>
              </div>

              <div className="flex gap-3.5 mb-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={addrFirst}
                  onChange={e => setAddrFirst(e.target.value)}
                  className="flex-1 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={addrLast}
                  onChange={e => setAddrLast(e.target.value)}
                  className="flex-1 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={addrLine}
                onChange={e => setAddrLine(e.target.value)}
                className="w-full mb-4 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc (optional)"
                value={addrApt}
                onChange={e => setAddrApt(e.target.value)}
                className="w-full mb-4 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
              />

              <div className="flex gap-3.5 mb-4">
                <input
                  type="text"
                  placeholder="City"
                  value={addrCity}
                  onChange={e => setAddrCity(e.target.value)}
                  className="flex-1 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={addrPostal}
                  onChange={e => setAddrPostal(e.target.value)}
                  className="flex-1 px-4 py-3.5 border border-[#ddd] rounded-lg text-[15px] outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-xs text-[#888] mb-1.5">Phone</label>
                <div className="flex items-center border border-[#ddd] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-3.5 border-r border-[#ddd] flex-shrink-0">
                    <span className="text-[13px] text-[#555]">+94</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-[15px] outline-none border-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 my-4">
                <input
                  type="checkbox"
                  id="default-addr"
                  checked={addrDefault}
                  onChange={e => setAddrDefault(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
                />
                <label htmlFor="default-addr" className="text-[14px] text-[#333] cursor-pointer">
                  This is my default address
                </label>
              </div>

              <div className="flex justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-5 py-2.5 border border-[#ccc] rounded-lg text-[14px] font-medium bg-white hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-[14px] font-medium hover:bg-[#333] transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAGE SHELL ── */}
      <div className="min-h-screen bg-white text-black pb-20">


        {/* ── MAIN ── */}
        <div className="max-w-[1100px] mx-auto px-20 pt-12 pb-20">

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              <h1 className="text-[28px] font-semibold mb-8">Profile</h1>

              {/* Info card */}
              <div className="bg-white border border-[#eee] rounded-xl p-7 mb-4">
                <div className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="block text-[14px] text-[#888] mb-1">Name</span>
                      <span className="text-[15px] text-black">{userName || '—'}</span>
                    </div>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="ml-1 text-[#333] hover:text-black transition-colors cursor-pointer bg-transparent border-none p-1"
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
                <div className="py-2.5 mt-3">
                  <span className="block text-[14px] text-[#888] mb-1">Email</span>
                  <span className="text-[15px] text-black">{MOCK_USER.email}</span>
                </div>
              </div>

              {/* Addresses card */}
              <div className="bg-white border border-[#eee] rounded-xl p-7 mb-4">
                <div className="flex items-center gap-6 mb-5">
                  <h3 className="text-[16px] font-semibold">Addresses</h3>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-1 text-[15px] font-medium text-black bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <span>+</span> Add
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="flex items-center gap-2.5 p-5 border border-[#e5e5e5] rounded-xl text-[#666] text-[14px]">
                    <span className="text-[#999] flex-shrink-0"><InfoIcon /></span>
                    <span>No addresses added</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="flex items-start justify-between p-5 border border-[#eee] rounded-xl hover:border-[#ddd] transition-colors bg-white">
                        <div className="text-[14px] leading-relaxed text-[#333]">
                          <div className="font-semibold text-black mb-1 flex items-center gap-2">
                            {addr.label}
                            {addr.isDefault && (
                              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                            )}
                          </div>
                          <div className="font-medium text-black">{addr.name}</div>
                          <div className="text-[#666]">{addr.line1}</div>
                          <div className="text-[#666]">{addr.city}{addr.pincode ? `, ${addr.pincode}` : ''}</div>
                          {addr.phone && <div className="text-[#666] mt-1 text-[13px] italic">{addr.phone}</div>}
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <button 
                            onClick={() => startEditAddress(addr)}
                            className="w-8 h-8 flex items-center justify-center text-[#333] hover:text-black transition-colors cursor-pointer rounded-lg hover:bg-gray-100 group"
                            title="Edit Address"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={() => removeAddress(addr.id)}
                            className="w-8 h-8 flex items-center justify-center text-[#999] hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50 group"
                            title="Remove Address"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign out */}
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-block px-5 py-2.5 border border-[#ccc] rounded-lg bg-white text-[14px] text-black hover:bg-[#f5f5f5] transition-colors"
                >
                  Sign out
                </Link>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-[28px] font-semibold mb-8">Orders</h1>

              {ORDERS.length === 0 ? (
                <div className="border border-[#eee] rounded-xl py-16 text-center">
                  <h3 className="text-[18px] font-semibold mb-2">No orders yet</h3>
                  <p className="text-[15px] text-[#666]">Go to store to place an order.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {ORDERS.map(order => (
                    <div key={order.id} className="border border-[#eee] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* header row */}
                      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#fafafa] border-b border-[#eee]">
                        <div className="flex flex-wrap gap-8 text-[12px]">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#888] mb-0.5">Order ID</p>
                            <p className="font-bold text-black">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#888] mb-0.5">Date</p>
                            <p className="font-semibold text-black">{order.date}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#888] mb-0.5">Total</p>
                            <p className="font-bold text-black">Rs {order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#888] mb-0.5">Items</p>
                            <p className="font-semibold text-black">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                      {/* Ordered Images */}
                      <div className="px-6 py-4 flex flex-wrap gap-4 border-t border-[#f5f5f5] bg-white">
                        {order.items.slice(0, 5).map((item, idx) => {
                          const product = PRODUCTS.find(p => p.id === item.productId);
                          if (!product) return null;
                          return (
                            <Link 
                              key={idx} 
                              href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`} 
                              className="block relative w-16 h-20 rounded-xl overflow-hidden bg-white border border-[#eee] transition-all hover:scale-105 hover:shadow-md"
                            >
                              <img src={product.images[0]} alt="" className="object-cover w-full h-full" />
                            </Link>
                          );
                        })}
                        {order.items.length > 5 && (
                          <Link href={`/orders/${order.id}`} className="w-16 h-20 flex flex-col items-center justify-center bg-[#fafafa] border border-[#eee] rounded-xl text-[11px] font-bold text-[#999] hover:bg-gray-100 transition-colors">
                            <span>+{order.items.length - 5}</span>
                            <span className="text-[9px] uppercase tracking-tighter">More</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER LINKS ── */}
      <div className="bg-white border-t border-[#ddd]">
        <div className="max-w-[1100px] mx-auto px-20 py-6 flex gap-5">
          <Link href="/returns"  className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Refund policy</Link>
          <Link href="/privacy"  className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Privacy policy</Link>
          <Link href="/terms"    className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Terms of service</Link>
        </div>
      </div>
    </>
  );
}
