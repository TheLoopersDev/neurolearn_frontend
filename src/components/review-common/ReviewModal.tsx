import React from 'react';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
      <div className={`bg-white rounded-2xl shadow-xl p-8 w-full ${maxWidth} relative`}>
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        {children}
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ReviewModal; 