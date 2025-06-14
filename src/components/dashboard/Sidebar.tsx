'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons
import dashboard from '@/public/assets/icons/dashboard.svg';
import courses from '@/public/assets/icons/book.svg';
import createQuiz from '@/public/assets/icons/create.svg';
import earning from '@/public/assets/icons/wallet.svg';
import message from '@/public/assets/icons/message.svg';
import setting from '@/public/assets/icons/setting.svg';
import teacher from '@/public/assets/icons/teacher.svg';

const menuItems = [
  { icon: dashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: courses, label: 'Courses', path: '/dashboard/courses' },
  { icon: createQuiz, label: 'Create Quiz', path: '/dashboard/create-quiz' },
  { icon: earning, label: 'Earning', path: '/dashboard/earning' },
  { icon: teacher, label: 'Teacher', path: '/dashboard/teacher' },
  { icon: message, label: 'Message', path: '/dashboard/message' },
  { icon: setting, label: 'Setting', path: '/dashboard/setting' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full h-screen  bg-white flex flex-col items-start p-4 border-r">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 h-20">
        <Image
          src="/assets/images/avatar.png"
          alt="Academix Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <h1 className="text-4xl font-bold text-black">Academix</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-4 w-full">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xl font-medium transition-all h-15 ${
                isActive
                  ? 'bg-gray-100 text-[#3858F8]'
                  : 'text-black hover:text-[#3858F8] hover:bg-gray-50'
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`transition-colors ${
                  isActive
                    ? 'filter-blue'
                    : 'group-hover:filter-blue'
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
