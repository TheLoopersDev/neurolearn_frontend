"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

interface Category {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

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
      if (e.key === "Escape") setIsSearchActive(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="bg-white border-b shadow-sm z-50 relative">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Explore */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">A</span>cademix
          </Link>

          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
            >
              Explore
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            <button onClick={() => setIsSearchActive(!isSearchActive)} className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isSearchActive && (
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for courses..."
                className="absolute top-0 left-8 w-64 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-md shadow-md focus:outline-none z-30"
                onBlur={() => setIsSearchActive(false)}
              />
            )}
          </div>

          {/* Cart */}
          <button onClick={() => setIsCartOpen(true)} className="text-gray-600 hover:text-gray-800 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          </button>

          {/* Auth links */}
          <Link href="/login" className="text-sm text-gray-700 hover:underline">
            Log in
          </Link>
          <Button href="/signup" variant="primary" showArrow={false} className="text-sm">
            Sign up
          </Button>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-40">
          <div className="bg-white w-96 h-full shadow-lg px-6 py-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 4L4 6l6 6-6 6 2 2 6-6 6 6 2-2-6-6 6-6-2-2-6 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">Your cart is empty.</p>
            <Button onClick={() => setIsCartOpen(false)} variant="primary" showArrow={false} className="mt-6 w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
