"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { FormInput } from "../step1/FormInput";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { VideoUploader } from "./VideoUploader";

interface AddEditLessonModalProps {
    lesson?: any;                     // Nếu có -> edit, không có -> add
    onSubmit: (data: any) => void;    // Callback submit
    onClose: () => void;
}

export default function AddEditLessonModal({ lesson, onSubmit, onClose }: AddEditLessonModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isFree: false,
        videoUrl: { public_id: "", url: "" },
        links: [] as Array<{ title: string; url: string }>,
    });

    const [newLink, setNewLink] = useState({ title: "", url: "" });

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || "",
                description: lesson.description || "",
                isFree: lesson.isFree || false,
                videoUrl: lesson.videoUrl || { public_id: "", url: "" },
                links: lesson.links || [],
            });
        }
    }, [lesson]);

    const handleSave = () => {
        onSubmit(formData);
        onClose();
    };

    const handleAddLink = () => {
        if (newLink.title && newLink.url) {
            setFormData((prev) => ({
                ...prev,
                links: [...prev.links, newLink],
            }));
            setNewLink({ title: "", url: "" });
        }
    };

    const handleRemoveLink = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index),
        }));
    };

    return (
        <div
            className="z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-4 
                           max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {lesson ? "Edit Lesson" : "Add New Lesson"}
                </h3>

                <FormInput
                    label="Lesson Title"
                    placeholder="Enter lesson title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded p-2 text-gray-600 placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Video Content</label>
                    <VideoUploader
                        lessonId={lesson?._id || ""}
                        onUploadComplete={(videoData) =>
                            setFormData({ ...formData, videoUrl: videoData })
                        }
                        initialVideo={formData.videoUrl}
                    />
                </div>

                {/* Links */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <FormInput
                            label="Resource Title"
                            placeholder="Title"
                            value={newLink.title}
                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        />
                        <FormInput
                            label="Resource URL"
                            placeholder="URL"
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        />
                        <Button variant="ghost" size="sm" className="mt-5" onClick={handleAddLink}>
                            <Plus size={16} />
                        </Button>
                    </div>

                    {formData.links.map((link, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                            <span>{link.title}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(i)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white">
                    <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                        <Save className="mr-2" size={18} />
                        Save Lesson
                    </Button>
                </div>
            </div>
        </div>
    );
}
