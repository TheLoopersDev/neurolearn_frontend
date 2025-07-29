'use client';

import { Button } from '@/components/common/ui/Button2';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useState, Fragment } from 'react';
import { Dialog } from '@headlessui/react';

interface CartSummaryProps {
  courses: {
    _id: string;
    price: number;
    quantity: number;
  }[];
}

const formatVND = (amount: number): string => {
  return `${amount.toLocaleString('en-US')} VND`;
};

export function CartSummary({ courses }: CartSummaryProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = courses.reduce((sum, course) => sum + (course.price || 0) * course.quantity, 0);
  const totalCost = subtotal;

  const handleCheckout = async () => {
    if (courses.length === 0) return;

    try {
      setLoading(true);

      const courseIds = courses.map((course) => course._id);
      const licenseQuantities: Record<string, number> = {};

      courses.forEach((course) => {
        licenseQuantities[course._id] = course.quantity;
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/payment/create-payment-link`,
        {
          amount: totalCost,
          description: 'Buy courses from Academix',
          courseIds,
          licenseQuantities,
        },
        { withCredentials: true }
      );

      if (res.data?.checkoutUrl) {
        await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/clear-cart`, {
          withCredentials: true,
        });
        window.location.href = res.data.checkoutUrl;
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create payment link',
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Unable to create payment link',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Items ({courses.reduce((sum, item) => sum + item.quantity, 0)})
          </p>
          <p className="font-semibold text-gray-900">{formatVND(subtotal)}</p>
        </div>
      </div>


      {/* Total */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-lg font-bold text-gray-900">Total Cost</p>
        <p className="text-xl font-bold text-gray-900">{formatVND(totalCost)}</p>
      </div>

      <Button
        disabled={courses.length === 0 || loading}
        variant="default"
        size="lg"
        className="mt-6 w-full"
        onClick={() => setIsOpen(true)}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
      <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
              Do you want to buy course?
            </Dialog.Title>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleCheckout();
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
