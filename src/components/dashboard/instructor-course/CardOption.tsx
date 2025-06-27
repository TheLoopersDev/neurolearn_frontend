"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/common/ui/Button2";

interface CardOptionProps {
    courseId: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CardOption: React.FC<CardOptionProps> = ({ courseId, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigate = (path: string) => {
        router.push(path);
        setOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded hover:bg-muted transition"
                aria-label="Open options"
            >
                <MoreVertical className="rotate-90 text-gray-900" size={18} />
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black/5">
                    <div className="py-1 text-sm text-gray-700">
                        <button
                            onClick={() => handleNavigate(`/dashboard/courses/edit-course/${courseId}`)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleNavigate(`/dashboard/instructor-courses/${courseId}`)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Course Detail
                        </button>
                        <button
                            onClick={() => handleNavigate(`/dashboard/instructor/courses/${courseId}/analytics`)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Analytics
                        </button>
                        {onDelete && (
                            <button
                                onClick={() => onDelete()}
                                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardOption;
