'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, PackageCheck, Truck, MapPin, CreditCard } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ORDERS, PRODUCTS } from '@/data/mock';
import { cn, formatPrice } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = ORDERS.find((o) => o.id === id) ?? ORDERS[0];
  const orderProducts = order.items.map((item) =>
    PRODUCTS.find((p) => p.id === item.productId)
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Page Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="container py-8">
          <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link href="/profile" className="hover:text-[var(--color-text-primary)] transition-colors">Profile</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-[var(--color-text-primary)] font-bold">{order.id}</span>
          </nav>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-[var(--color-text-primary)]">Order {order.id}</h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">Placed on {order.date}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="container py-10">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-brand-black transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h2 className="font-semibold text-[var(--color-text-primary)]">Order Items ({order.items.length})</h2>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {orderProducts.map((p) => p && (
                  <div key={p.id} className="flex gap-5 p-6">
                    <Link
                      href={`/product/${p.name.toLowerCase().replace(/ /g, '-')}`}
                      className="relative w-20 h-28 flex-shrink-0 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-surface-raised)]"
                    >
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover object-top" sizes="80px" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${p.name.toLowerCase().replace(/ /g, '-')}`}>
                        <h3 className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors leading-snug mb-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-[12px] text-[var(--color-text-muted)] mb-3">{p.category}</p>
                      <p className="font-bold text-sm">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* Right — Summary + Address */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h2 className="font-semibold text-[var(--color-text-primary)]">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Subtotal</span>
                  <span className="font-semibold">{formatPrice(order.total - 350)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Shipping</span>
                  <span className="font-semibold">Rs 350</span>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
                <h2 className="font-semibold text-[var(--color-text-primary)]">Shipping Address</h2>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Dhaya Panchalingam<br />
                123 Fashion Street<br />
                Negombo, Western Province<br />
                Sri Lanka, 11500
              </p>
            </div>

            {/* Payment */}
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[var(--color-text-muted)]" />
                <h2 className="font-semibold text-[var(--color-text-primary)]">Payment</h2>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">Visa ending in 4242</p>
            </div>

            <Link href="/products" className="btn-primary w-full py-3.5 text-xs text-center block">
              Shop Again
            </Link>
          </div>
        </div>
      </div>
      {/* ── FOOTER LINKS ── */}
      <div className="bg-white border-t border-[var(--color-border)] mt-10">
        <div className="container py-8 flex gap-6">
          <Link href="/returns"  className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Refund policy</Link>
          <Link href="/privacy"  className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Privacy policy</Link>
          <Link href="/terms"    className="text-[13px] text-black underline underline-offset-[3px] hover:opacity-70 transition-opacity">Terms of service</Link>
        </div>
      </div>
    </div>
  );
}
