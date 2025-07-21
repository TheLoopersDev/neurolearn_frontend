import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import type { CartCourse } from '../page';

interface CartItemProps {
  course: CartCourse;
  onRemove: (courseId: string) => void;
  onQuantityChange: (courseId: string, newQuantity: number) => void;
}

// Hàm tiện ích để định dạng tiền tệ
const formatVND = (amount: number): string => {
  // Định dạng số với dấu phẩy ngăn cách hàng nghìn và thêm "VND"
  return `${amount.toLocaleString('en-US')}VND`;
};

export function CartItem({ course, onRemove, onQuantityChange }: CartItemProps) {
  const totalPrice = (course.price || 0) * course.quantity;

  const handleIncrease = () => {
    onQuantityChange(course._id, course.quantity + 1);
  };

  const handleDecrease = () => {
    onQuantityChange(course._id, course.quantity - 1);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-4 px-6 py-4 md:grid-cols-6">
      {/* --- Product Details --- */}
      <div className="col-span-1 flex items-center gap-4 md:col-span-3">
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
          <Image src={course.thumbnail.url} alt={course.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-600">By {course.author.name}</p>
          <button
            onClick={() => onRemove(course._id)}
            className="mt-1 text-sm font-medium hover:cursor-pointer text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      {/* --- Quantity --- */}
      <div className="flex items-center justify-start gap-2 md:justify-center">
        <button
          onClick={handleDecrease}
          disabled={course.quantity <= 1}
          className="rounded-full p-1.5 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4 text-gray-700 hover:cursor-pointer" />
        </button>
        <span className="w-8 text-center text-base font-medium text-gray-900">
          {course.quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="rounded-full p-1.5 transition-colors hover:bg-gray-200"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4 text-gray-700 hover:cursor-pointer" />
        </button>
      </div>

      {/* --- Price (Updated Format) --- */}
      <div className="hidden text-right font-semibold text-gray-900 md:block">
        {course.price ? formatVND(course.price) : 'Free'}
      </div>

      {/* --- Total (Updated Format) --- */}
      <div className="text-right font-semibold text-gray-900">
        {totalPrice > 0 ? formatVND(totalPrice) : 'Free'}
      </div>
    </div>
  );
}
