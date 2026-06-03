'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDbStore } from '@/store/dbStore';

import { supabase } from '@/lib/supabase/client';
import { X, Truck } from 'lucide-react';







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

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryTab = searchParams.get('tab') as Tab | null;
  const allProducts = useDbStore((state) => state.products);

    const [activeTab, setActiveTab] = useState<Tab>(queryTab || 'profile');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setUser(user);

      const { data: custData } = await supabase.from('customers').select('*').eq('id', user.id).maybeSingle();
      if (custData) {
        setCustomer(custData);
        const names = (custData.full_name || '').split(' ');
        setEditFirst(names[0] || '');
        setEditLast(names.slice(1).join(' ') || '');
      } else {
        // Fallback for users created before our Database Trigger existed
        const metaName = user.user_metadata?.name || user.user_metadata?.full_name || '';
        const names = metaName.split(' ');
        setCustomer({ full_name: metaName });
        setEditFirst(names[0] || '');
        setEditLast(names.slice(1).join(' ') || '');
      }
      
      const { data: addrData } = await supabase.from('addresses').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
      if (addrData) setAddresses(addrData);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (ordersData) setOrders(ordersData);
      
      setLoading(false);
    }
    loadData();
  }, [router]);

    useEffect(() => {
    if (queryTab && (queryTab === 'profile' || queryTab === 'orders')) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  /* edit profile form state */
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      setSelectedOrder((prev: any) => prev?.id === orderId ? { ...prev, status: 'Cancelled' } : prev);
      
      setIsCancelConfirmOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      customer_id: user.id,
      label: addrDefault ? 'Home' : 'Other',
      full_name: `${addrFirst} ${addrLast}`.trim(),
      phone: addrPhone,
      line1: addrLine + (addrApt ? `, ${addrApt}` : ''),
      city: addrCity,
      postal_code: addrPostal,
      is_default: addrDefault,
    };

    if (editingAddress) {
      if (addrDefault) await supabase.from('addresses').update({ is_default: false }).eq('customer_id', user.id);
      const { data } = await supabase.from('addresses').update(payload).eq('id', editingAddress.id).select().single();
      if (data) {
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? data : (addrDefault ? { ...a, is_default: false } : a)));
      }
    } else {
      if (addrDefault) await supabase.from('addresses').update({ is_default: false }).eq('customer_id', user.id);
      const { data } = await supabase.from('addresses').insert([payload]).select().single();
      if (data) {
        setAddresses(prev => [data, ...(addrDefault ? prev.map(a => ({...a, is_default: false})) : prev)]);
      }
    }
    closeAddressModal();
  };

  const fetchOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setIsLoadingOrder(true);
    
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (error) throw error;
      setOrderItems(data || []);
    } catch (err) {
      console.error('Error fetching order items:', err);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedOrder(null);
      setOrderItems([]);
    }, 300);
  };

  const closeAddressModal = () => {
    setAddrFirst(''); setAddrLast(''); setAddrLine(''); setAddrApt('');
    setAddrCity(''); setAddrPostal(''); setAddrPhone(''); setAddrDefault(false);
    setShowAddAddress(false);
    setEditingAddress(null);
  };

  const startEditAddress = (addr: any) => {
    setEditingAddress(addr);
    const names = (addr.full_name || '').split(' ');
    setAddrFirst(names[0] || '');
    setAddrLast(names.slice(1).join(' ') || '');
    const lines = (addr.line1 || '').split(', ');
    setAddrLine(lines[0] || '');
    setAddrApt(lines[1] || '');
    setAddrCity(addr.city || '');
    setAddrPostal(addr.postal_code || '');
    setAddrPhone(addr.phone || '');
    setAddrDefault(addr.is_default || false);
    setShowAddAddress(true);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const fullName = `${editFirst} ${editLast}`.trim();
    const { data } = await supabase.from('customers').update({ full_name: fullName }).eq('id', user.id).select().single();
    if (data) setCustomer(data);
    setShowEditProfile(false);
  };

  const removeAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 mx-4"
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
                  value={user?.email || ''}
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 mx-4"
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
        {loading ? <div className='py-20 text-center text-gray-500'>Loading profile...</div> : (
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 md:px-20 pt-12 pb-20">

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
                      <span className="text-[15px] text-black">{customer?.full_name || '—'}</span>
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
                  <span className="text-[15px] text-black">{user?.email || ''}</span>
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
                            {addr.is_default && (
                              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                            )}
                          </div>
                          <div className="font-medium text-black">{addr.full_name}</div>
                          <div className="text-[#666]">{addr.line1}</div>
                          <div className="text-[#666]">{addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}</div>
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
                <button
                  onClick={handleSignOut}
                  className="inline-block px-5 py-2.5 border border-[#ccc] rounded-lg bg-white text-[14px] text-black hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-[28px] font-semibold mb-8">Orders</h1>

              {orders.length === 0 ? (
                <div className="border border-[#eee] rounded-xl py-16 text-center">
                  <h3 className="text-[18px] font-semibold mb-2">No orders yet</h3>
                  <p className="text-[15px] text-[#666]">Go to store to place an order.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map(order => {
                    const itemsArr: any[] = Array.isArray(order.items) ? order.items : [];
                    const orderDate = order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—';
                    const orderTotal = order.total_amount ?? order.total ?? 0;
                    return (
                    <div 
                      key={order.id} 
                      onClick={() => fetchOrderDetails(order)}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all duration-300 overflow-hidden mb-4 cursor-pointer group/card"
                    >
                      {/* header row */}
                      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100">
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Order ID</p>
                            <p className="text-sm font-bold text-gray-900">#{order.id.toString().toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Date</p>
                            <p className="text-sm font-semibold text-gray-700">{orderDate}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Total Amount</p>
                            <p className="text-sm font-bold text-gray-900">Rs {Number(orderTotal).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Mini Countdown Timer */}
                        {(() => {
                          if (!order.created_at) return null;
                          const orderCreatedAt = new Date(order.created_at).getTime();
                          const now = new Date().getTime();
                          const diffMs = now - orderCreatedAt;
                          const oneHourMs = 60 * 60 * 1000;
                          const status = (order.status || 'Pending').toLowerCase();
                          const isCancelable = diffMs < oneHourMs && (status === 'processing' || status === 'pending');

                          if (isCancelable) {
                            return <MiniCancellationTimer order={order} />;
                          }
                          return null;
                        })()}
                        
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                            order.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            order.status?.toLowerCase() === 'processing' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            order.status?.toLowerCase() === 'cancelled' || order.status?.toLowerCase() === 'canceled' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-gray-50 text-gray-600 border border-gray-100'
                          }`}>
                            {order.status || 'Processing'}
                          </div>
                        </div>
                      </div>

                      {/* Items preview */}
                      {itemsArr.length > 0 && (
                        <div className="px-6 py-5 flex flex-wrap items-center gap-4 bg-white">
                          <div className="flex flex-wrap gap-4">
                            {itemsArr.slice(0, 5).map((item: any, idx: number) => {
                              const product = allProducts.find(p => p.id === item.productId || p.id === item.product_id);
                              if (!product) return (
                                <div key={idx} className="w-16 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                                  Item
                                </div>
                              );
                              return (
                                <Link
                                  key={idx}
                                  href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                  className="group relative w-16 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                  <img src={product.images[0]} alt="" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                </Link>
                              );
                            })}
                            {itemsArr.length > 5 && (
                              <div className="w-16 h-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl text-gray-400">
                                <span className="text-sm font-bold text-gray-600">+{itemsArr.length - 5}</span>
                                <span className="text-[9px] uppercase tracking-tighter font-bold">More</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-auto hidden sm:block">
                            <p className="text-[11px] text-gray-400 font-medium">
                              {itemsArr.length} {itemsArr.length === 1 ? 'item' : 'items'} in this order
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
          )}
      </div>

      {/* ── ORDER DETAILS MODAL ── */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
            onClick={closeDetailModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Cancellation Timer Logic */}
            {(() => {
              if (!selectedOrder.created_at) return null;
              
              const orderCreatedAt = new Date(selectedOrder.created_at).getTime();
              const now = new Date().getTime();
              const diffMs = now - orderCreatedAt;
              const oneHourMs = 60 * 60 * 1000;
              
              // If status is null/undefined, it's considered 'Pending'
              const status = (selectedOrder.status || 'Pending').toLowerCase();
              const isCancelable = diffMs < oneHourMs && (status === 'processing' || status === 'pending');

              if (isCancelable) {
                return <CancellationBanner order={selectedOrder} onCancel={() => setIsCancelConfirmOpen(true)} />;
              }
              return null;
            })()}

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-none">Order Details</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">#{selectedOrder.id.toString().toUpperCase()}</p>
              </div>
              <button 
                onClick={closeDetailModal}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Status & Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      selectedOrder.status?.toLowerCase() === 'delivered' ? 'bg-emerald-500' :
                      selectedOrder.status?.toLowerCase() === 'processing' ? 'bg-amber-500' :
                      selectedOrder.status?.toLowerCase() === 'cancelled' || selectedOrder.status?.toLowerCase() === 'canceled' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.status || 'Pending'}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="text-sm font-bold text-gray-900 uppercase">{selectedOrder.payment || 'N/A'}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-2 border-red-400 pl-3">Items Ordered</h4>
                {isLoadingOrder ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-16 h-20 bg-gray-50 rounded-xl" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-50 rounded w-3/4" />
                          <div className="h-3 bg-gray-50 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 group">
                        <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:shadow-md transition-shadow duration-300">
                          <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[14px] font-bold text-gray-900 truncate mb-0.5">{item.product_name}</h5>
                          <p className="text-[12px] text-gray-500 font-medium">
                            {item.selected_color ? `${item.selected_color} / ` : ''}{item.selected_size}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] font-bold bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100/50">x{item.quantity}</span>
                            <span className="text-[13px] font-bold text-gray-900">Rs {Number(item.price).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-black text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {orderItems.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-sm font-medium italic">No item details available.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Info */}
              <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-blue-900 mb-1">Delivery Information</h5>
                    <p className="text-[12px] text-blue-700 leading-relaxed">
                      Your order is estimated to arrive within <span className="font-bold underline decoration-blue-300 underline-offset-2">3-5 business days</span>. 
                      Tracking details will be sent once dispatched.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Footer */}
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between space-y-1">
                <p className="text-sm font-bold text-gray-900">Total Amount</p>
                <p className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
                  Rs {Number(selectedOrder.total_amount ?? selectedOrder.total ?? 0).toLocaleString()}
                </p>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER LINKS ── */}
      <div className="bg-white border-t border-[#ddd]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 md:px-20 py-6 flex gap-5">

          <Link href="/privacy"  className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Privacy policy</Link>
          <Link href="/terms"    className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Terms of service</Link>
        </div>
      </div>
      {/* ── MODAL: Cancellation Confirmation ── */}
      {isCancelConfirmOpen && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsCancelConfirmOpen(false)} />
          <div className="relative bg-white w-full max-w-[400px] rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in fade-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cancel Order?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleCancelOrder(selectedOrder.id)}
                className="w-full py-4 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-colors shadow-lg active:scale-95"
              >
                Yes, Cancel Order
              </button>
              <button 
                onClick={() => setIsCancelConfirmOpen(false)}
                className="w-full py-4 bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST: Success Notification ── */}
      {showSuccessToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-2 duration-500">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-sm font-bold tracking-wide">Order canceled successfully!</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Order Cancellation Banner ── */
function CancellationBanner({ order, onCancel }: { order: any; onCancel: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const orderCreatedAt = new Date(order.created_at).getTime();
      const now = new Date().getTime();
      const diffMs = now - orderCreatedAt;
      const oneHourMs = 60 * 60 * 1000;
      const remainingMs = oneHourMs - diffMs;

      if (remainingMs <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (timeLeft === '00:00') return null;

  return (
    <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-red-900 leading-none">Cancel order before window closes</p>
          <p className="text-[11px] text-red-600 font-medium mt-1">Time remaining: <span className="font-bold tabular-nums">{timeLeft}</span></p>
        </div>
      </div>
      <button 
        onClick={onCancel}
        className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors shadow-sm active:scale-95"
      >
        Cancel Order
      </button>
    </div>
  );
}

/* ── Mini Order Cancellation Timer for List ── */
function MiniCancellationTimer({ order }: { order: any }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const orderCreatedAt = new Date(order.created_at).getTime();
      const now = new Date().getTime();
      const diffMs = now - orderCreatedAt;
      const oneHourMs = 60 * 60 * 1000;
      const remainingMs = oneHourMs - diffMs;

      if (remainingMs <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (timeLeft === '00:00' || !timeLeft) return null;

  return (
    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 animate-pulse">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <p className="text-[10px] font-bold text-red-700 uppercase tracking-tight">
        Cancelable for <span className="tabular-nums underline decoration-red-200 underline-offset-2">{timeLeft}</span>
      </p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container py-40 text-center font-serif italic text-3xl text-gray-300">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
