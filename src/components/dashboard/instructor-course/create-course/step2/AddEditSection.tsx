"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { FormInput } from "../step1/FormInput";
import { FormSelect } from "../step1/FormSelect";
import { Save, Plus } from "lucide-react";

interface AddEditSectionProps {
    courseId: string;
    onSubmit: (data: {
        title: string;
        description: string;
        isPublished: boolean;
    }) => void;
    mode?: "add" | "edit";
    initialData?: {
        title: string;
        description: string;
        isPublished: boolean;
    };
    onCancel?: () => void;
}

const AddEditSection: React.FC<AddEditSectionProps> = ({
    onSubmit,
    mode = "add",
    initialData,
    onCancel
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState("false");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setIsPublished(initialData.isPublished ? "true" : "false");
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            isPublished: isPublished === "true"
        });
        if (mode === "add") {
            setTitle("");
            setDescription("");
            setIsPublished("false");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-input rounded-xl bg-white shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
                {mode === "edit" ? "Edit Section" : "Create New Section"}
            </h3>

            <FormInput
                label="Section Title"
                placeholder="Enter section title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <FormInput
                label="Description"
                placeholder="Enter section description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <FormSelect
                label="Published Status"
                value={isPublished}
                onChange={(e) => setIsPublished(e.target.value)}
                options={[
                    { label: "Draft", value: "false" },
                    { label: "Published", value: "true" }
                ]}
            />

            <div className="flex gap-3 pt-2">
                <Button
                    variant="ghost" size="sm"
                    type="submit"
                >
                    {mode === "edit" ? (
                        <>
                            <Save className="mr-2" size={18} />
                            Save Changes
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2" size={18} />
                            Add Section
                        </>
                    )}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="ghost" size="sm"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

export default AddEditSection;