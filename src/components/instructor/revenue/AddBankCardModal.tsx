import React, { useState, useEffect, useMemo } from 'react';
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
  const [nameCard, setNameCard] = useState('');

  const { data: bankApiData, isLoading, error } = useGetBankInfoQuery();
  const bankList = useMemo<BankInfo[]>(() => bankApiData?.data ?? [], [bankApiData]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  const handleSubmit = () => {
    if (!cardNumber || !bankCode || !nameCard) {
      alert('Please fill in all fields');
      return;
    }
    console.log({ cardNumber, bankCode, nameCard });
    closeModal();
  };

  const renderBankOptions = () => {
    if (isLoading) return <option disabled>Loading banks...</option>;
    if (error) return <option disabled>Error loading banks</option>;
    return bankList.map((bank: BankInfo) => (
      <option key={bank.code} value={bank.code}>
        {bank.name}
      </option>
    ));
  };

  const selectedBank = bankList.find((b: BankInfo) => b.code === bankCode);

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        pointerEvents: isClosing ? 'none' : 'auto',
        visibility: isVisible || isClosing ? 'visible' : 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-white rounded-xl w-full shadow-sm"
        style={{
          maxWidth: '28rem',
          padding: '24px',
          margin: 'auto',
        }}
      >
        <h2 id="modal-title" className="text-xl font-bold mb-6 text-center">
          Add Bank Card
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter your card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="bankCode" className="block text-sm font-medium mb-3 text-gray-700">
              Bank Name
            </label>
            <div className="relative">
              <select
                id="bankCode"
                className="w-full rounded-2xl bg-gray-50 px-4 py-4 text-base border-0 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all duration-200"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your bank name
                </option>
                {renderBankOptions()}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {selectedBank && (
              <div className="mt-3 flex items-center p-3 bg-gray-50 rounded-xl w-full">
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
            )}
          </div>

          <div>
            <label htmlFor="nameCard" className="block text-sm font-medium mb-1">
              Card Holder Name
            </label>
            <input
              id="nameCard"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter card holder name"
              value={nameCard}
              onChange={(e) => setNameCard(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
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