"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';

interface Category {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { showModal } = useModal();

  const categories: Category[] = [
    { name: "Programming", href: "/categories/programming" },
    { name: "Business", href: "/categories/business" },
    { name: "Design", href: "/categories/design" },
    { name: "Marketing", href: "/categories/marketing" },
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
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="bg-white py-4 shadow-sm z-50 relative">
        <div className="container mx-auto px-4 flex justify-between items-center relative">
          {/* Logo & Explore */}
          <div className="flex items-center relative">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600">A</span>cademix
            </Link>
            <div className="ml-8 relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 text-sm rounded-full bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition"
              >
                <span>Explore</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded z-10">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 relative">
            {/* Search toggle */}
            <div className="relative flex items-center">
              <button onClick={() => setIsSearchActive(!isSearchActive)} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isSearchActive && (
                <div className="absolute left-full ml-2 top-0">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for courses..."
                    className="w-64 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded shadow-md bg-white focus:outline-none z-20"
                    onBlur={() => setIsSearchActive(false)}
                  />
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>

            <button onClick={() => showModal('login')} className="text-sm">Log in</button>
            <Button onClick={() => showModal('register')} variant="primary" showArrow={false} className="text-sm">
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Drawer (Push layout) */}
      <div className={`transition-all duration-300 ease-in-out ${isCartOpen ? 'mr-96' : ''}`}>
        {/* Nội dung trang ở đây nếu bạn muốn đẩy sang trái khi cart mở */}
      </div>

      {isCartOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg px-6 py-8 z-40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600">Your cart is empty.</p>
          <Button onClick={() => setIsCartOpen(false)} variant="primary" showArrow={false} className="mt-4 w-full">
            Continue Shopping
          </Button>
        </div>
      )}
    </>
  );
};

export default Header;
