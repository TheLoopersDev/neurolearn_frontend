'use client';

import { useState } from 'react';
import ReceiptModal from './ReceiptModal';

interface ReceiptItem {
  id: string;
  name: string;
  payment: string;
  price: string;
  date: string;
}

export default function ReceiptTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const receiptData: ReceiptItem[] = [
        {
            id: '1',
            name: 'Graphic Design Mastercla–Learn GREAT Design',
            payment: 'Credit card',
            price: '400.000 VNĐ',
            date: '20 May,2025',
        },
        {
            id: '2',
            name: 'Graphic Design Mastercla–Learn GREAT Design',
            payment: 'Momo',
            price: '400.000 VNĐ',
            date: '20 May,2025',
        },
        {
            id: '3',
            name: 'Graphic Design Mastercla–Learn GREAT Design',
            payment: 'Credit card',
            price: '400.000 VNĐ',
            date: '22 May,2025',
        },
    ];

  const handleReceiptClick = (item: ReceiptItem) => {
    setSelectedReceipt(item);
    setIsModalOpen(true);
  };

    return (
        <div className="bg-white pt-6 px-6 rounded-2xl shadow-sm">
            <table className="w-full table-auto text-left">
                <thead>
                    <tr className="text-sm text-gray-500 border-b">
                        <th className="pb-6">Name</th>
                        <th className="pb-6">Payment type</th>
                        <th className="pb-6">Total Price</th>
                        <th className="pb-6">Date</th>
                        <th className="pb-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
            {receiptData.map((item, idx) => (
                        <tr
                            key={item.id}
                className={`text-sm text-black ${idx !== receiptData.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                        >
                            <td className="py-6">{item.name}</td>
                            <td className="py-6">{item.payment}</td>
                            <td className="py-6">{item.price}</td>
                            <td className="py-6 font-medium">{item.date}</td>
                            <td className="py-6 text-center">
                  <button
                    onClick={() => handleReceiptClick(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-full"
                  >
                                    Receipt
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        <ReceiptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedReceipt} />
        </div>
    );
}
