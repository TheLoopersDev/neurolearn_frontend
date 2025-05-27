// src/app/ClientLayout.tsx
'use client';

import ModalContainer from '@/components/learner/auth/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';
import '@/lib/fontawesome';

export default function ClientLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalContainer />
    </ModalProvider>
  );
}
