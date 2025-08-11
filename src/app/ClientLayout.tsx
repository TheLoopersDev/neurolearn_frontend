'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ModalContainer from '@/components/auth/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';
import '@/lib/fontawesome';
import { Suspense, useEffect, useRef, useMemo } from 'react';
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
function useRouteDir(pathname: string) {
  const prevDepth = useRef(0);
  const depth = pathname.split('/').filter(Boolean).length;
  const dir = depth === prevDepth.current ? 0 : depth > prevDepth.current ? 1 : -1;
  useEffect(() => { prevDepth.current = depth; }, [depth]);
  return dir; // 1 = forward, -1 = back
}

export default function ClientLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();
  const dir = useRouteDir(pathname);
  const { data: session, status } = useSession();
  const { data: me } = useLoadUserQuery(undefined, { skip: status !== 'authenticated' }) as any;

  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch(setAuthState({ token: null, user: null, isAuthenticated: false }));
      return;
    }

    if (status === 'authenticated') {
      // 1) fallback từ session (role tạm) để UI không "trắng"
      if (session?.user) {
        dispatch(setAuthState({
          token: (session as any).accessToken ?? null,
          user: {
            _id: (session.user as any).id ?? '',          
            name: session.user.name ?? '',
            email: session.user.email ?? '',
            role: 'user',                                
            avatar: { url: session.user.image ?? '' },
          },
          isAuthenticated: true,
        }));
      }

      // 2) khi BE đã trả user -> override có role thật
      if (me?.user) {
        const u = me.user;
        dispatch(setAuthState({
          token: (session as any)?.accessToken ?? null,
          user: {
            _id: u.id ?? u._id ?? '',                      
            name: u.name ?? '',
            email: u.email ?? '',
            role: u.role ?? 'user',                     
            avatar: { url: u?.avatar?.url ?? '' },
          },
          isAuthenticated: true,
        }));
      }
    }
  }, [status, session, me, dispatch]);
  // iOS push/pop: slide theo X rất ngắn + fade. Back thì trượt ngược.
  const pageVariants = useMemo(() => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
    const shift = dir >= 0 ? 12 : -12; // px
    return {
      initial: { opacity: 0, x: shift },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -shift / 2 },
    };
  }, [dir, reduce]);

  return (
    <ModalProvider>
      <div className="relative bg-gray-50 min-h-screen z-10">
        {/* Background cố định, không effect màu */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 w-[clamp(800px,100vw,1172px)] h-[clamp(320px,60vw,467px)] top-[clamp(-200px,-20vw,-234px)] -z-10 rounded-b-[100%]"
          style={{
            background:
              'radial-gradient(58.94% 105.86% at 50% -5.86%, #5B78FF 0%, #F7F8FA 100%)',
          }}
        />

        <Header />

        <div className="relative max-w-7xl mx-auto">
          <LazyMotion features={domAnimation}>
            <MotionConfig
              reducedMotion="user"
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                    type: 'spring',
                    stiffness: 520, // snappy như iOS
                    damping: 42,
                    mass: 0.7,
                  }
              }
            >
              {/* Bọc cả Suspense để tránh nháy */}
              <AnimatePresence mode="sync" initial={false}>
                <Suspense
                  key={pathname}
                  fallback={
                    <m.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6"
                    >
                      <Loading />
                    </m.div>
                  }
                >
                  {/* Layer chính: edge-fade mask rất mỏng + shadow nhẹ khi enter */}
                  <m.main
                    key={`${pathname}-content`}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative will-change-transform"
                    style={{
                      // Edge fade giống “push view controller” trên iOS
                      WebkitMaskImage:
                        reduce
                          ? undefined
                          : 'linear-gradient(90deg, rgba(0,0,0,0.06) 0px, #000 12px, #000 calc(100% - 12px), rgba(0,0,0,0.06) 100%)',
                      maskImage:
                        reduce
                          ? undefined
                          : 'linear-gradient(90deg, rgba(0,0,0,0.06) 0px, #000 12px, #000 calc(100% - 12px), rgba(0,0,0,0.06) 100%)',
                      boxShadow: reduce ? undefined : '0 8px 24px rgba(15, 23, 42, 0.06)',
                      borderRadius: 0, // giữ phẳng, không “cardy”
                      background: 'transparent',
                    }}
                  >
                    {children}
                  </m.main>
                </Suspense>
              </AnimatePresence>
            </MotionConfig>
          </LazyMotion>
        </div>

        <Footer />
      </div>

      <ModalContainer />
    </ModalProvider>
  );
}
