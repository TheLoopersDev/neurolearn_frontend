"use client";

import { motion } from 'framer-motion';

interface LoadingProps {
  title?: string;
  className?: string;
}

const Loading = ({ title, className = "" }: LoadingProps) => {
  return (
    <div className={`py-10 ${className}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-4xl font-medium mb-6">{title}</h2>}
        <div className="flex items-center justify-center">
          <motion.div
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading; 