import * as React from "react";

interface FormInputProps {
    label: string;
    placeholder: string;
    required?: boolean;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function FormInput({
    label,
    placeholder,
    required = false,
    type = "text",
    value,
    onChange,
    className = "",
}: FormInputProps) {
    return (
        <div className="flex flex-col gap-2 items-start w-full">
            <label className="text-base text-gray-900 font-bold leading-5 text-stone-950">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className={`p-3 h-14 text-sm leading-4 text-gray-900  rounded-xl bg-slate-50 text-stone-900 border-none outline-none focus:ring-2 focus:ring-blue-600 w-full ${className}`}
            />
        </div>
    );
}
