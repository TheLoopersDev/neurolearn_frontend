"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/common/ui/Button2";
import { GripVertical, ChevronUp, ChevronDown, Plus, Trash2, HelpCircle } from "lucide-react";

interface SectionItemProps {
    section: any;
    index: number;
    isEditing: boolean;
    editingTitle: string;
    isExpanded: boolean;
    onEdit: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onChange: (title: string) => void;
    onSave: (id: string) => void;
    onToggleExpand: (id: string) => void;
    onAddLesson: (id: string) => void;
    onAddQuiz: (id: string) => void; // ✅ thêm prop mới
}

const SectionItem: React.FC<SectionItemProps> = ({
    section,
    index,
    isEditing,
    editingTitle,
    isExpanded,
    onEdit,
    onDelete,
    onChange,
    onSave,
    onToggleExpand,
    onAddLesson,
    onAddQuiz
}) => {
    return (
        <Draggable draggableId={section._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-grab"
                            >
                                <GripVertical size={18} />
                            </div>

                            {isEditing ? (
                                <input
                                    value={editingTitle}
                                    onChange={(e) => onChange(e.target.value)}
                                    onBlur={() => onSave(section._id)}
                                    onKeyDown={(e) => e.key === 'Enter' && onSave(section._id)}
                                    autoFocus
                                    className="border-b border-blue-500 focus:border-blue-600 focus:outline-none w-full px-2 py-1 text-gray-800 font-medium"
                                />
                            ) : (
                                <span
                                    onClick={() => onEdit(section._id, section.title)}
                                    className="text-gray-800 font-medium cursor-text hover:bg-gray-50 px-2 py-1 rounded"
                                >
                                    {section.title}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost2"
                                size="sm"
                                onClick={() => onToggleExpand(section._id)}
                            >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </Button>

                            {/* Nút Add Lesson */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAddLesson(section._id)}
                            >
                                <Plus size={16} className="mr-1" />
                                Add Lesson
                            </Button>

                            {/* ✅ Nút Add Quiz */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAddQuiz(section._id)}
                            >
                                <HelpCircle size={16} className="mr-1" />
                                Add Quiz
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(section._id)}
                            >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default SectionItem;
