'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import { MdOutlineDashboardCustomize, MdOutlineSlowMotionVideo } from 'react-icons/md';
import { TbMessageDots } from 'react-icons/tb';
import { FaRegCircleQuestion, FaRegHeart } from 'react-icons/fa6';
import { PiBagBold } from 'react-icons/pi';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/common/ui/DropdownMenu';

import defaultAvatar from '@/public/assets/images/avatar.png';
import { signOutAction } from '@/lib/actions/auth';
import { useLogoutQuery } from '@/lib/redux/features/auth/authApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

// Define a more specific type for the user object if possible
interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'user' | string; // Be more specific if roles are fixed
  avatar?: {
    url?: string;
  };
  // other user properties
}

interface LoadUserResponse {
  user: User;
  // other properties in the response
}

export function UserDropdown() {
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Provide a type for the data returned by useLoadUserQuery
  const { data, isLoading } = useLoadUserQuery(undefined) as {
    data?: LoadUserResponse;
    isLoading: boolean;
  };

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

  if (isLoading || !data?.user) {
    // Added a check for data.user to prevent errors if data is null/undefined
    // You might want to return a loading skeleton or null
    return null;
  }

  const { user } = data;

  const commonNavbarItems = [
    {
      title: 'Order',
      href: '/dashboard/orders',
      icon: <PiBagBold className="text-[20px]" />,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: <IoSettingsOutline className="text-[20px]" />,
    },
  ];

  const instructorNavbarItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/instructor',
      icon: <MdOutlineDashboardCustomize className="text-[20px]" />,
    },
    {
      title: 'My Course',
      href: '/dashboard/instructor/my-course',
      icon: <MdOutlineSlowMotionVideo className="text-[20px]" />,
    },
    {
      title: 'Reviews',
      href: '/dashboard/instructor/reviews',
      icon: <TbMessageDots className="text-[20px]" />,
    },
    {
      title: 'Wishlist',
      href: '/dashboard/instructor/wishlist',
      icon: <FaRegHeart className="text-[20px]" />,
    },
    {
      title: 'Quizzes',
      href: '/dashboard/quizzes',
      icon: <FaRegCircleQuestion className="text-[20px]" />,
    },
  ];

  const userNavbarItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/user',
      icon: <MdOutlineDashboardCustomize className="text-[20px]" />,
    },
  ];

  const dropdownList =
    user.role === 'instructor'
      ? [...instructorNavbarItems, ...commonNavbarItems]
      : [...userNavbarItems, ...commonNavbarItems];

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
              src={user?.avatar?.url ?? defaultAvatar}
              alt={user.name ?? 'User Avatar'}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Name + Arrow */}
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
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-blue-600">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropdownList.map(item => (
            <Link href={item.href} key={item.href} passHref legacyBehavior>
              <DropdownMenuItem asChild>
                <a className="flex items-center justify-between w-full">
                  {' '}
                  {/* Ensure 'a' tag takes full width for proper click */}
                  {item.title}
                  <DropdownMenuShortcut>{item.icon}</DropdownMenuShortcut>
                </a>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={logoutHandler}
            className="flex w-full items-center justify-between text-left text-red-600 hover:text-red-700"
          >
            Log out
            <DropdownMenuShortcut>
              <IoIosLogOut className="text-xl" />
            </DropdownMenuShortcut>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
