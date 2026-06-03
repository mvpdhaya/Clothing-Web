'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // The Supabase client automatically handles the code exchange
      // as long as it's initialized on this page.
      // We just need to wait a moment or check the session.
      const { data: { session }, error } = await supabase.auth.getSession();
      
      const next = searchParams.get('next') || '/';
      
      if (error) {
        console.error('Auth callback error:', error.message);
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
      } else {
        router.push(next);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#1a3a5c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Completing login...</p>
      </div>
    </div>
  );
}
