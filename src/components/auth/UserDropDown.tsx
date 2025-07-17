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
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

export function UserDropdown() {
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Type the refetch function if possible, or leave as any if its signature is complex/unknown
  const { refetch: logoutApi } = useLogoutQuery(undefined, { skip: !logoutTriggered });

  const logoutHandler = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    setLogoutTriggered(true); // Trigger API call
    // await signOutAction(); // This might be redundant if next-auth signOut and API logout handle session clearing
    // await logoutApi(); // This will be called due to logoutTriggered changing state if skip condition is met
    // router.push('/'); // Let useEffect handle redirection based on session and logoutTriggered
  };

  useEffect(() => {
    // This effect handles the API call for logout when logoutTriggered becomes true
    if (logoutTriggered) {
      logoutApi()
        .then(() => {
          signOutAction().then(() => {
            // Call signOutAction after API logout
            if (!session) {
              // Check session *after* logout actions
              router.push('/');
            }
          });
        })
        .catch(error => {
          console.error('Logout API call failed:', error);
          // Optionally, still try to redirect or show an error
          router.push('/');
        });
    }
  }, [logoutTriggered, logoutApi, router, session]); // Added session here to re-evaluate if it changes during the process

  useEffect(() => {
    // This effect handles redirection if the session is lost for other reasons while logout was triggered
    if (!session && logoutTriggered) {
      router.push('/');
    }
    // --- START OF FIX ---
    // Added 'router' to the dependency array
  }, [session, logoutTriggered, router]);
  // --- END OF FIX ---

  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return null;
  }

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


  const dropdownList =
    typeof user !== 'string' && user.role === 'instructor'
      ? [
        {
          title: 'Dashboard User',
          href: '/dashboard',
          icon: (
            <Image
              src={UserIcon}
              alt="Dashboard User"
              width={20}
              height={20}
            />
          ),
        },
        {
          title: 'Switch to Instructor',
          href: '/switch/instructor',
          icon: (
            <Image
              src={InstructorIcon}
              alt="Instructor"
              width={20}
              height={20}
            />
          ),
        },
        {
          title: 'Switch to Business',
          href: '/switch/business',
          icon: (
            <Image
              src={BusinessIcon}
              alt="Business"
              width={20}
              height={20}
            />
          ),
        },
        {
          title: 'Terms of Service',
          href: '/terms',
          icon: (
            <Image
              src={TermsIcon}
              alt="Terms"
              width={20}
              height={20}
            />
          ),
        },
        {
          title: 'Help & Support',
          href: '/help',
          icon: (
            <Image
              src={HelpIcon}
              alt="Help"
              width={20}
              height={20}
            />
          ),
        },
        ...commonNavbarItems,
      ]
      : [
        {
          title: 'Watch Course',
          href: '/dashboard/watch-course',
          icon: (
            <MdOutlineDashboardCustomize className="text-[20px]" />
          ),
        },
        ...commonNavbarItems,
      ];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 sm:gap-3 p-[7px_9px] bg-white rounded-full h-14 w-fit cursor-pointer transition hover:shadow">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#B8DFF2] overflow-hidden flex items-center justify-center">
            <Image
              className="w-full h-full object-cover rounded-full"
              width={40}
              height={40}
              src={typeof user !== 'string' && user?.avatar?.url ? user.avatar.url : defaultAvatar}
              alt={typeof user !== 'string' && user?.name ? user.name : 'User Avatar'}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Name + Arrow */}
          <div className="flex items-center gap-1 sm:gap-2 w-auto">
            <span className="font-medium text-base text-black whitespace-nowrap hidden md:inline">
              {typeof user !== 'string' ? user?.name : 'Guest'}
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
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[248px] rounded-[20px] p-3 bg-white shadow-lg border border-gray-100">
        {/* Label */}
        <DropdownMenuLabel className="px-3 py-2 text-sm text-gray-500"></DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 border-t border-gray-200" />

        {/* Items */}
        <DropdownMenuGroup>
          {dropdownList.map(item => (
            <Link href={item.href} key={item.title} passHref legacyBehavior>
              <DropdownMenuItem asChild>
                <a className="flex items-center gap-3 px-3 py-[14px] hover:bg-gray-100 rounded-xl text-black w-full text-[15px] font-medium">
                  {item.icon}
                  {item.title}
                </a>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 border-t border-gray-200" />

        {/* Logout */}
        <DropdownMenuItem asChild>
          <button
            onClick={logoutHandler}
            className="flex items-center gap-3 px-3 py-[14px] text-red-600 hover:bg-red-50 rounded-xl w-full text-[15px] font-medium"
          >
            <Image
              src={LogoutIcon}
              alt="Dashboard User"
              width={20}
              height={20}
            />
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
