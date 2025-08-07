"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/common/ui/Button2";
import { GripVertical, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useModal } from "@/context/ModalContext";

interface LessonItemProps {
    lesson: any;
    index: number;
    onEdit: (id: string, data: any) => Promise<void>;
    onDelete: (id: string) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, index, onEdit, onDelete }) => {
    const { showModal } = useModal();

    const handleEditClick = () => {
        showModal("addEditLesson", {
            lesson,
            onSubmit: async (data: any) => {
                try {
                    await onEdit(lesson._id, data);
                    toast({ title: "Success", description: "Lesson updated", variant: "success" });
                } catch {
                    toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" });
                }
            },
        });
    };

    const handleDeleteClick = () => {
        showModal("actionConfirm", {
            title: "Delete Lesson",
            description: `Are you sure you want to delete the lesson "${lesson.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive",
            onConfirm: async () => {
                try {
                    await onDelete(lesson._id);
                    toast({ title: "Deleted", description: "Lesson deleted successfully", variant: "success" });
                } catch {
                    toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" });
                }
            },
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
                            <div className="flex items-center gap-2 flex-1">
                                <BookOpen size={16} className="text-gray-600" />
                                <span className="text-gray-600">{lesson.title}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleEditClick}>
                                <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default LessonItem;
