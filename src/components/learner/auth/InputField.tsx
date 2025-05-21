import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', ...props }) => (
  <input
    type={type}
    placeholder={label}
    className="border-[0.5px] text-black rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring"
    {...props}
  />
);
export default InputField;
