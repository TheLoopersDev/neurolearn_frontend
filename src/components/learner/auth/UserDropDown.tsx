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

export function UserDropdown() {
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const { data, isLoading } = useLoadUserQuery(undefined);
  const { refetch: logoutApi } = useLogoutQuery(undefined, { skip: !logoutTriggered });

  const logoutHandler = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    setLogoutTriggered(true);
    await signOutAction();
    await logoutApi();
    router.push('/');
  };

  useEffect(() => {
    if (!session && logoutTriggered) {
      // fallback push nếu cần
      router.push('/');
    }
  }, [session, logoutTriggered]);

  if (isLoading) return null;

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
        <div className="h-[60px] flex items-center gap-3 cursor-pointer ">
          <Image
            className="h-8 rounded-full"
            width={32}
            height={32}
            src={user?.avatar?.url ?? defaultAvatar}
            alt={user.name ?? 'User Avatar'}
            referrerPolicy="no-referrer"
          />
          <span className="font-medium">{user.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-blue-600">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropdownList.map(item => (
            <Link href={item.href} key={item.href}>
              <DropdownMenuItem>
                {item.title}
                <DropdownMenuShortcut>{item.icon}</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={logoutHandler}
            className="flex w-full items-center justify-between text-left text-red-600 hover:text-red-800"
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
