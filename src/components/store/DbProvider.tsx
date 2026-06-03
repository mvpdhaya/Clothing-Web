'use client';

import React, { useEffect } from 'react';
import { useDbStore } from '@/store/dbStore';
import { supabase } from '@/lib/supabase/client';

export default function DbProvider({ children }: { children: React.ReactNode }) {
  const fetchDbData = useDbStore((state) => state.fetchDbData);

  useEffect(() => {
    fetchDbData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Update last_login_at for the customer
        await supabase
          .from('customers')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDbData]);

  return <>{children}</>;
}
