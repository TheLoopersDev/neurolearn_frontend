"use client";

import React, { useState } from "react";
import SectionItem from "./SectionItem";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
    // ❌ useGetAllSectionsQuery,
    useGetSectionsByUserIdQuery,      // ✅
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useReorderSectionsMutation,
    useAddQuizToSectionMutation,
} from "@/lib/redux/features/course/section/sectionApi";
import { useCreateLessonMutation } from "@/lib/redux/features/course/section/lesson/lessonApi";
import { Button } from "@/components/common/ui/Button2";
import SectionHeader from "./SectionHeader";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useModal } from "@/context/ModalContext";
import SectionContentList from "./SectionContentList";
import { courseApi, useGetCourseByIdQuery } from "@/lib/redux/features/course/courseApi";

import { useAppDispatch } from "@/lib/redux/hooks";
interface Props {
    courseId: string;
}

export default function CourseSectionList({ courseId }: Props) {
    // 🔁 Lấy tất cả section của user, rồi lọc theo courseId ở client
    const { data: allSectionData, refetch: refetchAllSections, isFetching } =
        useGetSectionsByUserIdQuery(undefined, { skip: false });
    const [createSection] = useCreateSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [reorderSections] = useReorderSectionsMutation();
    const [createLesson] = useCreateLessonMutation();
    const [addQuizToSection] = useAddQuizToSectionMutation();       // ✅
    const { refetch: refetchCourse } = useGetCourseByIdQuery(courseId);

    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const { showModal } = useModal();
    const dispatch = useAppDispatch();

    // Helper: chỉ refetch endpoint user-sections
    const refetchSections = refetchAllSections;

    // 🟢 Add Section (modal)
    const handleAddSectionClick = () => {
        showModal("addEditSection", {
            courseId,
            mode: "add",
            onSubmit: async (data: any) => {
                try {
                    await createSection({ courseId, data }).unwrap();
                    await refetchAllSections().unwrap();
                    dispatch(courseApi.util.invalidateTags([{ type: 'Course', id: courseId }]));
                    await refetchCourse();
                    toast({ title: "Success", description: "Section created successfully", variant: "success" });
                } catch {
                    toast({ title: "Error", description: "Failed to create section", variant: "destructive" });
                }
            },
        });
    };

    // 🟢 Edit Section (modal)
    const handleEditSection = (section: any) => {
        showModal("addEditSection", {
            courseId,
            mode: "edit",
            initialData: {
                title: section.title,
                description: section.description,
                isPublished: section.isPublished,
            },
            onSubmit: async (data: any) => {
                try {
                    await updateSection({ id: section._id, data }).unwrap();
                    await refetchAllSections().unwrap();
                    dispatch(
                        courseApi.util.invalidateTags([
                            { type: 'Course', id: courseId },
                            { type: 'Section', id: 'LIST' }
                        ])
                    );
                    await refetchCourse();
                    toast({ title: "Success", description: "Section updated successfully", variant: "success" });
                } catch {
                    toast({ title: "Error", description: "Failed to update section", variant: "destructive" });
                }
            },
        });
    };

    // 🟢 Add Lesson
    const handleAddLesson = async (sectionId: string) => {

        try {
            await createLesson({ courseId, sectionId, data: { title: "New Lesson", isFree: true } }).unwrap();
            await refetchAllSections().unwrap();
            dispatch(
                courseApi.util.invalidateTags([
                    { type: 'Course', id: courseId },
                    { type: 'Section', id: sectionId },
                    { type: 'Lesson', id: 'LIST' }
                ])
            );
            await refetchCourse();
            toast({ title: "Success", description: "Lesson added successfully", variant: "success" });
        } catch {
            toast({ title: "Error", description: "Failed to add lesson", variant: "destructive" });
        }
    };

    // 🟢 Delete Section
    const handleDeleteSection = async (id: string) => {
        try {
            await deleteSection(id).unwrap();
            await refetchAllSections().unwrap();
            dispatch(
                courseApi.util.invalidateTags([
                    { type: 'Course', id: courseId },
                    { type: 'Lesson', id: 'LIST' }
                ])
            );
            await refetchCourse();
            toast({ title: "Success", description: "Section deleted successfully", variant: "success" });
        } catch {
            toast({ title: "Error", description: "Failed to delete section", variant: "destructive" });
        }
    };

    // 🟢 Toggle expand
    const handleToggleExpand = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    // 🟢 Reorder (⚠️ reorder chỉ trong course hiện tại)
    const handleReorderSections = async (result: DropResult) => {
        if (!result.destination) return;

        try {
            const currentCourseSections = (allSectionData?.data || []).filter(
                (s: any) => s.courseId === courseId
            );
            const reordered = [...currentCourseSections];
            const [removed] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, removed);

            const orderUpdates = reordered.map((s: any, idx: number) => ({
                sectionId: s._id,
                order: idx,
            }));

            await reorderSections({ sectionOrders: orderUpdates }).unwrap();
            await refetchSections();
            toast({ title: "Success", description: "Sections reordered successfully", variant: "success" });
        } catch {
            toast({ title: "Error", description: "Failed to reorder sections", variant: "destructive" });
        }
    };

    const handleAddQuiz = (sectionId: string) => {
        showModal("pickQuizToAdd", {
            sectionId,
            courseId, // optional
            // ✅ Trả về promise của unwrap() để modal biết khi nào lỗi/thành công
            onSubmit: async ({ quizId, position }: { quizId: string; position?: number }) => {
                const res = await addQuizToSection({ sectionId, quizId, position }).unwrap();
                // Sau khi success: refetch ở đây (KHÔNG toast ở đây)
                await refetchSections();
                return res; // để modal có thể dùng res.quiz.name hiển thị
            },
        });
    };
    const sections = (allSectionData?.data || []).filter((s: any) => s.courseId === courseId);

    return (
        <div className="space-y-6">
            <SectionHeader onAdd={handleAddSectionClick} />

            <DragDropContext onDragEnd={handleReorderSections}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4 bg-white rounded-xl p-6">
                            {sections.length === 0 && !isFetching && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="bg-secondary text-gray-400 rounded-full p-4 mb-4">
                                        <Plus className="text-primary w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-400 mb-2">No sections yet</h3>
                                    <p className="text-gray-500 mb-4">Create your first section to start building your course</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={handleAddSectionClick}
                                        className="bg-primary hover:bg-primary-hover text-gray-400"
                                    >
                                        <Plus className="mr-2" size={18} />
                                        Add Section
                                    </Button>
                                </div>
                            )}

                            {sections.map((section: any, index: number) => (
                                <div key={section._id} className="rounded-lg overflow-hidden shadow-sm">
                                    <SectionItem
                                        section={section}
                                        index={index}
                                        isEditing={false}
                                        editingTitle=""
                                        isExpanded={expandedSection === section._id}
                                        onEdit={() => handleEditSection(section)}
                                        onDelete={handleDeleteSection}
                                        onChange={() => { }}
                                        onSave={() => { }}
                                        onToggleExpand={handleToggleExpand}
                                        onAddLesson={handleAddLesson}
                                        onAddQuiz={handleAddQuiz}                 // ✅ pass vào
                                    />

                                    {expandedSection === section._id && (
                                        <div className="bg-secondary p-4">
                                            <SectionContentList section={section} onRefetch={refetchSections} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
