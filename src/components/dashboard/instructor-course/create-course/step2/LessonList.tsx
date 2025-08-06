"use client";

import React from "react";
import LessonItem from "./LessonItem";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
    useGetAllLessonsQuery,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useReorderLessonMutation,
} from "@/lib/redux/features/course/section/lesson/lessonApi";
import { toast } from "@/hooks/use-toast";

interface LessonListProps {
    sectionId: string;
}

const LessonList = ({ sectionId }: LessonListProps) => {
    const { data, isLoading, error, refetch } = useGetAllLessonsQuery(sectionId);
    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();
    const [reorderLesson] = useReorderLessonMutation();

    const lessons = data?.data || [];

    const handleDeleteLesson = async (id: string) => {
        if (confirm("Are you sure you want to delete this lesson?")) {
            try {
                await deleteLesson(id).unwrap();
                await refetch();
                toast({
                    title: "Success",
                    description: "Lesson deleted successfully",
                    variant: "success",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete lesson",
                    variant: "destructive",
                });
                console.error("Failed to delete lesson:", error);
            }
        }
    };

    const handleEditLesson = async (id: string, data: any): Promise<void> => {
        try {
            await updateLesson({ lessonId: id, data }).unwrap();
            await refetch();
            toast({
                title: "Success",
                description: "Lesson updated successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update lesson",
                variant: "destructive",
            });
            console.error("Failed to update lesson:", error);
        }
    };

    const handleReorder = async (result: DropResult) => {
        if (!result.destination) return;

        const reordered = [...lessons];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        try {
            const updates = reordered.map((l, i) => ({ id: l._id, order: i }));
            await reorderLesson({ sectionId, orderUpdates: updates }).unwrap();
            await refetch();
            toast({
                title: "Success",
                description: "Lessons reordered successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reorder lessons",
                variant: "destructive",
            });
            console.error("Failed to reorder lessons:", error);
        }
    };

    if (isLoading) return <div>Loading lessons...</div>;
    if (error) {
        toast({
            title: "Error",
            description: "Failed to load lessons",
            variant: "destructive",
        });
        return <div>Error loading lessons</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-900">
                    Lessons ({lessons.length})
                </h4>
            </div>
            <DragDropContext onDragEnd={handleReorder}>
                <Droppable droppableId={`lessons-${sectionId}`}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2 bg-secondary/30 rounded-lg p-2"
                        >
                            {lessons.length === 0 ? (
                                <div className="text-center py-4 text-sm text-gray-600">
                                    No lessons yet. Add your first lesson!
                                </div>
                            ) : (
                                lessons.map((lesson: any, index: number) => (
                                    <LessonItem
                                        key={lesson._id}
                                        lesson={lesson}
                                        index={index}
                                        onEdit={handleEditLesson}
                                        onDelete={handleDeleteLesson}
                                    />
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default LessonList;