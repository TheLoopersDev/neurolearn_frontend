'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useSelector } from 'react-redux';
import { UserDropdown } from '../auth/UserDropDown';

// Import các icon SVG của bạn
import SearchIcon from '@/public/assets/home/Search.svg';
import BuyIcon from '@/public/assets/home/Buy.svg';
import NotificationIcon from '@/public/assets/home/notification-black.svg'
import ArrowDownIcon from '@/public/assets/home/arrow-top-down.svg';
import LogoSVG from '@/public/assets/icons/logo.svg';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';

interface Category {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { showModal } = useModal();
  const user = useSelector((state: RootState) => state.auth.user);

  const categories: Category[] = [
    { name: 'Programming', href: '/categories/programming' },
    { name: 'Business', href: '/categories/business' },
    { name: 'Design', href: '/categories/design' },
    { name: 'Marketing', href: '/categories/marketing' },
  ];

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

  return (
    <>
      <header
        className="
         relative py-4 z-50

        "
      >
        <div className="container mx-auto px-4 flex justify-between items-center relative">

          {/* Left group: Logo + Explore */}
          <div className="flex items-center gap-[24px]">
            {/* Group 850 – Logo */}
            <Link href="/" className="flex gap-2">
              <Image
                src={LogoSVG}
                alt="Academix Logo"
                width={45}
                height={45}
                priority
              />
              <span className="text-3xl font-bold text-[#0D0D0D]">
                Academix
              </span>
            </Link>

            {/* Group 228 – Explore button */}
            <div className="relative">
              <button
                onClick={() => setIsExploreOpen(open => !open)}
                className="
                px-2 py-2
                bg-white rounded-4xl
                flex items-center justify-center gap-4
                text-[16px] font-medium text-[#0D0D0D]
                hover:bg-blue-50 transition
              "
              >
                <span>Explore</span>
                <Image
                  src={ArrowDownIcon}
                  alt=""
                  width={33}
                  height={21}
                />
              </button>

              {/* Dropdown menu */}
              {isExploreOpen && (
                <div className="absolute left-0 mt-2 w-[168px] bg-white border border-gray-200 shadow-lg rounded z-10">
                  {categories.map(cat => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsExploreOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right group: Search – Buy – (Login/Signup or Cart + User) */}
          <div className="flex items-center gap-[13px]">
            {/* Frame 243 – Search icon */}
            <div className="relative">
              <button
                onClick={() => setIsSearchActive(active => !active)}
                className="
                bg-white rounded-full
                p-[16px]
                flex items-center justify-center
              "
              >
                <Image
                  src={SearchIcon}
                  alt="Search"
                  width={20}
                  height={20}
                />
              </button>
              {isSearchActive && (
                <div className="absolute left-full ml-2 top-0">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for courses..."
                    className="
                    w-64 px-4 py-2 text-sm text-gray-700
                    border border-gray-200 rounded
                    shadow-md bg-white focus:outline-none z-20
                  "
                    onBlur={() => setIsSearchActive(false)}
                  />
                </div>
              )}
            </div>

            {/* Frame 244 – Buy icon */}
            <button
              // onClick={() => showModal('buy')}
              className="
              bg-white rounded-full
              p-[16px]
              flex items-center justify-center
            "
            >
              <Image
                src={BuyIcon}
                alt="Buy"
                width={20}
                height={20}
              />
            </button>

            {/* Not logged in */}
            {!user ? (
              <>
                {/* Group 237 – Login */}

                <button
                  onClick={() => showModal('login')}
                  className="
                  w-[124px] h-[56px]
                  bg-white rounded-[120px]
                  text-[16px] font-medium text-[#0D0D0D]
                  hover:bg-gray-100 transition
                "
                >
                  Log In
                </button>

                {/* Group 236 – Sign up */}
                <button
                  onClick={() => showModal('signup')}
                  className="
                  w-[124px] h-[56px]
                  bg-[#3858F8] rounded-[120px]
                  text-[16px] font-medium text-white
                  hover:bg-blue-700 transition
                "
                >
                  Sign Up
                </button>
              </>
            ) : (
              /* Nếu đã login, giữ lại Cart + UserDropdown như cũ */
              <>
                <button
                  // onClick={() => showModal('notification')}
                  className="
                  bg-white rounded-full
                  p-[16px]
                  flex items-center justify-center color-black"
                >
                  <Image
                    src={NotificationIcon}
                    alt="Notification"
                    width={20}
                    height={20}
                  />
                </button>
                <UserDropdown />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {/* Giữ nguyên phần Drawer nếu có */}
    </>
  );
};

export default Header;
