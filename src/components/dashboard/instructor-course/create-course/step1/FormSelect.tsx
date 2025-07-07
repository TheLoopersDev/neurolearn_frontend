"use client";
import * as React from "react";
import Image from "next/image";
import Arrow from "@/public/assets/dashboard/course/Arrow - Right 3.svg";

interface Option {
    label: string;
    value: string;
}

interface FormSelectProps {
    label: string;
    placeholder?: string;
    options: Option[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect({ label, options, value, onChange, ...props }: FormSelectProps) {

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-bold leading-5 text-stone-950">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="appearance-none w-full h-[56px] px-4 pr-10 rounded-xl bg-[#F7F8FA] text-sm text-stone-900 overflow-hidden mx-1 focus:ring-2 focus:ring-blue-600"
                    {...props}
                >
                    <option value="" disabled>
                        {props.placeholder || "Select"}
                    </option>
                    {options.map((opt) => (
                        <option className="" key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <Image
                    src={Arrow}
                    alt="Arrow icon"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
            </div>
        </div>
    );
}
