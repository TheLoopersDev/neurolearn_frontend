import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AddBankCardModalProps {
    onClose: () => void;
}

const BANKS = [
    'Vietcombank',
    'Techcombank',
    'VietinBank',
    'BIDV',
    'ACB',
    'Sacombank',
    'MB Bank',
    'TPBank',
    'VPBank',
];

export const AddBankCardModal: React.FC<AddBankCardModalProps> = ({ onClose }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [nameCard, setNameCard] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setIsVisible(false);
        // Delay the actual close to allow animation to complete
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSubmit = () => {
        if (!cardNumber || !bankName || !nameCard) {
            alert('Please fill in all fields');
            return;
        }
        console.log({ cardNumber, bankName, nameCard });
        // TODO: call API
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
                className={`relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto transition-all duration-300 transform ${
                    isVisible && !isClosing
                        ? 'scale-100 translate-y-0 opacity-100' 
                        : 'scale-95 translate-y-4 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2 text-black">Add Bank Account</h2>
                    <p className="text-gray-500 text-base">Link your bank account to proceed</p>
                </div>

                <div className="space-y-6">
                    <div className={`transition-all duration-500 delay-100 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Card Number</label>
                        <input
                            type="text"
                            className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base outline-none border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                            placeholder="Enter your bank card number"
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
                                value={bankName}
                                onChange={e => setBankName(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your bank name</option>
                                {BANKS.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200" />
                        </div>
                    </div>

                    <div className={`transition-all duration-500 delay-300 transform ${
                        isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                        <label className="block text-sm font-medium mb-3 text-gray-700">Name Card</label>
                        <input
                            type="text"
                            className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base outline-none border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                            placeholder="Enter the name on the card in uppercase"
                            value={nameCard}
                            onChange={e => setNameCard(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={`flex gap-4 mt-10 transition-all duration-500 delay-400 transform ${
                    isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-800 font-semibold text-base hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            handleSubmit();
                        }}
                        className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Add Bank
                    </button>
                </div>
            </div>
        </div>
    );
};
