'use client';

import { useEffect, useState } from 'react';
import { CartItemList } from './_components/CartItemsList';
import { CartSummary } from './_components/CartSummary';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';


export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/cart-items`, {
          withCredentials: true,
        });

        const rawItems = res.data.cart.items;

        const formattedItems: any[] = rawItems.map((item: any) => ({
          ...item.courseId,
          quantity: item.quantity,
        }));

        setCartItems(formattedItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (courseId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/cart/remove-item`,
        {
          data: { courseId },
          withCredentials: true,
        }
      );

      setCartItems(prev => prev.filter(item => item._id !== courseId));
      toast({ title: 'Item removed successfully', variant: 'success' });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({ title: 'Failed to remove item', variant: 'destructive' });
    }
  };

  const handleQuantityChange = async (courseId: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity);
    setCartItems(prev =>
      prev.map(item => (item._id === courseId ? { ...item, quantity } : item))
    );

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/cart/update-quantity`,
        { courseId, quantity },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast({ title: 'Failed to update quantity', variant: 'destructive' });
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return <p className="p-4 text-gray-500">Loading cart...</p>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
            role={user?.businessInfo?.role}
          />
        </section>

        <aside className="lg:col-span-1">
          <CartSummary courses={cartItems} />
        </aside>
      </div>
    </main>
  );
}
