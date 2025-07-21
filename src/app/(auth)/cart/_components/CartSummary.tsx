import { Button } from '@/components/common/ui/Button2';
import type { CartCourse } from '../page';

interface CartSummaryProps {
  courses: CartCourse[];
}

// Hàm tiện ích để định dạng tiền tệ
const formatVND = (amount: number): string => {
  // Định dạng số với dấu phẩy ngăn cách hàng nghìn và thêm "VND"
  return `${amount.toLocaleString('en-US')}VND`;
};

export function CartSummary({ courses }: CartSummaryProps) {
  const subtotal = courses.reduce((sum, course) => sum + (course.price || 0) * course.quantity, 0);
  const shippingFee = subtotal > 0 ? 15000 : 0;
  const totalCost = subtotal + shippingFee;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

      {/* Items and Shipping (Updated Format) */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Items ({courses.reduce((sum, item) => sum + item.quantity, 0)})
          </p>
          <p className="font-semibold text-gray-900">{formatVND(subtotal)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-semibold text-gray-900">{formatVND(shippingFee)}</p>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6 space-y-2">
        <label htmlFor="promo-code" className="font-semibold text-gray-900">
          Promo Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="promo-code"
            placeholder="Enter your code"
            className="w-full rounded-md text-gray-700 border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
          />
          <Button variant="outline" className="flex-shrink-0">
            Apply
          </Button>
        </div>
      </div>

      {/* Total Cost (Updated Format) */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-lg font-bold text-gray-900">Total Cost</p>
        <p className="text-xl font-bold text-gray-900">{formatVND(totalCost)}</p>
      </div>

      <Button disabled={courses.length === 0} variant="default" size="lg" className="mt-6 w-full">
        Proceed to Checkout
      </Button>
    </div>
  );
}
