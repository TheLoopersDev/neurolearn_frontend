"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  showArrow?: boolean;
}

const Button = ({ 
  href, 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  showArrow = true 
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center rounded-full text-center';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  const arrowIcon = showArrow ? (
    <svg width="24" height="10" viewBox="0 0 24 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="ml-2">
      <path d="M23 5L17 1V4H1V6H17V9L23 5Z" />
    </svg>
  ) : null;
  
  if (href) {
    return (
      <Link href={href} className={`${buttonStyles} px-6 py-2`}>
        <span>{children}</span>
        {arrowIcon}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={`${buttonStyles} px-6 py-2`}>
      <span>{children}</span>
      {arrowIcon}
    </button>
  );
};

export default Button;