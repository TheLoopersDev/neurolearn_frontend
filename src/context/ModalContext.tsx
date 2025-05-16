'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  showModal: (type: string) => void;
  hideModal: () => void;
  modalType: string | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<string | null>(null);

  const showModal = (type: string) => setModalType(type);
  const hideModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalType }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
