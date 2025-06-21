import React, { useState, useEffect, useRef } from 'react';
import { useGetBankInfoQuery } from '@/lib/redux/features/bank/bankApi';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface BankInfo {
    name: string;
    bankLogoUrl: string;
    code: string;
}

interface AddBankCardModalProps {
    onClose: () => void;
}

const AddBankCardModal = ({ onClose }: AddBankCardModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [nameCard, setNameCard] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredBanks, setFilteredBanks] = useState<BankInfo[]>([]);
    const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const { data: bankApiData, isLoading, error } = useGetBankInfoQuery();
    const bankList = bankApiData?.data || [];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (bankList && bankName) {
            const filtered = bankList.filter((bank: BankInfo) =>
                bank.name.toLowerCase().includes(bankName.toLowerCase())
            );
            setFilteredBanks(filtered);
            setShowSuggestions(filtered.length > 0 && bankName.length > 0);
        } else {
            setFilteredBanks([]);
            setShowSuggestions(false);
        }
    }, [bankName, bankList]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBankName(value);

        if (selectedBank && value !== selectedBank.name) {
            setSelectedBank(null);
            setBankCode('');
        }
    };

    const handleBankSelect = (code: string, bank: BankInfo) => {
        setBankName(bank.name);
        setBankCode(code);
        setSelectedBank(bank);
        setShowSuggestions(false);
    };

    const handleInputFocus = () => {
        if (bankName && filteredBanks.length > 0) {
            setShowSuggestions(true);
        }
    };

    const renderSuggestions = () => {
        if (isLoading) {
            return (
                <div className="p-3 text-gray-500 text-center text-sm">
                    Loading banks...
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-3 text-red-500 text-center text-sm">
                    Error loading banks
                </div>
            );
        }

        if (filteredBanks.length > 0) {
            return filteredBanks.map((bank) => (
                <div
                    key={bank.code}
                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    onClick={() => handleBankSelect(bank.code, bank)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleBankSelect(bank.code, bank);
                        }
                    }}
                    role="option"
                    tabIndex={0}
                    aria-selected={false}
                >
                    <div className="w-6 h-6 relative mr-2 flex-shrink-0">
                        <Image
                            src={bank.bankLogoUrl}
                            alt={bank.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-medium">{bank.name}</span>
                </div>
            ));
        }

        return (
            <div className="p-3 text-gray-500 text-center text-sm">
                No banks found
            </div>
        );
    };

    const handleSubmit = () => {
        if (!cardNumber || !bankCode || !nameCard) {
            alert('Please fill in all fields');
            return;
        }
        console.log({ cardNumber, bankCode, nameCard });
        closeModal();
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 transition-opacity duration-300 ${
                isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{ 
                pointerEvents: isClosing ? 'none' : 'auto',
                visibility: isVisible || isClosing ? 'visible' : 'hidden'
            }}
        >
            <div 
                className="bg-white rounded-xl w-full max-w-md p-6 shadow-sm"
                onClick={e => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="document"
            >
                <h2 id="modal-title" className="text-xl font-bold mb-6 text-center">Add Bank Card</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                        <input
                            id="cardNumber"
                            type="text"
                            className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-500"
                            placeholder="Enter your card number"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-3 text-gray-700" htmlFor="bankName">Bank Name</label>
                        <div className="relative">
                            <select
                                id="bankName"
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
                                    ) : bankList.map((bank: BankInfo) => (
                                        <option key={bank.name} value={bank.name}>{bank.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                        {bankCode && bankList.length > 0 && (
                            (() => {
                                const selectedBank = bankList.find((b: BankInfo) => b.name === bankCode);
                                if (!selectedBank) return null;
                                return (
                                    <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 relative mr-3">
                                            <Image 
                                                src={selectedBank.bankLogoUrl}
                                                alt={selectedBank.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="font-medium">{selectedBank.name}</span>
                                    </div>
                                );
                            })()
                        )}
                    </div>

                    <div>
                        <label htmlFor="nameCard" className="block text-sm font-medium mb-1">Card Holder Name</label>
                        <input
                            id="nameCard"
                            type="text"
                            className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-500"
                            placeholder="Enter card holder name"
                            value={nameCard}
                            onChange={e => setNameCard(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
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