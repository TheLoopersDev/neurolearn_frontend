'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import InviteModal, { Invitee } from './InviteModal';

// --- Định nghĩa interface và mock data ---
export interface Avatar {
    id: string;
    avatarUrl: string;
}

export interface Course {
    _id: string;
    name: string;
    subTitle: string;
    thumbnailUrl: string;
    category: string;
    purchaseDate: string;
    totalCourses: number;
    assignedAvatars: Avatar[];
    extraAvatarsCount: number;
    progress: number; // 0–100
}

const mockInvitees: Invitee[] = [
    {
        id: '1',
        name: 'Dao Tuan Kiet',
        email: 'kietdtqe170088@gmail.com',
        avatarUrl: '/assets/images/avatar.png',
        status: 'Received',
    },
    {
        id: '2',
        name: 'Nguyen Van A',
        email: 'vana@example.com',
        avatarUrl: '/assets/images/avatar.png',
        status: 'Invited',
    },
    {
        id: '3',
        name: 'Le Thi B',
        email: 'leb@example.com',
        avatarUrl: '/assets/images/avatar.png',
        status: 'Cancelled',
    },
];

export const mockCoursesData: Course[] = [
    {
        _id: '1',
        name: 'USER INTERFACE DESIGN COURSE (APP/ WEBSITE)',
        subTitle: 'Master Adobe Photoshop and Figma for modern UI/UX design.',
        thumbnailUrl: '/assets/images/banner.png',
        category: 'Graphic Design',
        purchaseDate: '04 Jan, 2025',
        totalCourses: 10,
        assignedAvatars: [
            { id: 'a1', avatarUrl: '/assets/images/avatar.png' },
            { id: 'a2', avatarUrl: '/assets/images/avatar.png' },
            { id: 'a3', avatarUrl: '/assets/images/avatar.png' },
        ],
        extraAvatarsCount: 10,
        progress: 80,
    },
    {
        _id: '2',
        name: 'DATA SCIENCE AND MACHINE LEARNING BOOTCAMP',
        subTitle: 'Learn Python, Pandas, and Scikit-learn from scratch.',
        thumbnailUrl: '/assets/images/banner.png',
        category: 'Data Science',
        purchaseDate: '20 Feb, 2025',
        totalCourses: 12,
        assignedAvatars: [
            { id: 'b1', avatarUrl: '/assets/images/avatar.png' },
            { id: 'b2', avatarUrl: '/assets/images/avatar.png' },
        ],
        extraAvatarsCount: 4,
        progress: 55,
    },
    {
        _id: '3',
        name: 'THE ULTIMATE REACT DEVELOPMENT COURSE',
        subTitle: 'Build amazing front-end applications with React and Next.js.',
        thumbnailUrl: '/assets/images/banner.png',
        category: 'Web Development',
        purchaseDate: '10 Mar, 2025',
        totalCourses: 8,
        assignedAvatars: [
            { id: 'c1', avatarUrl: '/assets/images/avatar.png' },
            { id: 'c2', avatarUrl: '/assets/images/avatar.png' },
            { id: 'c3', avatarUrl: '/assets/images/avatar.png' },
            { id: 'c4', avatarUrl: '/assets/images/avatar.png' },
        ],
        extraAvatarsCount: 2,
        progress: 30,
    },
];

// --- Component CourseCard ---
interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {

    const [isInviteOpen, setIsInviteOpen] = useState(false);

    return (
        <>
            <Link
                href={`/business/mycourses/${course._id}`}
                className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
                {/* HEADER: Thumbnail + (Category + Title) */}
                <div className="flex items-start p-5 gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-40 h-20 flex-shrink-0">
                        <Image
                            src={course.thumbnailUrl}
                            alt={course.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col w-full ">
                        {/* Row 1: Category (left) + Invite Icon (right) */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Image
                                    src="/assets/icons/tag.svg"
                                    alt="Tag Icon"
                                    height={20}
                                    width={20}
                                />
                                <span className="text-blue-600 text-sm font-medium">
                                    {course.category}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsInviteOpen(true);
                                }}
                                className="flex-shrink-0"
                            >
                                <Image
                                    src="/assets/icons/invite.svg"
                                    alt="Invite Icon"
                                    height={40}
                                    width={40}
                                />
                            </button>
                        </div>
                        {/* Row 2: Course Name */}
                        <h3 className="text-lg font-semibold text-black leading-snug">
                            {course.name}
                        </h3>
                    </div>
                </div>
                {/* BODY: Info Row, Avatars, Progress */}
                <div className="px-5 pb-5 flex flex-col gap-4">
                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 gap-2">
                        {/* Date / Courses / Count */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{course.purchaseDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>Total Courses: {course.totalCourses}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>+{course.extraAvatarsCount}</span>
                            </div>
                        </div>
                        {/* Avatars Stack */}
                        <div className="flex items-center -space-x-2">
                            {course.assignedAvatars.slice(0, 3).map((u) => (
                                <Image
                                    key={u.id}
                                    src={u.avatarUrl}
                                    width={32}
                                    height={32}
                                    alt="avatar"
                                    className="rounded-full border-2 border-white"
                                />
                            ))}
                            {/* Tính số avatar còn lại */}
                            {course.assignedAvatars.length > 3 && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                                    +{course.assignedAvatars.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-black mt-1 block">
                            {course.progress}%
                        </span>
                    </div>
                </div>
            </Link>
            <InviteModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                course={course}
                invitees={mockInvitees}
            />
        </>
    );
}
