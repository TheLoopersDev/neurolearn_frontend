"use client";

import React, { useState } from "react";
import SectionItem from "./SectionItem";
import LessonList from "./LessonList";
import AddEditSection from "./AddEditSection";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
    useGetAllSectionsQuery,
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useReorderSectionsMutation
} from "@/lib/redux/features/course/section/sectionApi";
import {
    useCreateLessonMutation,
} from "@/lib/redux/features/course/section/lesson/lessonApi";
import { Button } from "@/components/common/ui/Button2";
import SectionHeader from "./SectionHeader";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
    courseId: string;
}

export default function CourseSectionList({ courseId }: Props) {
    const { data: sectionData, refetch: refetchSections } = useGetAllSectionsQuery(courseId, { skip: !courseId });
    const [createSection] = useCreateSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [reorderSections] = useReorderSectionsMutation();
    const [createLesson] = useCreateLessonMutation();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editSectionId, setEditSectionId] = useState<string | null>(null);
    const [editInitialData, setEditInitialData] = useState<any>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const handleAddSectionClick = () => {
        setShowAddForm(true);
    };

    const handleEditSection = (section: any) => {
        setEditSectionId(section._id);
        setEditInitialData({
            title: section.title,
            description: section.description,
            isPublished: section.isPublished
        });
    };

    const handleAddLesson = async (sectionId: string) => {
        try {
            await createLesson({
                courseId,
                sectionId,
                data: { title: "New Lesson", isFree: true }
            }).unwrap();
            await refetchSections();
            toast({
                title: "Success",
                description: "Lesson added successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add lesson",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSection = async (id: string) => {
        try {
            await deleteSection(id).unwrap();
            await refetchSections();
            toast({
                title: "Success",
                description: "Section deleted successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete section",
                variant: "destructive",
            });
        }
    };

    const handleSaveSection = async (id: string, data: any) => {
        try {
            await updateSection({ id, data }).unwrap();
            await refetchSections();
            setEditSectionId(null);
            toast({
                title: "Success",
                description: "Section updated successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update section",
                variant: "destructive",
            });
        }
    };

    const handleCreateSection = async (data: any) => {
        try {
            await createSection({ courseId, data }).unwrap();
            await refetchSections();
            setShowAddForm(false);
            toast({
                title: "Success",
                description: "Section created successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create section",
                variant: "destructive",
            });
        }
    };

    const handleToggleExpand = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    const handleReorderSections = async (result: DropResult) => {
        if (!result.destination) return;

        try {
            const reordered = [...(sectionData?.data || [])];
            const [removed] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, removed);

            const orderUpdates = reordered.map((s, idx) => ({ sectionId: s._id, order: idx }));
            await reorderSections({ sectionOrders: orderUpdates }).unwrap();
            await refetchSections();
            toast({
                title: "Success",
                description: "Sections reordered successfully",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reorder sections",
                variant: "destructive",
            });
        }
    };

    const sections = sectionData?.data || [];

    return (
        <div className="space-y-6">
            <SectionHeader onAdd={handleAddSectionClick} />

            {showAddForm && (
                <AddEditSection
                    courseId={courseId}
                    mode="add"
                    onSubmit={handleCreateSection}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {editSectionId && (
                <AddEditSection
                    courseId={courseId}
                    mode="edit"
                    initialData={editInitialData}
                    onSubmit={(data) => handleSaveSection(editSectionId, data)}
                    onCancel={() => setEditSectionId(null)}
                />
            )}

            <DragDropContext onDragEnd={handleReorderSections}>
                <Droppable droppableId="sections">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-4 bg-white rounded-xl p-6"
                        >
                            {sections.length === 0 && !showAddForm && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="bg-secondary text-gray-400 rounded-full p-4 mb-4">
                                        <Plus className="text-primary w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                                        No sections yet
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Create your first section to start building your course
                                    </p>
                                    <Button
                                        variant="ghost" size="sm"
                                        type="submit"
                                        onClick={handleAddSectionClick}
                                        className="bg-primary hover:bg-primary-hover text-gray-400"
                                    >
                                        <Plus className="mr-2" size={18} />
                                        Add Section
                                    </Button>
                                </div>
                            )}

                            {sections.map((section: any, index: number) => (
                                <div
                                    key={section._id}
                                    className="border border-input rounded-lg overflow-hidden shadow-sm"
                                >
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
                                    />

                                    {expandedSection === section._id && (
                                        <div className="bg-secondary p-4 border-t border-input">
                                            <LessonList sectionId={section._id} />
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