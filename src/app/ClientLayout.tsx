// app/ClientLayout.tsx
'use client';

import ModalContainer from '@/components/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModalProvider>
        {children}
        <ModalContainer />
      </ModalProvider>
    </>
  );
}
