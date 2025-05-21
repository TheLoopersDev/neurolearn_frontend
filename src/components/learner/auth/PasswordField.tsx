import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ placeholder, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mb-4">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="border-[0.5px] text-black rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring"
        {...props}
      />
      <div className="absolute right-3 top-3 cursor-pointer" onClick={() => setShow(!show)}>
        {show ? <FaEyeSlash /> : <FaEye />}
      </div>
    </div>
  );
};
export default PasswordField;
