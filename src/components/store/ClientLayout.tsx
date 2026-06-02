'use client';

import React from 'react';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import MaintenanceMode from '@/components/store/MaintenanceMode';
import { useDbStore } from '@/store/dbStore';
import { Suspense } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const storeSettings = useDbStore((state) => state.storeSettings);
  const loading = useDbStore((state) => state.loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" />
    );
  }

  if (storeSettings?.maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
