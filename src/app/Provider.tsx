'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
  children: React.ReactNode;
}

// const clientId = process.env.AUTH_GOOGLE_ID!;

export function Providers({ children }: ProviderProps) {
  return (
      <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
