'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/ui/Button';
import { useModal } from '@/context/ModalContext';
import CtaButton from '../CTAButton';
import BubbleButton from '../BubbleButton';
import { useSelector } from 'react-redux';
import { UserDropdown } from '../learner/auth/UserDropDown';

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
  const user = useSelector((state: any) => state.auth.user);

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
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded z-10">
                  {categories.map(category => (
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
            {/* Search */}
            <div className="relative flex items-center">
              <button onClick={() => setIsSearchActive(!isSearchActive)} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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
            {user ? (
              <>
                {/* Cart */}
                <Link href="/shop-cart" className="mr-[10px] relative">
                  <svg
                    className="hover:text-accent-900 transition-colors"
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.55005 0.693359C7.99927 0.693359 7.48364 0.787109 7.00317 0.974609C6.51099 1.16211 6.07446 1.42578 5.6936 1.76562C5.31274 2.10547 4.99927 2.50391 4.75317 2.96094C4.50708 
                                       3.41797 4.34888 3.91016 4.27856 4.4375H3.7688C3.40552 4.4375 3.0686 4.44043 2.75806 4.44629C2.44751 4.45215 2.16919 4.47266 1.9231 4.50781C1.66528 4.54297 1.42505 4.60449 1.20239 
                                       4.69238C0.979736 4.78027 0.780518 4.92383 0.604736 5.12305C0.428955 5.32227 0.308838 5.53906 0.244385 5.77344C0.179932 6.00781 0.141846 6.25391 0.130127 6.51172C0.130127 6.74609 
                                       0.144775 7.01855 0.174072 7.3291C0.203369 7.63965 0.235596 7.98242 0.270752 8.35742L0.499268 10.4316C0.593018 11.2051 0.677979 11.8994 0.75415 12.5146C0.830322 13.1299 0.927002 
                                       13.6777 1.04419 14.1582C1.16138 14.6387 1.31665 15.0693 1.51001 15.4502C1.70337 15.8311 1.95825 16.168 2.27466 16.4609C2.60278 16.7539 2.96899 16.9736 3.37329 17.1201C3.77759 
                                       17.2666 4.22583 17.375 4.71802 17.4453C5.21021 17.5039 5.76978 17.5391 6.39673 17.5508C7.02368 17.5625 7.72974 17.5684 8.51489 17.5684H8.58521C9.37036 17.5684 10.0764 17.5625 
                                       10.7034 17.5508C11.3303 17.5391 11.8899 17.5039 12.3821 17.4453C12.8743 17.375 13.3225 17.2666 13.7268 17.1201C14.1311 16.9736 14.4973 16.7539 14.8254 16.4609C15.1418 16.168 
                                       15.3967 15.8311 15.5901 15.4502C15.7834 15.0693 15.9387 14.6387 16.0559 14.1582C16.1731 13.6777 16.2698 13.1299 16.3459 12.5146C16.4221 11.8994 16.5071 11.2051 16.6008 10.4316L16.8293 
                                       8.35742C16.8645 7.98242 16.8967 7.63965 16.926 7.3291C16.9553 7.01855 16.97 6.74609 16.97 6.51172C16.9583 6.25391 16.9202 6.00781 16.8557 5.77344C16.7913 5.53906 16.6711 5.32227 16.4954 
                                       5.12305C16.3196 4.92383 16.1204 4.78027 15.8977 4.69238C15.675 4.60449 15.4348 4.54297 15.177 4.50781C14.9309 4.47266 14.6526 4.45215 14.342 4.44629C14.0315 4.44043 13.6946 4.4375 13.3313 
                                       4.4375H12.8215C12.7512 3.91016 12.593 3.41797 12.3469 2.96094C12.1008 2.50391 11.7874 2.10547 11.4065 1.76562C11.0256 1.42578 10.5891 1.16211 10.0969 0.974609C9.61646 0.787109 9.10083 0.693359 
                                       8.55005 0.693359ZM8.55005 1.81836C9.33521 1.81836 10.0208 2.06738 10.6067 2.56543C11.1926 3.06348 11.5559 3.6875 11.6965 4.4375H5.40356C5.54419 3.6875 5.90747 3.06348 6.49341 2.56543C7.07935 
                                       2.06738 7.76489 1.81836 8.55005 1.81836ZM1.44849 5.87891C1.49536 5.82031 1.56567 5.77051 1.65942 5.72949C1.75317 5.68848 1.8938 5.65039 2.0813 5.61523C2.28052 5.5918 2.52075 5.57715 2.802 
                                       5.57129C3.08325 5.56543 3.4231 5.5625 3.82153 5.5625H13.2786C13.677 5.5625 14.0168 5.56543 14.2981 5.57129C14.5793 5.57715 14.8196 5.5918 15.0188 5.61523C15.2063 5.65039 15.3469 5.68848 
                                       15.4407 5.72949C15.5344 5.77051 15.6047 5.82031 15.6516 5.87891C15.6985 5.92578 15.7395 5.99902 15.7747 6.09863C15.8098 6.19824 15.8333 6.3418 15.845 6.5293C15.845 6.74023 15.8333 6.9834 
                                       15.8098 7.25879C15.7864 7.53418 15.7512 7.87109 15.7043 8.26953L15.4758 10.2734C15.3938 11.0703 15.3147 11.7617 15.2385 12.3477C15.1624 12.9336 15.0715 13.4434 14.9661 13.877C14.8606 14.3105 
                                       14.7375 14.665 14.5969 14.9404C14.4563 15.2158 14.2805 15.4414 14.0696 15.6172C13.8586 15.8047 13.6096 15.9541 13.3225 16.0654C13.0354 16.1768 12.6692 16.2617 12.2239 16.3203C11.7786 16.3789 
                                       11.2571 16.4141 10.6594 16.4258C10.0618 16.4375 9.35864 16.4434 8.55005 16.4434C7.74146 16.4434 7.03833 16.4375 6.44067 16.4258C5.84302 16.4141 5.32153 16.3789 4.87622 16.3203C4.43091 16.2617 
                                       4.0647 16.1768 3.77759 16.0654C3.49048 15.9541 3.24146 15.8047 3.03052 15.6172C2.81958 15.4414 2.6438 15.2158 2.50317 14.9404C2.36255 14.665 2.2395 14.3105 2.13403 13.877C2.02856 13.4434 1.93774 
                                       12.9336 1.86157 12.3477C1.7854 11.7617 1.7063 11.0703 1.62427 10.2734L1.39575 8.26953C1.34888 7.87109 1.31372 7.53418 1.29028 7.25879C1.26685 6.9834 1.25513 6.74023 1.25513 6.5293C1.26685 6.3418 
                                       1.29028 6.19824 1.32544 6.09863C1.3606 5.99902 1.40161 5.92578 1.44849 5.87891Z"
                    />
                  </svg>
                  {1 > 0 && (
                    <span className="absolute bottom-3 left-4 text-xs text-white bg-accent-900 rounded-full w-3 h-3 flex items-center justify-center">
                      {1}
                    </span>
                  )}
                </Link>
                <div className="text-sm font-medium text-gray-700">
                  <UserDropdown />
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <CtaButton text="Đăng nhập" onClick={() => showModal('login')} />
                <BubbleButton onClick={() => showModal('signup')}>Đăng kí</BubbleButton>
              </div>
            )}
          </div>
        </div>
      </header >

      {/* Cart Drawer */}
      < div className={`transition-all duration-300 ease-in-out ${isCartOpen ? 'mr-96' : ''}`
      } />
      {
        isCartOpen && (
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg px-6 py-8 z-40">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">Your cart is empty.</p>
            <Button
              onClick={() => setIsCartOpen(false)}
              variant="primary"
              showArrow={false}
              className="mt-4 w-full"
            >
              Continue Shopping
            </Button>
          </div>
        )
      }
    </>
  );
};

export default Header;
