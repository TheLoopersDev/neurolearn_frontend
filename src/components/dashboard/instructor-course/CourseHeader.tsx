"use client";

import Image from "next/image";
import React from "react";
import CardOption from "@/components/dashboard/instructor-course/CardOption";
import tag from "@/public/assets/dashboard/course/tag.svg";
import {
    useDeleteCourseMutation,
    usePublishCourseMutation,
    useUnpublishCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { toast } from "@/hooks/use-toast";
import { useModal } from "@/context/ModalContext";

interface CourseHeaderProps {
    thumbnailImage: string;
    category: string;
    title: string;
    courseId: string;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
    thumbnailImage,
    category,
    title,
    courseId,
}) => {
    const [deleteCourse] = useDeleteCourseMutation();
    const [publishCourse] = usePublishCourseMutation();
    const [unpublishCourse] = useUnpublishCourseMutation();
    const { showModal } = useModal();

    const handleDelete = async () => {
        try {
            await deleteCourse(courseId).unwrap();
            toast({
                title: "Deleted",
                description: "Course deleted successfully!",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete course.",
                variant: "destructive",
            });
        }
    };

    const handlePublish = async () => {
        try {
            await publishCourse(courseId).unwrap();
            toast({
                title: "Published",
                description: "Course published successfully!",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to publish course.",
                variant: "destructive",
            });
        }
    };

    const handleUnpublish = async () => {
        try {
            await unpublishCourse(courseId).unwrap();
            toast({
                title: "Unpublished",
                description: "Course unpublished successfully!",
                variant: "success",
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to unpublish course.",
                variant: "destructive",
            });
        }
    };

    return (
        <header className="w-full flex flex-col justify-between h-full relative">
            <div className="w-full text-xs font-medium leading-none text-blue-600">
                <Image
                    src={thumbnailImage || "/assets/business/book.svg"}
                    alt="Course thumbnail"
                    width={600}
                    height={320}
                    className="w-full h-[160px] object-cover rounded-2xl"
                    priority
                />
                <div className="flex justify-between items-center w-full max-w-[323px] mt-2">
                    <div className="flex gap-2 items-center">
                        <Image src={tag} alt="Tag icon" width={16} height={16} />
                        <span className="text-[#3858F8] text-sm font-medium">{category}</span>
                    </div>

                    {/* Wrapped CardOption with high z-index container */}
                    <div className="relative z-[1000]">
                        <CardOption
                            courseId={courseId}
                            onDelete={() =>
                                showModal("actionConfirm", {
                                    title: "Delete Course",
                                    description: "Are you sure you want to delete this course?",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                    variant: "destructive",
                                    onConfirm: handleDelete,
                                })
                            }
                            onPublish={() =>
                                showModal("actionConfirm", {
                                    title: "Publish Course",
                                    description: "Do you want to publish this course?",
                                    confirmText: "Publish",
                                    cancelText: "Cancel",
                                    variant: "primary",
                                    onConfirm: handlePublish,
                                })
                            }
                            onUnpublish={() =>
                                showModal("actionConfirm", {
                                    title: "Unpublish Course",
                                    description: "Do you want to unpublish this course?",
                                    confirmText: "Unpublish",
                                    cancelText: "Cancel",
                                    variant: "outline",
                                    onConfirm: handleUnpublish,
                                })
                            }
                        />
                    </div>
                </div>
            </div>
            <h2 className="w-full text-base font-semibold leading-5 text-stone-950 line-clamp-2 min-h-[40px]">
                {title}
            </h2>
        </header>
    );
};