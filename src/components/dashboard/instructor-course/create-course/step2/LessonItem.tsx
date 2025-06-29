"use client";

import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/common/ui/Button2";
import { GripVertical, Pencil, Trash2, BookOpen, Check, X, Plus, Link as LinkIcon } from "lucide-react";
import { FormInput } from "../step1/FormInput";
import { VideoUploader } from "./VideoUploader";
import VideoPlayer from "./VideoPlayer";
import { toast } from "@/hooks/use-toast";

interface LessonItemProps {
    lesson: {
        _id: string;
        title: string;
        description?: string;
        isFree?: boolean;
        videoUrl?: { public_id: string; url: string };
        links?: Array<{ title: string; url: string }>;
    };
    index: number;
    onEdit: (id: string, data: any) => Promise<void>;
    onDelete: (id: string) => void;
    onAddResource: (lessonId: string, resource: any) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
    lesson,
    index,
    onEdit,
    onDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        title: lesson.title,
        description: lesson.description || "",
        isFree: lesson.isFree || false,
        videoUrl: lesson.videoUrl || { public_id: "", url: "" },
        links: lesson.links || [],
    });
    const [newLink, setNewLink] = useState({ title: "", url: "" });

    const handleSave = async () => {
        try {
            await onEdit(lesson._id, formData);
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save lesson changes",
                variant: "destructive",
            });
            console.error("Failed to save lesson:", error);
        }
    };

    const handleVideoUpload = (videoData: { public_id: string; url: string }) => {
        setFormData(prev => ({ ...prev, videoUrl: videoData }));
        toast({
            title: "Success",
            description: "Video uploaded successfully",
            variant: "success",
        });
    };

    const handleAddLink = () => {
        if (newLink.title && newLink.url) {
            setFormData(prev => ({
                ...prev,
                links: [...prev.links, newLink]
            }));
            setNewLink({ title: "", url: "" });
            toast({
                title: "Success",
                description: "Resource link added",
                variant: "success",
            });
        } else {
            toast({
                title: "Warning",
                description: "Please fill both title and URL for the resource",
                variant: "default",
            });
        }
    };

    const handleRemoveLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
        toast({
            title: "Success",
            description: "Resource link removed",
            variant: "success",
        });
    };

    return (
        <Draggable draggableId={lesson._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-background border-y border-gray-200 rounded-lg overflow-hidden mb-3"
                >
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                <GripVertical size={18} />
                            </div>

                            {isEditing ? (
                                <FormInput
                                    label="Lesson Title"
                                    placeholder="Enter lesson title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="flex-1"
                                />
                            ) : (
                                <div
                                    className="flex items-center gap-2 flex-1 cursor-pointer"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <BookOpen size={16} className="text-gray-600" />
                                    <span className="text-gray-600">{lesson.title}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button variant="ghost" size="sm" onClick={handleSave}>
                                        <Check size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                        <X size={16} />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onDelete(lesson._id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {(isExpanded || isEditing) && (
                        <div className="p-4 border-t border-input">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 font-medium mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded p-2 text-gray-600 placeholder-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm text-gray-600 font-medium">Video Content</h4>
                                        <VideoUploader
                                            lessonId={lesson._id}
                                            onUploadComplete={handleVideoUpload}
                                            initialVideo={formData.videoUrl}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex gap-2 item-center">
                                            <FormInput
                                                label="Resource Title"
                                                placeholder="Resource title"
                                                value={newLink.title}
                                                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                            <FormInput
                                                label="Resource URL"
                                                placeholder="Resource URL"
                                                value={newLink.url}
                                                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                                            />
                                            <Button variant="ghost" size="sm" className="h-1/2 item-center" onClick={handleAddLink}>
                                                <Plus size={16} />
                                            </Button>
                                        </div>

                                        <div className="space-y-1">
                                            {formData.links.map((link, i) => (
                                                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span>{link.title}</span>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(i)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lesson.description && <p className="text-sm text-gray-600">{lesson.description}</p>}

                                    {lesson.videoUrl?.url && (
                                        <div className="aspect-video bg-black rounded overflow-hidden">
                                            <VideoPlayer url={lesson.videoUrl.url} controls />
                                        </div>
                                    )}

                                    {lesson.links && lesson.links.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Resources</h4>
                                            <div className="space-y-1">
                                                {lesson.links.map((link, i) => (
                                                    <a
                                                        key={i}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-sm text-blue-600 hover:underline"
                                                    >
                                                        <LinkIcon size={14} className="mr-1" />
                                                        {link.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default LessonItem;