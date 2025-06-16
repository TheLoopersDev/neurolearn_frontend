// src/components/course/CourseCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Course } from '@/types/course';
import { User } from '@/types/user'; // Import User type

// <<-- SỬA Ở ĐÂY: Thêm 'author' vào interface -->>
interface CourseCardProps {
  course: Course;
  author?: User; // Thêm prop 'author', có thể là optional
}

const CourseCard: React.FC<CourseCardProps> = ({ course, author }) => {
  // Hàm định dạng giá tiền
  const formatPrice = (price: number): string => {
    if (course.isFree) return 'Free';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const originalPrice =
    course.estimatedPrice || (course.price && course.price > 0 ? course.price * 1.5 : 0);
  const reviewCount = course.reviews?.length || 0;

  // Giờ đây chúng ta có thể sử dụng prop 'author' một cách an toàn
  const authorName = author?.name || 'Instructor Name';
  const authorAvatar = author?.avatar?.url || '/assets/images/avatar.png';
  const authorProfession = author?.profession || 'Instructional Expert';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Phần Header của Card: Sử dụng dữ liệu từ prop 'author' */}
      <div className="p-3 flex items-center gap-3 border-b border-gray-100">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={authorAvatar}
            alt={authorName}
            fill
            sizes="40px"
            className="rounded-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-grow">
          <h4 className="font-semibold text-sm text-gray-800 truncate">{authorName}</h4>
          <p className="text-xs text-gray-500 truncate">{authorProfession}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Add to wishlist"
          >
            <Heart size={18} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* ẢNH BÌA KHÓA HỌC */}
      <div className="relative w-full aspect-video bg-gray-200">
        <Link href={`/courses/${course._id}`} className="block w-full h-full">
          <Image
            src={course.thumbnail?.url || '/assets/create-quiz/thumbnail.png'}
            alt={course.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* PHẦN NỘI DUNG TEXT CỦA CARD */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 leading-tight h-14 line-clamp-2 mb-1.5">
          <Link href={`/courses/${course._id}`} className="hover:text-blue-600 transition-colors">
            {course.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 h-10 line-clamp-2 mb-3">
          {course.subTitle || course.description}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-gray-800">{course.rating.toFixed(1)}</span>
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-gray-400 text-xs">
            ({reviewCount.toLocaleString()} Review rating)
          </span>
        </div>

        <div className="flex-grow"></div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {originalPrice > (course.price || 0) && (
            <span className="text-base text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-xl font-bold text-blue-600">{formatPrice(course.price || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
