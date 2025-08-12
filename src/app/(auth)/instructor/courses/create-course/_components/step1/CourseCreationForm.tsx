"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import {
    useCreateCourseMutation,
    useGetCourseByDetailQuery,
    useUpdateCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { useCreateCourseApprovalRequestMutation } from "@/lib/redux/features/request/requestApi";
import { useGetAllSectionsQuery } from "@/lib/redux/features/course/section/sectionApi";
import HeaderStepControls from "./HeaderStepControls";
import { CourseInformationForm } from "./CourseInformationForm";
import { FileUploadArea } from "./FileUploadArea";
import CourseSectionList from "../step2/CourseSectionList";
import { ToastProvider, ToastViewport } from "@/components/common/ui/Toast";
import { useToast } from "@/hooks/use-toast";

interface Props {
    formData: Partial<Course>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Course>>>;
    courseId?: string | null;
    isEdit: boolean;
}

export default function CourseCreationForm({ formData, setFormData, courseId: propCourseId }: Props) {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [courseId, setCourseId] = useState<string | null>(propCourseId || null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isContinuing, setIsContinuing] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    const { data: courseData, isSuccess } = useGetCourseByDetailQuery(courseId as string, { skip: !courseId });
    const { data: sectionData } = useGetAllSectionsQuery(courseId!, { skip: !courseId });
    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const [createCourseApprovalRequest] = useCreateCourseApprovalRequestMutation();

    useEffect(() => {
        if (isSuccess && courseData?.courses) {
            const course = courseData.courses;
            setFormData({
                ...course,
                tags: Array.isArray(course.tags) ? course.tags : [],
                benefits: Array.isArray(course.benefits) ? course.benefits : [],
                prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
            });
        }
    }, [isSuccess, courseData, setFormData]);

    useEffect(() => {
        if (propCourseId && propCourseId !== courseId) setCourseId(propCourseId);
    }, [propCourseId, courseId]);

    const getPayload = () => {
        const data = formData;
        if (!data.name) throw new Error("Course title is required.");

        const extractId = (v: any) => (typeof v === "object" && v ? v._id : v);
        return {
            name: data.name,
            subTitle: data.subTitle || "",
            description: data.description || "",
            overview: data.overview || "",
            level: extractId(data.level),
            category: extractId(data.category),
            subCategory: extractId(data.subCategory),
            price: data.price || 0,
            estimatedPrice: data.estimatedPrice || 0,
            thumbnail: typeof data.thumbnail === "object" ? data.thumbnail : undefined,
            demoUrl: data.demoUrl || undefined,
            duration: data.duration || 0,
            topics: Array.isArray(data.tags) ? data.tags : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
            isFree: data.isFree || false,
            isDraft: data.isDraft ?? true,
            isPublished: data.isPublished ?? false,
        };
    };

    const validateForm = (): Record<string, string> => {
        const data = formData;
        const getId = (v: any) => (typeof v === "object" && v !== null ? v._id : v);
        const errs: Record<string, string> = {};

        if (!data.name?.trim()) errs.name = "Title is required";
        if (!getId(data.category)) errs.category = "Category is required";
        if (!getId(data.level)) errs.level = "Skill level is required";
        if (!data.description?.trim()) errs.description = "Description is required";
        // if (!data.benefits?.length) errs.benefits = "At least 1 benefit is required";
        // if (!data.prerequisites?.length) errs.prerequisites = "At least 1 prerequisite is required";
        if (data.price == null || data.price < 0) errs.price = "Price is required and must be >= 0";
        if (!data.duration || data.duration <= 0) errs.duration = "Duration must be greater than 0";
        if (data.tags && data.tags.length > 3) {
            errs.tags = "Maximum 3 topics allowed";
        }

        const thumbnailUrl =
            typeof data.thumbnail === "string" ? data.thumbnail : data.thumbnail?.url;
        if (!thumbnailUrl?.trim()) errs.thumbnail = "Thumbnail is required";

        setErrors(errs);
        return errs;
    };

    const showValidationToast = (errors: Record<string, string>) => {
        const msgs = Object.values(errors);
        if (msgs.length > 0) {
            toast({
                title: "Validation Error",
                description: <ul className="list-disc pl-4">{msgs.map((m, i) => <li key={i}>{m}</li>)}</ul>,
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    const handleSaveDraft = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);

        setIsSavingDraft(true);
        try {
            const payload = { ...getPayload(), isDraft: true };
            if (courseId) {
                await updateCourse({ id: courseId, course: payload }).unwrap();
                toast({ title: "Draft updated", description: "Successfully updated.", variant: "success" });
            } else {
                const res = await createCourse(payload).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({ title: "Draft created", description: "Successfully created.", variant: "success" });
            }
            setDraftSaved(true);
        } catch (err) {
            toast({ title: "Error", description: "Failed to save draft.", variant: "destructive" });
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handlePublishCourse = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);

        if (!courseId) {
            await handleSaveDraft();
            if (!courseId) return;
        }

        setIsPublishing(true);
        try {
            const sections = sectionData?.data || [];
            if (!sections.length || !sections.some((s: any) => s.lessons?.length)) {
                toast({ title: "Error", description: "Course needs at least 1 section & lesson.", variant: "destructive" });
                return;
            }
            await updateCourse({ id: courseId, course: { ...getPayload(), isDraft: false } }).unwrap();
            const res = await createCourseApprovalRequest({ courseId, message: "Requesting course approval" }).unwrap();
            toast({ title: "Success", description: res?.message || "Submitted!", variant: "success" });
            router.push("/dashboard/courses");
        } catch (err: any) {
            toast({ title: "Error", description: err?.data?.message || "Failed to publish.", variant: "destructive" });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleContinue = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);

        setIsContinuing(true);
        try {
            if (!courseId) {
                const res = await createCourse({ ...getPayload(), isDraft: true }).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({ title: "Draft created", description: "Draft saved.", variant: "success" });
            }
            setStep(2);
        } catch {
            toast({ title: "Error", description: "Failed to continue.", variant: "destructive" });
        } finally {
            setIsContinuing(false);
        }
    };

    return (
        <ToastProvider>
            <main className="w-full h-full">
                <div className="flex flex-col gap-6 w-full">
                    <HeaderStepControls
                        step={step}
                        onContinue={handleContinue}
                        onBack={() => setStep(1)}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublishCourse}
                        draftSaved={draftSaved}
                        loading={{ continue: isContinuing, draft: isSavingDraft, publish: isPublishing }}
                    />

                    {step === 1 && (
                        <section className="flex flex-row gap-6 items-start w-full max-w-[1120px] h-full">
                            <div className="w-4/5">
                                <CourseInformationForm
                                    key={courseId ?? "new-course"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    courseId={courseId}
                                    errors={errors}
                                    setErrors={setErrors}
                                    onDraftSaved={(id) => {
                                        setFormData((prev) => ({ ...prev, _id: id }));
                                        setCourseId(id);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-6">
                                <FileUploadArea
                                    thumbnail={typeof formData.thumbnail === "object" ? formData.thumbnail : null}
                                    setThumbnail={(val) =>
                                        setFormData((prev) => ({ ...prev, thumbnail: typeof val === "string" ? { url: val } : val }))
                                    }
                                />
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
