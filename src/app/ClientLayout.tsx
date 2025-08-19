'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ModalContainer from '@/components/auth/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';
import '@/lib/fontawesome';
import { Suspense, useEffect, useRef } from 'react';
import Loading from '@/components/common/Loading';
import {
  LazyMotion,
  domAnimation,
  AnimatePresence,
  m,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { setAuthState } from '@/lib/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { useSocialAuthMutation } from '@/lib/redux/features/auth/authApi';

export default function ClientLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();
  const { data: session, status } = useSession();
  const { data: me, refetch } = useLoadUserQuery(undefined, {
    skip: status !== 'authenticated',
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;
  const [socialAuth] = useSocialAuthMutation();
  const didBridge = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      dispatch(setAuthState({ token: null, user: null, isAuthenticated: false }));
      didBridge.current = false;
      return;
    }

    // 1) Đẩy session vào Redux để UI có gì đó ngay (role tạm)
    if (session?.user) {
      dispatch(
        setAuthState({
          token: (session as any).accessToken ?? null,
          user: {
            _id: (session.user as any).id ?? '',
            name: session.user.name ?? '',
            email: session.user.email ?? '',
            role: 'user',
            avatar: session.user.image ? { url: session.user.image } : undefined,
          },
          isAuthenticated: true,
        }),
      );
    }

    // 2) Bridge 1 lần -> BE set cookie -> refetch /me
    if (!didBridge.current) {
      didBridge.current = true;
      (async () => {
        try {
          await socialAuth({
            email: session?.user?.email,
            name: session?.user?.name,
            avatar: session?.user?.image,
          }).unwrap();
        } catch {
          // ignore
        } finally {
          await refetch();
        }
      })();
    }

    // 3) Khi /me có dữ liệu thật (có role), override Redux
    if (me?.user) {
      const u = me.user;
      dispatch(
        setAuthState({
          token: (session as any)?.accessToken ?? null,
          user: {
            _id: u.id ?? u._id ?? '',
            name: u.name ?? '',
            email: u.email ?? '',
            role: u.role ?? 'user',
            avatar: u?.avatar?.url ? { url: u.avatar.url } : undefined,
          },
          isAuthenticated: true,
        }),
      );
    }
  }, [status, session, me, refetch, socialAuth, dispatch]);

  return (
    <ModalProvider>
      {/* Wrapper: responsive + tránh tràn ngang + footer dính đáy */}
      <div className="relative min-h-dvh flex flex-col bg-gray-50 overflow-x-clip z-10
                      pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

        {/* Background cố định (responsive height/width) */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2
                     w-[min(1172px,100vw)] h-[clamp(260px,56vw,467px)]
                     sm:h-[clamp(300px,50vw,467px)]
                     top-[clamp(-220px,-22vw,-180px)]
                     -z-10 rounded-b-[100%]"
          style={{
            background:
              'radial-gradient(58.94% 105.86% at 50% -5.86%, #5B78FF 0%, #F7F8FA 100%)',
          }}
        />

        {/* Header full-width, tự xử lý responsive bên trong */}
        <Header />

        {/* Main container: padding theo breakpoint, giữ max width */}
        <main className="relative w-full max-w-7xl mx-auto flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <LazyMotion features={domAnimation}>
            <MotionConfig
              reducedMotion="user"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }
              }
            >
              <AnimatePresence mode="sync" initial={false}>
                <Suspense
                  key={pathname}
                  fallback={
                    <m.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid place-items-center min-h-[40dvh] px-3"
                    >
                      <Loading />
                    </m.div>
                  }
                >
                  {children}
                </Suspense>
              </AnimatePresence>
            </MotionConfig>
          </LazyMotion>
        </main>

        {/* Footer: khoảng cách theo breakpoint */}
        <div className="mt-8 sm:mt-10">
          <Footer />
        </div>
      </div>

      <ModalContainer />
    </ModalProvider>
  );
}
