'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';

export function useAuth() {
  const [user] = useState<User | null>(null);
  const loading = false;

  useEffect(() => {
    // Check for user session (skeleton)
    // For now, loading is already false by default
  }, []);

  const signIn = async (credentials: Record<string, string>) => {
    console.log('Signing in...', credentials);
    return { error: null };
  };

  const signUp = async (credentials: Record<string, string>) => {
    console.log('Signing up...', credentials);
    return { error: null };
  };

  const signOut = async () => {
    console.log('Signing out...');
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
}
