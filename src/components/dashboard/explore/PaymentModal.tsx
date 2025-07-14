// components/common/PaymentModal.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import ReceiptModal from '../../dashboard/ReceiptModal';
import PaymentSuccessModal from './PaymentSuccessModal';

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

const mockReceipt = {
  id: '1',
  name: 'Graphic Design Masterclass Learn Great Design',
  payment: 'Bank Transfer',
  price: '400.000 VNĐ',
  date: new Date().toLocaleDateString('vi-VN'),
};

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const pricePerCourse = 800_000
  const couponDiscount = 400_000

  const subtotal = pricePerCourse * quantity
  const total = subtotal - couponDiscount

  const [showSuccess, setShowSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Giả lập thanh toán thành công khi click nút "Đã thanh toán"
  const handleMockPayment = () => {
    setShowSuccess(true);
  };

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl p-8 w-full max-w-4xl overflow-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Payment Information */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-xl text-black">Payment Information</h3>
                <p className="text-[#6B6B6B]">Please verify your course payment details</p>
              </div>

              {/* Banner */}
              <div className="w-full h-[180px] relative rounded-lg overflow-hidden">
                <Image
                  src="/assets/images/banner.png"
                  alt="Khóa học Thiết kế đồ họa"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Course & Quantity */}
              <div className="space-y-6 bg-white rounded-2xl p-4 border-b">
                <div className="text-lg font-medium text-black">
                  Graphic Design Masterclass Learn Great Design
                </div>

                <div className="flex flex-col items-start space-y-2">
                  <span className="text-black font-medium">Number of courses</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-20 h-8 flex items-center justify-center border-2 border-blue-500 rounded-2xl text-black"
                    >
                      －
                    </button>
                    <span className="w-40 h-8 flex items-center justify-center border-2 border-blue-500 rounded-2xl text-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-20 h-8 flex items-center justify-center border-2 border-blue-500 rounded-2xl text-black"
                    >
                      ＋
                    </button>
                  </div>
                </div>
                {/* Order summary */}
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coupon Discount</span>
                    <span className="text-red-600">－{couponDiscount.toLocaleString()} VND</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{total.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Add funds */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-xl text-black">Add funds to the account</h3>
                <p className="text-[#6B6B6B]">Transfer funds using details below.</p>
              </div>
              {/* Transfer Note */}
              <div className="space-y-1">
                <div className="text-sm text-black">Transfer Note</div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="ACADEMIX2025"
                    className="w-63 h-10 rounded px-2 py-1 text-blue-600 bg-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => copyToClipboard('ACADEMIX2025')}
                    className="h-10 px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
              {/* QR code */}
              <div>
                <div className="w-full text-sm text-black mb-2 text-center">Scan with Phone</div>
                <div className="w-53 h-53 relative mx-auto">
                  <Image
                    src="/assets/images/qr-code.png"
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Bank details */}
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                {/* Top-Left */}
                <div className="space-y-1">
                  <span className="block text-sm">Ngân hàng</span>
                  <span className="font-medium text-black">TMCP Quân đội</span>
                </div>
                {/* Top-Right */}
                <div className="space-y-1">
                  <span className="block text-sm">Chủ tài khoản</span>
                  <span className="font-medium text-black">DAO TUAN KIET</span>
                </div>
                {/* Bottom-Left */}
                <div className="space-y-1">
                  <span className="block text-sm">Số tài khoản</span>
                  <div className="flex items-center space-x-2">
                    <code className="rounded text-black">
                      ACDM62671827
                    </code>
                    <button
                      onClick={() => copyToClipboard('ACDM62671827')}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {/* Bottom-Right */}
                <div className="space-y-1">
                  <span className="block text-sm">Số tiền</span>
                  <div className="flex items-center justify-between w-full">
                    <code className="rounded-xl text-black">
                      {total.toLocaleString()} VND
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${total}`)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

              </div>
              <p className="text-xs text-gray-500">
                Note: Please enter the{' '}
                <span className="text-blue-600">exact amount</span>{' '}
                and <span className="text-blue-600">details</span> when making payment
              </p>

            </div>
          </div>
          <div className="flex items-center justify-end mt-8">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-lg font-semibold"
              onClick={handleMockPayment}
            >
              Đã thanh toán
            </button>
          </div>
        </div>
      </div>
      <PaymentSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onContinue={() => {
          setShowSuccess(false);
          setShowReceipt(true);
        }}
      />
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        data={mockReceipt}
      />
    </>
  )
}

export default PaymentModal
