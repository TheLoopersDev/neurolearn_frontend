'use client';

import { useState } from 'react';
import { CartItemList } from './_components/CartItemsList';
import { CartSummary } from './_components/CartSummary';
import type { Course } from '@/types/course';

// Định nghĩa một kiểu mới cho sản phẩm trong giỏ hàng, bao gồm cả số lượng
export type CartCourse = Course & { quantity: number };

// Dữ liệu giả bây giờ sẽ bao gồm cả 'quantity'
const mockCourses: CartCourse[] = [
  {
    _id: '1',
    name: 'The Complete Next.js Developer Course',
    author: { _id: 'author1', name: 'John Doe', email: 'john@a.com', profession: 'Developer' },
    price: 599000,
    thumbnail: { url: 'https://via.placeholder.com/128x96' },
    reviews: [],
    benefits: [],
    prerequisites: [],
    sections: [],
    rating: 5,
    purchased: 100,
    isPublished: true,
    isFree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quantity: 1, // Thêm số lượng mặc định
  },
  {
    _id: '2',
    name: 'Master Tailwind CSS in 1 Hour',
    author: { _id: 'author2', name: 'Jane Smith', email: 'jane@a.com', profession: 'Designer' },
    price: 299000,
    thumbnail: { url: 'https://via.placeholder.com/128x96' },
    reviews: [],
    benefits: [],
    prerequisites: [],
    sections: [],
    rating: 4.8,
    purchased: 250,
    isPublished: true,
    isFree: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quantity: 2, // Thêm số lượng mặc định
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartCourse[]>(mockCourses);

  const handleRemoveItem = (courseId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== courseId));
  };

  const handleQuantityChange = (courseId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        // Đảm bảo số lượng không nhỏ hơn 1
        item._id === courseId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Updated Header */}
      <div className="mb-8 flex items-baseline justify-between border-b border-gray-200 pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <p className="text-lg font-semibold text-gray-900">
          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <CartItemList
            courses={cartItems}
            onRemoveItem={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />
        </section>

        <aside className="lg:col-span-1">
          <CartSummary courses={cartItems} />
        </aside>
      </div>
    </main>
  );
}
