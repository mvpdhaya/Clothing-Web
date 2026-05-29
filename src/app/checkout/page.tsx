'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useDbStore } from '@/store/dbStore';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import styles from './checkout.module.css';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { cart, cartTotal } = useCartStore();
  const allProducts = useDbStore((state) => state.products);
  const storeSettings = useDbStore((state) => state.storeSettings);

  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingUser(false); return; }

      const { data: custData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (custData) setCustomer(custData);
      else setCustomer({ email: user.email, full_name: user.user_metadata?.name || '' });

      const { data: addrData } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false });
      if (addrData && addrData.length > 0) {
        setAddresses(addrData);
        setSelectedAddress(addrData.find((a: any) => a.is_default) || addrData[0]);
      } else if (user) {
        // Automatically open add address modal if no address exists
        setIsAddAddressModalOpen(true);
      }
      setLoadingUser(false);
    }
    fetchCustomerData();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [billingOption, setBillingOption] = useState('same');
  const [discountCode, setDiscountCode] = useState('');

  // Set default payment method when storeSettings load
  useEffect(() => {
    if (storeSettings?.paymentMethods) {
      const firstActive = storeSettings.paymentMethods.find(m => m.active);
      if (firstActive) setPaymentMethod(firstActive.name);
    }
  }, [storeSettings]);
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Add Address Form State
  const [addrFirst, setAddrFirst] = useState('');
  const [addrLast, setAddrLast] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrApt, setAddrApt] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostal, setAddrPostal] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  const isBuyNow = searchParams.get('buyNow') === 'true';
  const buyNowId = searchParams.get('id');
  const buyNowQty = parseInt(searchParams.get('qty') || '1');
  const buyNowSize = searchParams.get('size') || '';
  const buyNowColor = searchParams.get('color') || '';
  const buyNowColorHex = searchParams.get('colorHex') || '';

  // Determine items to display
  let displayItems: CartItem[] = [];
  let subtotal = 0;

  if (isBuyNow && buyNowId) {
    const product = allProducts.find(p => p.id === buyNowId);
    if (product) {
      displayItems = [{
        product,
        quantity: buyNowQty,
        selectedSize: buyNowSize,
        selectedColor: { name: buyNowColor, hex: buyNowColorHex }
      }];
      subtotal = product.price * buyNowQty;
    }
  } else {
    displayItems = cart;
    subtotal = cartTotal();
  }

  const shippingFee = 450;
  const total = subtotal + shippingFee;

  const handlePayNow = () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address before proceeding.');
      return;
    }
    const addrText = selectedAddress
      ? `${selectedAddress.full_name}, ${selectedAddress.line1}`
      : 'No address selected';
    alert(`Processing payment of ${formatPrice(total)} via ${paymentMethod}...\nShipping to: ${addrText}`);
  };

  const handleApplyDiscount = () => {
    if (discountCode) {
      alert(`Applying discount code: ${discountCode}`);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = {
      customer_id: user.id,
      label: addrDefault ? 'Home' : 'Other',
      full_name: `${addrFirst} ${addrLast}`.trim(),
      line1: addrLine + (addrApt ? `, ${addrApt}` : ''),
      city: addrCity,
      postal_code: addrPostal,
      phone: addrPhone,
      is_default: addrDefault,
    };
    if (addrDefault) await supabase.from('addresses').update({ is_default: false }).eq('customer_id', user.id);
    const { data } = await supabase.from('addresses').insert([payload]).select().single();
    if (data) {
      setAddresses(prev => [data, ...(addrDefault ? prev.map(a => ({...a, is_default: false})) : prev)]);
      setSelectedAddress(data);
    }
    setIsAddAddressModalOpen(false);
    setAddrFirst(''); setAddrLast(''); setAddrLine(''); setAddrApt('');
    setAddrCity(''); setAddrPostal(''); setAddrPhone(''); setAddrDefault(false);
  };

  if (loadingUser) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading your details...</div>;
  }

  if (displayItems.length === 0) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', padding: '100px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Your checkout is empty</h2>
          <a href="/products" className={styles.payButton} style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 30px' }}>Return to Shop</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Email Section */}
          <div className={styles.section}>
            <div className={styles.emailRow}>
              <div className={styles.avatarCircle}>
                {(customer?.full_name || customer?.email || 'U')[0].toUpperCase()}
              </div>
              <div className={styles.emailText}>{customer?.email || '—'}</div>
            </div>
          </div>

          {/* Ship To Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => setIsAddressModalOpen(true)}>
              <span className={styles.sectionTitle}>Ship to</span>
            </div>
            {selectedAddress ? (
              <div className={styles.addressBox} onClick={() => setIsAddressModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div>
                  <div className={styles.addressText}>
                    {selectedAddress.full_name}, {selectedAddress.line1},<br />
                    {selectedAddress.city}, {selectedAddress.postal_code},<br />
                    Sri Lanka
                  </div>
                  {selectedAddress.is_default && <div className={styles.defaultBadge}>Default</div>}
                </div>
                <div className={styles.menuDots}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', border: '1px dashed #ddd', borderRadius: '8px', color: '#999', fontSize: '14px' }}>
                No address saved. Add one below.
              </div>
            )}
            <a href="#" className={styles.addAddress} onClick={(e) => { e.preventDefault(); setIsAddAddressModalOpen(true); }}>
              <span className={styles.plusIcon}>+</span>
              <span>Use a different address</span>
            </a>
          </div>

          {/* Shipping Method */}
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => alert('Change shipping method')}>
              <span className={styles.sectionTitle}>Shipping method</span>
            </div>
            <div className={styles.shippingRow}>
              <div className={styles.shippingInfo}>
                Sri Lanka · {formatPrice(shippingFee)}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className={styles.section}>
            <div className={styles.paymentTitle}>Payment</div>
            <div className={styles.secureText}>All transactions are secure and encrypted.</div>
            
            <div className={styles.paymentOptions}>
              {storeSettings?.paymentMethods?.filter(m => m.active).map((method, index) => (
                <React.Fragment key={method.name}>
                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === method.name ? styles.paymentOptionSelected : ''}`}
                    onClick={() => setPaymentMethod(method.name)}
                  >
                    <div className={`${styles.paymentRadio} ${paymentMethod === method.name ? styles.paymentRadioChecked : styles.paymentRadioUnchecked}`}></div>
                    <div className={styles.paymentLabel}>
                      {method.icon} {method.name}
                    </div>
                    {/* Special icons for cards if name matches */}
                    {(method.name.toLowerCase().includes('card') || method.name.toLowerCase().includes('payhere')) && (
                      <div className={styles.cardIcons}>
                        <svg className={styles.cardIcon} viewBox="0 0 48 32" fill="none">
                          <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" />
                          <text x="8" y="20" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#1a1f71">VISA</text>
                        </svg>
                        <svg className={styles.cardIcon} viewBox="0 0 48 32" fill="none">
                          <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" />
                          <circle cx="22" cy="16" r="8" fill="#eb001b" opacity="0.8" />
                          <circle cx="30" cy="16" r="8" fill="#f79e1b" opacity="0.8" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {paymentMethod === method.name && (
                    <div className={styles.paymentDescription}>
                      {method.name.toLowerCase().includes('cod') || method.name.toLowerCase().includes('delivery') 
                        ? 'Pay for your order when it arrives at your doorstep!' 
                        : `Complete your purchase using ${method.name}.`}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {(!storeSettings?.paymentMethods || storeSettings.paymentMethods.filter(m => m.active).length === 0) && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No payment methods available. Please contact support.
                </div>
              )}
            </div>
          </div>

          {/* Billing Address */}
          <div className={styles.section}>
            <div className={styles.paymentTitle}>Billing address</div>
            <div className={styles.billingOptions} style={{ marginTop: '14px' }}>
              <div 
                className={styles.billingOption}
                onClick={() => setBillingOption('same')}
              >
                <div className={`${styles.paymentRadio} ${billingOption === 'same' ? styles.paymentRadioChecked : styles.paymentRadioUnchecked}`}></div>
                <div className={styles.paymentLabel}>Same as shipping address</div>
              </div>
              <div 
                className={styles.billingOption}
                onClick={() => setBillingOption('different')}
              >
                <div className={`${styles.paymentRadio} ${billingOption === 'different' ? styles.paymentRadioChecked : styles.paymentRadioUnchecked}`}></div>
                <div className={styles.paymentLabel}>Use a different billing address</div>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button 
            className={`${styles.payButton} ${!selectedAddress ? styles.payButtonDisabled : ''}`} 
            onClick={handlePayNow}
            disabled={!selectedAddress}
          >
            {selectedAddress ? 'Pay now' : 'Select an address to continue'}
          </button>

          {/* Footer Links */}
          <div className={styles.footerLinks}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Refund policy'); }}>Refund policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy policy'); }}>Privacy policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of service'); }}>Terms of service</a>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Product Items */}
          {displayItems.map((item, index) => (
            <div className={styles.productItem} key={index}>
              <div className={styles.productImageWrapper}>
                <img src={item.product.images[0]} alt={item.product.name} className={styles.productImage} />
                <div className={styles.quantityBadge}>{item.quantity}</div>
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{item.product.name}</div>
                <div className={styles.productVariant}>
                  {item.selectedColor?.name || ''} {item.selectedSize ? `/ ${item.selectedSize}` : ''}
                </div>
              </div>
              <div className={styles.productPrice}>{formatPrice(item.product.price * item.quantity)}</div>
            </div>
          ))}

          {/* Discount Code */}
          <div className={styles.discountRow}>
            <input 
              type="text" 
              className={styles.discountInput} 
              placeholder="Discount code" 
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button className={styles.applyButton} onClick={handleApplyDiscount}>Apply</button>
          </div>

          {/* Summary */}
          <div className={styles.summaryRow}>
            <div className={styles.summaryLabel}>Subtotal · {displayItems.reduce((acc, item) => acc + item.quantity, 0)} items</div>
            <div className={styles.summaryValue}>{formatPrice(subtotal)}</div>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.summaryLabel}>Shipping</div>
            <div>
              <span className={styles.summaryValue}>{formatPrice(shippingFee)}</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <div className={styles.totalLabel}>Total</div>
            <div>
              <span className={styles.currencyCode}>LKR</span>
              <span className={styles.totalValue}>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Select Address</h2>
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {addresses.map((addr: any) => (
                <div 
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setIsAddressModalOpen(false);
                  }}
                  style={{
                    padding: '16px',
                    border: `1px solid ${selectedAddress?.id === addr.id ? '#1a1a1a' : '#e5e5e5'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedAddress?.id === addr.id ? '#fafafa' : '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{addr.label}</span>
                    {addr.is_default && <span style={{ fontSize: '10px', background: '#1a1a1a', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>DEFAULT</span>}
                  </div>
                  <div style={{ fontSize: '14px', color: '#1a1a1a' }}>{addr.full_name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                    {addr.line1}, {addr.city}, {addr.postal_code}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setIsAddressModalOpen(false);
                setIsAddAddressModalOpen(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '20px',
                backgroundColor: '#fff',
                border: '1px dashed #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              + Add New Address
            </button>
          </div>
        </div>
      )}

      {/* Add Address Form Modal */}
      {isAddAddressModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px'
          }}
          onClick={() => setIsAddAddressModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 600 }}>Add address</h2>
              <button 
                onClick={() => setIsAddAddressModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress}>
              {/* Country */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  fontSize: '15px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  backgroundColor: '#fff'
                }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '2px' }}>Country/region</span>
                    <span style={{ color: '#000' }}>Sri Lanka</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="First name"
                  value={addrFirst}
                  onChange={e => setAddrFirst(e.target.value)}
                  required
                  style={{ flex: 1, padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={addrLast}
                  onChange={e => setAddrLast(e.target.value)}
                  required
                  style={{ flex: 1, padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={addrLine}
                onChange={e => setAddrLine(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '16px', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc (optional)"
                value={addrApt}
                onChange={e => setAddrApt(e.target.value)}
                style={{ width: '100%', marginBottom: '16px', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              />

              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="City"
                  value={addrCity}
                  onChange={e => setAddrCity(e.target.value)}
                  required
                  style={{ flex: 1, padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={addrPostal}
                  onChange={e => setAddrPostal(e.target.value)}
                  required
                  style={{ flex: 1, padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Phone</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 12px', borderRight: '1px solid #ddd', backgroundColor: '#f9f9f9', fontSize: '13px', color: '#555' }}>
                    +94
                  </div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value)}
                    required
                    style={{ flex: 1, padding: '14px 16px', fontSize: '15px', outline: 'none', border: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0', cursor: 'pointer' }} onClick={() => setAddrDefault(!addrDefault)}>
                <input
                  type="checkbox"
                  checked={addrDefault}
                  onChange={() => {}} // Handled by div click
                  style={{ width: '16px', height: '16px', accentColor: '#000' }}
                />
                <label style={{ fontSize: '14px', color: '#333', cursor: 'pointer' }}>
                  This is my default address
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(false)}
                  style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', fontWeight: 500, backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

