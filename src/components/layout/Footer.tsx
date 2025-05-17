"use client";

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';

const Footer = () => {
  const { showModal } = useModal();
  
  return (
    <footer className="bg-gray-100 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">A</span>cademix
              </Link>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              We would love to hear from you.
            </p>
          </div>
          <div className="max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              />
              <Button onClick={() => showModal('login')} variant="primary" showArrow={false} className="text-sm">
                Contact us
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm border-t pt-8">
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact us</h4>
            <p className="text-gray-600 mb-1 text-xs">info@eduio.com</p>
            <p className="text-gray-600 mb-1 text-xs">+1 (123) 456-7890</p>
            <p className="text-gray-600 text-xs">123 Education St, New York, USA</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Follow us</h4>
            <div className="flex gap-2">
              <Link href="#" className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                <Image src="/assets/home/Facebook.svg" alt="Facebook" width={16} height={16} />
              </Link>
              <Link href="#" className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                <Image src="/assets/home/Linkedin.svg" alt="LinkedIn" width={16} height={16} />
              </Link>
              <Link href="#" className="w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                <Image src="/assets/home/Mail.svg" alt="Mail" width={16} height={16} />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 text-xs hover:text-blue-600">Online Courses</Link></li>
              <li><Link href="#" className="text-gray-600 text-xs hover:text-blue-600">Live Webinars</Link></li>
              <li><Link href="#" className="text-gray-600 text-xs hover:text-blue-600">Certification</Link></li>
              <li><Link href="#" className="text-gray-600 text-xs hover:text-blue-600">Career Guidance</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-xs text-gray-500 text-center">
          &copy; 2023 EDUIO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;