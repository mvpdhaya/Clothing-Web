'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useDbStore } from '@/store/dbStore';
import { formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import styles from './checkout.module.css';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCartStore();
  const allProducts = useDbStore((state) => state.products);
  const storeSettings = useDbStore((state) => state.storeSettings);
  const shippingRates = useDbStore((state) => state.shippingRates);

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

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

  // Get shipping fee from DB (fallback to 450 if not loaded)
  const activeShipping = shippingRates.length > 0 ? shippingRates[0] : { name: 'Sri Lanka', rate: 450 };
  const isFreeShipping = storeSettings?.freeShippingEnabled && subtotal >= storeSettings.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : activeShipping.rate;
  const total = subtotal + shippingFee;

  const handlePayNow = () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address before proceeding.');
      return;
    }

    const isCOD = paymentMethod.toLowerCase().includes('cod') || paymentMethod.toLowerCase().includes('delivery');
    
    if (isCOD) {
      setIsConfirmModalOpen(true);
      return;
    }

    const addrText = selectedAddress
      ? `${selectedAddress.full_name}, ${selectedAddress.line1}`
      : 'No address selected';
    alert(`Processing payment of ${formatPrice(total)} via ${paymentMethod}...\nShipping to: ${addrText}`);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress || isProcessingOrder) return;
    
    setIsProcessingOrder(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to confirm an order.');
        setIsProcessingOrder(false);
        return;
      }

      // 1. Insert into orders table first
      const orderId = crypto.randomUUID();
      const isCOD = paymentMethod.toLowerCase().includes('cod') || paymentMethod.toLowerCase().includes('delivery');
      const normalizedPayment = isCOD ? 'COD' : paymentMethod;

      const orderPayload = {
        id: orderId,
        customer_id: user.id,
        address_id: selectedAddress.id,
        total: total,
        subtotal: subtotal,
        shipping_amount: shippingFee,
        item_count: displayItems.reduce((acc, item) => acc + item.quantity, 0),
        payment: normalizedPayment,
        status: 'Pending',
        discount_amount: 0, 
        coupon_code: discountCode || null,
        notes: ''
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert all items into order_items table
      const orderItemsPayload = displayItems.map(item => ({
        order_id: orderId, // Use the generated orderId
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total_price: item.product.price * item.quantity,
        image: item.product.images[0],
        selected_size: item.selectedSize,
        selected_color: item.selectedColor?.name
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) throw itemsError;

      // Success!
      setIsConfirmModalOpen(false);
      clearCart();
      router.push('/profile?tab=orders');
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      alert(`There was an error creating your order: ${error.message || 'Please try again.'}`);
    } finally {
      setIsProcessingOrder(false);
    }
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
              <div className={styles.methodPrice}>
                {activeShipping.name} · {shippingFee === 0 ? <span className="text-green-600 font-bold uppercase">Free</span> : formatPrice(shippingFee)}
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
              <span className={styles.summaryValue}>{shippingFee === 0 ? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>FREE</span> : formatPrice(shippingFee)}</span>
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

      {/* COD Confirmation Modal */}
      {isConfirmModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '20px',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setIsConfirmModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px' 
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Confirm Cash on Delivery</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to place this order using Cash on Delivery? You will need to pay <strong>{formatPrice(total)}</strong> when your order arrives.
            </p>
            
            <div style={{ 
              backgroundColor: '#f9fafb', 
              borderRadius: '12px', 
              padding: '16px', 
              marginBottom: '24px', 
              textAlign: 'left' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Amount:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Payment:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{paymentMethod}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessingOrder}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: isProcessingOrder ? '#6b7280' : '#111827', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  cursor: isProcessingOrder ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {isProcessingOrder ? 'Processing...' : 'Confirm Order'}
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isProcessingOrder}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: '#fff', 
                  color: '#374151', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '10px', 
                  fontSize: '15px', 
                  fontWeight: 500, 
                  cursor: isProcessingOrder ? 'not-allowed' : 'pointer',
                  opacity: isProcessingOrder ? 0.5 : 1
                }}
              >
                Cancel
              </button>
            </div>
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

