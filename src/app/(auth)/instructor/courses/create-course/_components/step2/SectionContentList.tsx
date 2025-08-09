// app/.../SectionContentList.tsx
"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, BookOpen, HelpCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/common/ui/Button2";
import { toast } from "@/hooks/use-toast";
import {
    useReorderSectionMutation,
    useRemoveItemFromSectionMutation,
} from "@/lib/redux/features/course/section/sectionApi";
import {
    useUpdateLessonMutation,
    useDeleteLessonMutation,
} from "@/lib/redux/features/course/section/lesson/lessonApi";
import { useModal } from "@/context/ModalContext";
// Nếu muốn xoá hẳn quiz:
// import { useDeleteQuizMutation, useUpdateQuizMutation } from "@/lib/redux/features/quiz/quizApi";

type MixedItem =
    | { kind: "lesson"; _id: string; order: number; title?: string; payload: any }
    | { kind: "quiz"; _id: string; order: number; name?: string; payload: any };

export default function SectionContentList({
    section,
    onRefetch,
}: {
    section: any;
    onRefetch: () => Promise<any> | void;
}) {
    const items: MixedItem[] = section?.items || [];
    const { showModal } = useModal();

    const [reorderSection] = useReorderSectionMutation();
    const [removeItem] = useRemoveItemFromSectionMutation();

    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();
    // const [deleteQuiz] = useDeleteQuizMutation();

    const handleReorder = async (result: DropResult) => {
        if (!result.destination) return;

        const reordered = [...items];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        try {
            await reorderSection({
                sectionId: section._id,
                items: reordered.map((it, i) => ({ kind: it.kind, id: it._id, order: i })),
            }).unwrap();
            await onRefetch?.();
            toast({ title: "Success", description: "Items reordered successfully", variant: "success" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to reorder items", variant: "destructive" });
            console.error(error);
        }
    };

    const handleEdit = async (item: MixedItem) => {
        if (item.kind === "lesson") {
            const lesson = item.payload ?? { _id: item._id, title: item.title };
            showModal("addEditLesson", {
                lesson,
                onSubmit: async (data: any) => {
                    try {
                        await updateLesson({ lessonId: lesson._id, data }).unwrap();
                        await onRefetch?.();
                        toast({ title: "Success", description: "Lesson updated successfully", variant: "success" });
                    } catch (error) {
                        toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" });
                        console.error(error);
                    }
                },
            });
        } else {
            // TODO: mở modal edit quiz riêng
            // showModal("addEditQuiz", { quiz: item.payload, onSubmit: ... })
            toast({ title: "Todo", description: "Hook up quiz edit flow", variant: "default" });
        }
    };

    const handleDelete = (item: MixedItem) => {
        showModal("actionConfirm", {
            title: `Delete ${item.kind === "quiz" ? "Quiz" : "Lesson"}`,
            description: `Are you sure you want to delete "${item.kind === "quiz"
                ? item.payload?.name ?? item.name
                : item.payload?.title ?? item.title
                }"?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive",
            onConfirm: async () => {
                try {
                    if (item.kind === "lesson") {
                        await deleteLesson(item._id).unwrap();
                    } else {
                        await removeItem({
                            sectionId: section._id,
                            kind: "quiz",
                            id: item._id,
                            hardDelete: false,
                        }).unwrap();
                    }
                    await onRefetch?.();
                    toast({
                        title: "Success",
                        description: `${item.kind === "quiz" ? "Quiz" : "Lesson"
                            } deleted successfully`,
                        variant: "success",
                    });
                } catch (err) {
                    console.error(err);
                    toast({
                        title: "Error",
                        description: `Failed to delete ${item.kind === "quiz" ? "quiz" : "lesson"
                            }`,
                        variant: "destructive",
                    });
                }
            },
        });
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-900">Items ({items.length})</h4>
            </div>

            <DragDropContext onDragEnd={handleReorder}>
                <Droppable droppableId={`section-items-${section._id}`}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 bg-secondary/30 rounded-lg p-2">
                            {items.length === 0 ? (
                                <div className="text-center py-4 text-sm text-gray-600">
                                    No items yet. Add a lesson or attach a quiz!
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <Draggable draggableId={`${item.kind}-${item._id}`} index={index} key={`${item.kind}-${item._id}`}>
                                        {(drag) => (
                                            <div
                                                ref={drag.innerRef}
                                                {...drag.draggableProps}
                                                className="bg-background border-y border-gray-200 rounded-lg overflow-hidden mb-3"
                                            >
                                                <div className="flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div {...drag.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
                                                            <GripVertical size={18} />
                                                        </div>

                                                        {item.kind === "lesson" ? (
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <BookOpen size={16} className="text-gray-600" />
                                                                <span className="text-gray-600">{item.payload?.title ?? item.title}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <HelpCircle size={16} className="text-gray-600" />
                                                                <span className="text-gray-600">{item.payload?.name ?? item.name}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {item.kind === "lesson" && (
                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                                                <Pencil size={16} />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
