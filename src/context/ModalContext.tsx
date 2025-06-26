'use client';

import React, { createContext, useContext, useState } from 'react';

// 1. Định nghĩa loại hợp lệ cho modal
export type ModalType = 'login' | 'signup' | 'forgotPassword' | 'verifyCode' | 'newPassword' | 'verifyResetCode' | 'addBankCard' | null;

// 2. Interface context
interface ModalContextType {
  showModal: (type: Exclude<ModalType, null>) => void; // không cho phép truyền null vào
  hideModal: () => void;
  modalType: ModalType;
}

// 3. Tạo context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 4. Provider
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const showModal = (type: Exclude<ModalType, null>) => setModalType(type);
  const hideModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalType }}>
      {children}
    </ModalContext.Provider>
  );
};

// 5. Custom hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
