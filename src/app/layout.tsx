import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import DbProvider from '@/components/store/DbProvider';
import ClientLayout from '@/components/store/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMIÈRE | Modern Fashion',
  description: 'Redefining modern fashion with sustainable practices and timeless designs. Made for the conscious individual.',
  keywords: 'fashion, clothing, premium, lumiere, men, women, accessories',
  openGraph: {
    title: 'LUMIÈRE | Modern Fashion',
    description: 'Curated premium fashion collection.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className="overflow-x-clip w-full m-0 p-0 relative">
        <DbProvider>
          <ClientLayout>{children}</ClientLayout>
        </DbProvider>
      </body>
    </html>
  );
}


