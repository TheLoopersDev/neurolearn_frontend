"use client";

import React from "react";
import { Button } from "@/components/common/ui/Button2";
import { X } from "lucide-react";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "primary" | "destructive" | "outline"; // style confirm button
}

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
}) => {
    if (!isOpen) return null;

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
                <X size={20} />
            </button>

            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm text-gray-600">{description}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} size="sm" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
