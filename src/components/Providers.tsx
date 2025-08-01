'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { storeRedux, AppStore } from '../lib/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = storeRedux();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
