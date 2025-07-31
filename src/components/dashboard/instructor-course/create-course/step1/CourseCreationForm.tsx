"use client";

import HeaderStepControls from "./HeaderStepControls";
import { CourseInformationForm } from "./CourseInformationForm";
import { FileUploadArea } from "./FileUploadArea";
import { CourseStages } from "./CourseStages";
import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import {
    useCreateCourseMutation,
    useGetCourseByDetailQuery,
    useUpdateCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { useCreateCourseApprovalRequestMutation } from "@/lib/redux/features/request/requestApi";
import { useGetAllSectionsQuery } from "@/lib/redux/features/course/section/sectionApi";

import CourseSectionList from "../step2/CourseSectionList";
import { ToastProvider, ToastViewport } from "@/components/common/ui/Toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CourseCreationFormProps {
    formData: Partial<Course>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Course>>>;
    courseId?: string | null;
}

export default function CourseCreationForm(props: CourseCreationFormProps) {
    const router = useRouter();
    const { setFormData } = props;
    const [step, setStep] = useState<1 | 2>(1);
    const [draftSaved, setDraftSaved] = useState(false);
    const [courseId, setCourseId] = useState<string | null>(props.courseId || null);
    const { toast } = useToast();

    const { data: courseData, isSuccess } = useGetCourseByDetailQuery(courseId!, {
        skip: !courseId,
    });
    const [createCourseApprovalRequest] = useCreateCourseApprovalRequestMutation();
    const { data: sectionData } = useGetAllSectionsQuery(courseId!, { skip: !courseId });

    useEffect(() => {
        if (isSuccess && courseData?.courses) {
            setFormData(courseData.courses);
        }
    }, [isSuccess, courseData, setFormData]);


    useEffect(() => {
        if (props.courseId && props.courseId !== courseId) {
            setCourseId(props.courseId);
        }
    }, [props.courseId, courseId]);

    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();

    const getPayload = () => {
        const data = props.formData;

        if (!data.name) throw new Error("Course title is required.");

        return {
            name: data.name,
            subTitle: data.subTitle || "",
            description: data.description || "",
            overview: data.overview || "",
            level: typeof data.level === "object" && data.level ? data.level._id : data.level,
            category: typeof data.category === "object" && data.category ? data.category._id : data.category,
            subCategory: typeof data.subCategory === "object" && data.subCategory ? data.subCategory._id : data.subCategory,
            price: data.price || 0,
            estimatedPrice: data.estimatedPrice || 0,
            thumbnail: typeof data.thumbnail === "object" && data.thumbnail !== null ? data.thumbnail : undefined,
            demoUrl: data.demoUrl || undefined,
            duration: data.duration || 0,
            topics: Array.isArray(data.tags) ? data.tags : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
            isFree: data.isFree || false,
            isDraft: data.isDraft || true,
            isPublished: data.isPublished || false,
        };
    };

    const handleSaveDraft = async () => {
        try {
            const payload = { ...getPayload(), isDraft: true };

            if (courseId) {
                await updateCourse({ id: courseId, course: payload }).unwrap();
                toast({
                    title: "Draft saved",
                    description: "Your course draft has been updated successfully.",
                    variant: "success",
                });
            } else {
                const res = await createCourse(payload).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                props.setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({
                    title: "Draft created",
                    description: "Your course draft has been created successfully.",
                    variant: "success",
                });
            }

            setDraftSaved(true);
        } catch (err) {
            console.error("❌ Error saving draft:", err);
            toast({
                title: "Error",
                description: "Failed to save draft. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handlePublishCourse = async () => {
        try {
            if (!courseId) {
                toast({
                    title: "Warning",
                    description: "Please save the draft before publishing.",
                    variant: "default",
                });
                return;
            }
            // ✅ Kiểm tra ít nhất 1 section và 1 lesson
            const sections = sectionData?.data || [];
            if (sections.length === 0) {
                toast({
                    title: "Error",
                    description: "Your course must have at least 1 section to publish.",
                    variant: "destructive",
                });
                return;
            }

            const hasLesson = sections.some((s: any) => s.lessons && s.lessons.length > 0);
            if (!hasLesson) {
                toast({
                    title: "Error",
                    description: "Your course must have at least 1 lesson to publish.",
                    variant: "destructive",
                });
                return;
            }

            // 1. Cập nhật trạng thái course 
            const payload = {
                ...getPayload(),
                isPublished: false,
                isDraft: false,
            };

            await updateCourse({ id: courseId, course: payload }).unwrap();

            // 2. Gửi request duyệt course
            await createCourseApprovalRequest({
                courseId,
                message: "Requesting course approval"
            }).unwrap();

            toast({
                title: "Success",
                description: "Course published and approval request sent successfully!",
                variant: "success",
            });
            router.push(`/dashboard/courses/${courseId}`);
        } catch (err) {
            console.error("❌ Error publishing course:", err);
            toast({
                title: "Error",
                description: "Failed to publish or request approval. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleContinue = async () => {
        if (!courseId) {
            try {
                const payload = { ...getPayload(), isDraft: true };
                const res = await createCourse(payload).unwrap();
                const newId = res?.data?._id;
                if (!newId) throw new Error("No course ID returned.");
                props.setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({
                    title: "Draft created",
                    description: "Your course draft has been created successfully.",
                    variant: "success",
                });
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to create draft. Please try again.",
                    variant: "destructive",
                });
                return;
            }
        }
        setStep(2);
    };

    const handleBack = () => setStep(1);

    return (
        <ToastProvider>
            <main className="w-full h-full">
                <div className="flex flex-col gap-6 w-full">
                    <HeaderStepControls
                        step={step}
                        onContinue={handleContinue}
                        onBack={handleBack}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublishCourse}
                        draftSaved={draftSaved}
                    />

                    {step === 1 && (
                        <section className="flex flex-row gap-6 items-start w-full max-w-[1120px] h-full">
                            <div className="w-4/5">
                                <CourseInformationForm
                                    formData={props.formData}
                                    setFormData={props.setFormData}
                                    courseId={courseId}
                                    onDraftSaved={(id) => {
                                        props.setFormData((prev) => ({ ...prev, _id: id }));
                                        setCourseId(id);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                <FileUploadArea
                                    thumbnail={
                                        typeof props.formData.thumbnail === "object" && props.formData.thumbnail !== null
                                            ? props.formData.thumbnail
                                            : null
                                    }
                                    setThumbnail={(val) =>
                                        props.setFormData((prev) => ({
                                            ...prev,
                                            thumbnail: typeof val === "string" ? { url: val } : val,
                                        }))
                                    }
                                />
                                <CourseStages />
                            </div>
                        </section>
                    )}
                    {step === 2 && courseId && (
                        <section className="w-full max-w-4xl mx-auto mt-8">
                            <CourseSectionList courseId={courseId} />
                        </section>
                    )}
                </div>
                <ToastViewport />
            </main>
        </ToastProvider>
    );
}