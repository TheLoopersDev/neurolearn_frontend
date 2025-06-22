import React, { useState, useEffect, useMemo } from 'react';
import { useGetBankInfoQuery } from '@/lib/redux/features/bank/bankApi';
import { BankInfo as ApiBankInfo } from '@/types/creditCard';
import Image from 'next/image';

interface BankInfo {
    id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
    logo: string;
    short_name: string;
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

  const { data: bankApiData, isLoading, error } = useGetBankInfoQuery();
  const bankList = useMemo<BankInfo[]>(() => {
    console.log('Bank API Data:', bankApiData); // Debug log

      if (!bankApiData?.data) return [];

      // Map API data to component's expected format
      return bankApiData.data.map((apiBank: ApiBankInfo) => ({
          id: apiBank.bin, // Use bin as id
          name: apiBank.name,
          code: apiBank.bin, // Use bin as code since API doesn't have code
          bin: apiBank.bin,
          shortName: apiBank.shortName,
          logo: apiBank.bankLogoUrl,
          short_name: apiBank.shortName,
      }));
  }, [bankApiData]);

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
    if (!cardNumber || !bankName || !nameCard) {
      alert('Please fill in all fields');
      return;
    }
    console.log({ cardNumber, bankCode, bankName, nameCard });
    closeModal();
  };

  const handleBankNameChange = (value: string) => {
    setBankName(value);
    
    if (value.trim() === '') {
      setFilteredBanks([]);
      setShowSuggestions(false);
      setBankCode('');
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = bankList.filter(bank => {
      const matchName = bank.name?.toLowerCase().includes(searchValue);
      const matchShortName = bank.shortName?.toLowerCase().includes(searchValue);
      const matchShortName2 = bank.short_name?.toLowerCase().includes(searchValue);
      const matchCode = bank.code?.toLowerCase().includes(searchValue);
      
      return matchName || matchShortName || matchShortName2 || matchCode;
    });

    setFilteredBanks(filtered);
    setShowSuggestions(true);
  };

  const handleBankSelect = (bank: BankInfo) => {
    setBankName(bank.name);
    setBankCode(bank.code);
    setShowSuggestions(false);
  };

  const handleBankInputFocus = () => {
    if (bankName && filteredBanks.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBankInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

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
            <label htmlFor="bankName" className="block text-sm font-medium mb-1">
              Bank Name
            </label>
            <input
              id="bankName"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter or select bank name"
              value={bankName}
              onChange={(e) => handleBankNameChange(e.target.value)}
              onFocus={handleBankInputFocus}
              onBlur={handleBankInputBlur}
              required
            />
            
            {showSuggestions && filteredBanks.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 w-full text-left"
                    onClick={() => handleBankSelect(bank)}
                  >
                    <div className="w-12 h-12 relative mr-4 flex-shrink-0">
                      <Image
                        src={bank.logo}
                        alt={bank.shortName}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                                {bank.shortName}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {bank.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 p-3">
                <span className="text-sm text-gray-500">Loading banks...</span>
              </div>
            )}

            {error && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 p-3">
                <span className="text-sm text-red-500">Error loading banks</span>
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