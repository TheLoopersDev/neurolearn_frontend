import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGetBankInfoQuery } from '@/lib/redux/features/bank/bankApi';
import Image from 'next/image';

interface AddBankCardModalProps {
    onClose: () => void;
}

const AddBankCardModal = ({ onClose }: AddBankCardModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [nameCard, setNameCard] = useState('');
    
    const { data: banks, isLoading, error } = useGetBankInfoQuery();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    const handleSubmit = () => {
        if (!cardNumber || !bankCode || !nameCard) {
            alert('Please fill in all fields');
            return;
        }
        console.log({ cardNumber, bankCode, nameCard });
        // TODO: call API
        closeModal();
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4 transition-all duration-300 ${
                isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
            style={{ 
                pointerEvents: isClosing ? 'none' : 'auto',
                visibility: isVisible || isClosing ? 'visible' : 'hidden'
            }}
        >
            <div 
                className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl transform transition-all duration-300"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Add Bank Card</h2>
                
                <div className="space-y-6">
                    <div className={`transition-all duration-500 delay-100 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Card Number</label>
                        <input
                            type="text"
                            className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base outline-none border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Enter your card number"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className={`transition-all duration-500 delay-200 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Bank Name</label>
                        <div className="relative">
                            <select
                                className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base outline-none border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all duration-200"
                                value={bankCode}
                                onChange={e => setBankCode(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your bank name</option>
                                {isLoading ? (
                                    <option value="" disabled>Loading banks...</option>
                                ) : error ? (
                                    <option value="" disabled>Error loading banks</option>
                                ) : banks && Object.entries(banks).map(([code, bank]) => (
                                    <option key={code} value={code}>{bank.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                        
                        {bankCode && banks && (
                            <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 relative mr-3">
                                    <Image 
                                        src={banks[bankCode].bankLogoUrl} 
                                        alt={banks[bankCode].name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-medium">{banks[bankCode].name}</span>
                            </div>
                        )}
                    </div>

                    <div className={`transition-all duration-500 delay-300 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Card Holder Name</label>
                        <input
                            type="text"
                            className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base outline-none border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Enter card holder name"
                            value={nameCard}
                            onChange={e => setNameCard(e.target.value)}
                            required
                        />
                    </div>

                    <div className={`flex justify-end space-x-3 mt-8 transition-all duration-500 delay-400 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <button
                            onClick={closeModal}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Add Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBankCardModal;
