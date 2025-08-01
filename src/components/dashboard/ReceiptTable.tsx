'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Course {
    name: string;
    price: number;
}

interface Order {
    _id: string;
    orderCode: string;
    courseIds: Course[];
    payment_info: string;
    createdAt: string;
}

interface ReceiptTableProps {
    userType: 'user' | 'business';
}

export default function ReceiptTable({ userType }: ReceiptTableProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/orders/user-orders`,
                    { userType },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error('Failed to fetch user orders:', error);
            }
        };

        fetchOrders();
    }, []);
    console.log(orders)

    const handleReceiptClick = (orderId: string) => {
        if (userType === 'business') {
            router.push(`/business/purchase-history/${orderId}`);
        } else {
            router.push(`/dashboard/purchase-history/${orderId}`);
        }
    };

    return (
        <div className="bg-white pt-6 px-6 rounded-2xl shadow-sm">
            <table className="w-full table-auto text-left">
                <thead>
                    <tr className="text-sm text-gray-500 border-b">
                        <th className="pb-6">Code</th>
                        <th className="pb-6">Name</th>
                        <th className="pb-6">Payment type</th>
                        <th className="pb-6">Total Price</th>
                        <th className="pb-6">Date</th>
                        <th className="pb-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, idx) => {
                        const totalPrice = order.courseIds.reduce((acc, course) => acc + course.price, 0);
                        const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB');

                        return (
                            <tr
                                key={order._id}
                                className={`text-sm text-black ${idx !== orders.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <td className="py-6">{order.orderCode}</td>
                                <td className="py-6">
                                    {(() => {
                                        let result = [];
                                        let totalLength = 0;
                                        for (let i = 0; i < order.courseIds.length; i++) {
                                            const name = order.courseIds[i].name;
                                            if (totalLength + name.length > 25) {
                                                // Nếu ngay từ khóa đầu đã vượt 25 thì cắt bớt
                                                if (result.length === 0) {
                                                    result.push(name.slice(0, 25) + '…');
                                                } else {
                                                    result.push('…');
                                                }
                                                break;
                                            }
                                            result.push(name);
                                            totalLength += name.length + 2;
                                        }
                                        return result.join(', ');
                                    })()}
                                </td>
                                <td className="py-6">{order.payment_info || 'N/A'}</td>
                                <td className="py-6">{totalPrice.toLocaleString()} VNĐ</td>
                                <td className="py-6 font-medium">{formattedDate}</td>
                                <td className="py-6 text-center">
                                    <button
                                        onClick={() => handleReceiptClick(order?.orderCode)}
                                        className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white text-sm px-4 py-1.5 rounded-full"
                                    >
                                        Receipt
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
