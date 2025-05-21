'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from '@/lib/redux/store';

interface ProviderProps {
  children: React.ReactNode;
}

const clientId = process.env.NEXT_PUBLIC_GG_CLIENT_ID!;

export function Providers({ children }: ProviderProps) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </GoogleOAuthProvider>
  );
}
