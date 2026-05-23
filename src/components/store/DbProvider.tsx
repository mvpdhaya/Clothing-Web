'use client';

import React, { useEffect } from 'react';
import { useDbStore } from '@/store/dbStore';

export default function DbProvider({ children }: { children: React.ReactNode }) {
  const fetchDbData = useDbStore((state) => state.fetchDbData);

  useEffect(() => {
    fetchDbData();
  }, [fetchDbData]);

  return <>{children}</>;
}
