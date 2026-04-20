'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Package, PackageCheck, Truck } from 'lucide-react';
import { ORDERS } from '@/data/mock';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Page Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="container py-8">
          <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-[var(--color-text-primary)] font-bold">My Orders</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-[var(--color-text-primary)]">My Orders</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">{ORDERS.length} orders placed</p>
        </div>
      </div>

      <div className="container py-10">
        {ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-surface-raised)] flex items-center justify-center">
              <Package strokeWidth={1.5} className="w-10 h-10 text-[var(--color-text-muted)]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-8">Once you place an order, it will appear here.</p>
            <Link href="/products" className="btn-primary px-10 py-3.5 text-xs">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[var(--color-surface-raised)] border-b border-[var(--color-border)]">
                  <div className="flex flex-wrap gap-8 text-[12px]">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-0.5">Order ID</p>
                      <p className="font-bold text-[var(--color-text-primary)]">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-0.5">Date</p>
                      <p className="font-semibold text-[var(--color-text-primary)]">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-0.5">Total</p>
                      <p className="font-bold text-[var(--color-text-primary)]">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-0.5">Items</p>
                      <p className="font-semibold text-[var(--color-text-primary)]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <span className={cn(
                    'badge',
                    order.status === 'Shipped' ? 'badge-shipped' : 'badge-delivered'
                  )}>
                    {order.status === 'Shipped'
                      ? <><Truck className="w-2.5 h-2.5 mr-1" />{order.status}</>
                      : <><PackageCheck className="w-2.5 h-2.5 mr-1" />{order.status}</>
                    }
                  </span>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 flex items-center gap-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="btn-primary py-2 px-6 text-[11px]"
                  >
                    {order.status === 'Shipped' ? 'Track Order' : 'View Details'}
                  </Link>
                  {order.status === 'Delivered' && (
                    <button className="btn-ghost py-2 px-5 text-[11px]">Buy Again</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
