'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useSelector } from 'react-redux';
import { UserDropdown } from '../auth/UserDropDown';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Import các icon SVG của bạn
import SearchIcon from '@/public/assets/home/Search.svg';
import BuyIcon from '@/public/assets/home/Buy.svg';
import NotificationIcon from '@/public/assets/home/notification-black.svg';

import LogoSVG from '@/public/assets/icons/logo.svg';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import ExploreDropdown from '../home/ExploreDropdown';
import { userLoggerOut } from '@/lib/redux/features/auth/authSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

const Header: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { showModal } = useModal();
  const { error, isLoading } = useLoadUserQuery(undefined);
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  // Animation variants
  const headerVariants : Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        when: "beforeChildren" 
      }
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8px)',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const searchVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 200
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (error && 'status' in error && error.status === 400) {
      dispatch(userLoggerOut());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isSearchActive && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchActive(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  let userSection = null;

  if (!isLoading) {
    if (!reduxUser) {
      userSection = (
        <div className="flex gap-2">
          {/* Login Button */}
          <motion.button
            onClick={() => showModal('login')}
            className="
              w-[124px] h-[56px]
              bg-white rounded-[120px]
              text-[16px] font-medium text-[#0D0D0D]
              hover:bg-gray-100 transition
            "
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Log In
          </motion.button>

          {/* Sign Up Button */}
          <motion.button
            onClick={() => showModal('signup')}
            className="
              w-[124px] h-[56px]
              bg-[#3858F8] rounded-[120px]
              text-[16px] font-medium text-white
              hover:bg-blue-700 transition
            "
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Sign Up
          </motion.button>
        </div>
      );
    } else {
      userSection = (
        <div className="flex items-center gap-2">
          <motion.button
            className="
              bg-white rounded-full
              p-[16px]
              flex items-center justify-center color-black
            "
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Image src={NotificationIcon} alt="Notification" width={20} height={20} />
          </motion.button>
          <UserDropdown />
        </div>
      );
    }
  }

  return (
    <motion.header
      className="w-full py-4 z-[100] relative"
      initial="hidden"
      animate={["visible", isScrolled ? "scrolled" : ""]}
      variants={headerVariants}
      style={{
        isolation: 'isolate'
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Left group: Logo + Explore */}
        <motion.div
          className="flex items-center gap-[24px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex gap-2">
              <Image src={LogoSVG} alt="Academix Logo" width={45} height={45} priority />
              <span className="text-3xl font-bold text-[#0D0D0D]">Academix</span>
            </Link>
          </motion.div>

          {/* Explore Dropdown */}
          <ExploreDropdown />
        </motion.div>

        {/* Right group: Search – Buy – (Login/Signup or Cart + User) */}
        <div className="flex items-center gap-[13px]">
          {/* Search */}
          <div className="relative flex items-center">
            <motion.button
              onClick={() => setIsSearchActive(active => !active)}
              className="bg-white rounded-full p-[16px] flex items-center justify-center"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Image src={SearchIcon} alt="Search" width={20} height={20} />
            </motion.button>

            <AnimatePresence>
              {isSearchActive && (
                <motion.div
                  variants={searchVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute left-full ml-2 top-0"
                >
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for courses..."
                    className="w-64 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded shadow-md bg-white focus:outline-none z-20"
                    onBlur={() => setIsSearchActive(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="bg-white rounded-full p-[16px] flex items-center justify-center"
            >
              <Image src={BuyIcon} alt="Buy" width={20} height={20} />
            </Link>
          </motion.div>

          {/* User Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {userSection}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;