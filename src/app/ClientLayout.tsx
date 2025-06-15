// src/app/ClientLayout.tsx
'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ModalContainer from '@/components/learner/auth/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';
import '@/lib/fontawesome';

export default function ClientLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <ModalProvider>
      <div className="relative bg-gray-50 min-h-screen overflow-hidden z-10">
        {/* Background Ellipse */}
        <div
          className="
      absolute left-1/2 -translate-x-1/2
      w-[clamp(800px,100vw,1172px)]
      h-[clamp(320px,60vw,467px)]
      top-[clamp(-200px,-20vw,-234px)]
      -z-10
      rounded-b-[100%]
    "
          style={{
            background:
              'radial-gradient(58.94% 105.86% at 50% -5.86%, #5B78FF 0%, #F7F8FA 100%)',
          }}
        />
        {/* Header */}
        <Header />
        {children}
        <Footer />
      </div>
      <ModalContainer />
    </ModalProvider>
  );
}
