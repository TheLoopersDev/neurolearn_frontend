'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { PiBagBold } from 'react-icons/pi';
import UserIcon from '@/public/assets/home/user-dropdown/iconsax-user.svg';
import InstructorIcon from '@/public/assets/home/user-dropdown/iconsax-teacher.svg';
import BusinessIcon from '@/public/assets/home/user-dropdown/iconsax-building.svg';
import TermsIcon from '@/public/assets/home/user-dropdown/iconsax-clipboard-text.svg';
import HelpIcon from '@/public/assets/home/user-dropdown/iconsax-info-circle.svg';
import LogoutIcon from '@/public/assets/home/user-dropdown/logout.svg';
import { AnimatePresence, motion } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/ui/DropdownMenu';

import defaultAvatar from '@/public/assets/images/avatar.png';
import { signOutAction } from '@/lib/actions/auth';
import { useLogoutQuery } from '@/lib/redux/features/auth/authApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'user' | string;
  avatar?: {
    url?: string;
  };
  businessInfo?: {
    businessId?: string;
    role?: string;
  };
}

interface LoadUserResponse {
  user: User;
}

export function UserDropdown() {
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading } = useLoadUserQuery(undefined) as {
    data?: LoadUserResponse;
    isLoading: boolean;
  };
  const { refetch: logoutApi } = useLogoutQuery(undefined, { skip: !logoutTriggered });

  const logoutHandler = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    setLogoutTriggered(true);
  };

  useEffect(() => {
    if (logoutTriggered) {
      logoutApi()
        .then(() => {
          signOutAction().then(() => {
            if (!session) {
              router.push('/');
            }
          });
        })
        .catch(error => {
          console.error('Logout API call failed:', error);
          router.push('/');
        });
    }
  }, [logoutTriggered, logoutApi, router, session]);

  useEffect(() => {
    if (!session && logoutTriggered) {
      router.push('/');
    }
  }, [session, logoutTriggered, router]);

  if (isLoading || !data?.user) {
    return null;
  }

  const { user } = data;
  const isBusinessAdminOrManager =
    user?.businessInfo?.role === 'admin' || user?.businessInfo?.role === 'manager';

  const commonNavbarItems = [
    {
      title: 'Order History',
      href: '/dashboard/purchase-history',
      icon: <PiBagBold className="text-[20px]" />,
    },
    {
      title: 'Settings',
      href: '/dashboard/setting',
      icon: <IoSettingsOutline className="text-[20px]" />,
    },
  ];

  const businessDashboardItem = isBusinessAdminOrManager
    ? [
      {
        title: 'Business Dashboard',
        href: `/business/dashboard/${user.businessInfo?.businessId}`,
        icon: <Image src={BusinessIcon} alt="Business Dashboard" width={20} height={20} />,
      },
    ]
    : [];

  const dropdownList =
    user.role === 'instructor'
      ? [
        {
          title: 'Dashboard User',
          href: '/dashboard',
          icon: <Image src={UserIcon} alt="Dashboard User" width={20} height={20} />,
        },
        {
          title: 'Switch to Instructor',
          href: '/switch/instructor',
          icon: <Image src={InstructorIcon} alt="Instructor" width={20} height={20} />,
        },
        {
          title: 'Switch to Business',
          href: '/switch/business',
          icon: <Image src={BusinessIcon} alt="Business" width={20} height={20} />,
        },
        ...businessDashboardItem,
        {
          title: 'Terms of Service',
          href: '/terms',
          icon: <Image src={TermsIcon} alt="Terms" width={20} height={20} />,
        },
        {
          title: 'Help & Support',
          href: '/help',
          icon: <Image src={HelpIcon} alt="Help" width={20} height={20} />,
        },
        ...commonNavbarItems,
      ]
      : [
        {
          title: 'Watch Course',
          href: '/dashboard/watch-course',
          icon: <MdOutlineDashboardCustomize className="text-[20px]" />,
        },
        ...businessDashboardItem,
        ...commonNavbarItems,
      ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        mass: 0.5
      }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300
      }
    })
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 sm:gap-3 p-[7px_9px] bg-white rounded-full h-14 w-fit cursor-pointer transition hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#B8DFF2] overflow-hidden flex items-center justify-center">
            <Image
              className="w-full h-full object-cover rounded-full"
              width={40}
              height={40}
              src={user?.avatar?.url ?? defaultAvatar}
              alt={user.name ?? 'User Avatar'}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 w-auto">
            <span className="font-medium text-base text-black whitespace-nowrap hidden md:inline">
              {user.name}
            </span>
            <svg
              className="w-[15.5px] h-[8.5px]"
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L8 8L15 1" stroke="#000" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        <DropdownMenuContent
          asChild
          forceMount
          className="w-[248px] rounded-[20px] p-3 bg-white shadow-lg border border-gray-100"
        >
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DropdownMenuLabel className="px-3 py-2 text-sm text-gray-500" />
            <DropdownMenuSeparator className="my-2 border-t border-gray-200" />

            <DropdownMenuGroup>
              {dropdownList.map((item, index) => (
                <Link href={item.href} key={item.title} passHref legacyBehavior>
                  <DropdownMenuItem asChild>
                    <motion.a
                      className="flex items-center gap-3 px-3 py-[14px] hover:bg-gray-100 rounded-xl text-black w-full text-[15px] font-medium"
                      variants={itemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.icon}
                      {item.title}
                    </motion.a>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 border-t border-gray-200" />
            <DropdownMenuItem asChild>
              <motion.button
                onClick={logoutHandler}
                className="flex items-center gap-3 px-3 py-[14px] text-red-600 hover:bg-red-50 rounded-xl w-full text-[15px] font-medium"
                variants={itemVariants}
                custom={dropdownList.length}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image src={LogoutIcon} alt="Sign Out" width={20} height={20} />
                Sign Out
              </motion.button>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}