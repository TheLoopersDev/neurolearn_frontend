"use client";

import HeaderStepControls from "./HeaderStepControls";
import { CourseInformationForm } from "./CourseInformationForm";
import { FileUploadArea } from "./FileUploadArea";
import { CourseBenefits } from "./CourseBenefits";
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

interface Benefit {
    id: string;
    title: string;
}

interface CourseCreationFormProps {
    formData: Partial<Course>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Course>>>;
    courseId?: string | null;
    isEdit: boolean;
}

export default function CourseCreationForm(props: CourseCreationFormProps) {
    const router = useRouter();
    const { setFormData } = props;
    const [step, setStep] = useState<1 | 2>(1);
    const [draftSaved, setDraftSaved] = useState(false);
    const [courseId, setCourseId] = useState<string | null>(props.courseId || null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isContinuing, setIsContinuing] = useState(false);

    const { data: courseData, isSuccess } = useGetCourseByDetailQuery(courseId!, {
        skip: !courseId,
    });
    const [createCourseApprovalRequest] = useCreateCourseApprovalRequestMutation();
    const { data: sectionData } = useGetAllSectionsQuery(courseId!, { skip: !courseId });

    const [localBenefits, setLocalBenefits] = useState<Benefit[]>([]);

    useEffect(() => {
        if (Array.isArray(props.formData.benefits)) {
            setLocalBenefits(
                props.formData.benefits.map((b, index) => ({
                    id: `benefit-${index}`,
                    title: b.title
                }))
            );
        }
    }, [props.formData.benefits]);

    const handleAddBenefit = (title: string) => {
        const newBenefits = [...localBenefits, { id: Date.now().toString(), title }];
        setLocalBenefits(newBenefits);
        props.setFormData(prev => ({
            ...prev,
            benefits: newBenefits.map(b => ({ title: b.title }))
        }));
    };

    const handleRemoveBenefit = (id: string) => {
        const newBenefits = localBenefits.filter(b => b.id !== id);
        setLocalBenefits(newBenefits);
        props.setFormData(prev => ({
            ...prev,
            benefits: newBenefits.map(b => ({ title: b.title }))
        }));
    };

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

    /** Validate tất cả các trường
  *  - Draft: chỉ cần title
  *  - Submit: kiểm tra full
  */
    const validateForm = (): Record<string, string> => {
        const errs: Record<string, string> = {};
        const data = props.formData;

        const getId = (v: any) => (typeof v === "object" && v !== null ? v._id : v);

        if (!data.name?.trim()) errs.name = "Title is required";
        if (!getId(data.category)?.toString().trim()) errs.category = "Category is required";
        if (!getId(data.level)?.toString().trim()) errs.level = "Skill level is required";
        if (!data.description?.trim()) errs.description = "Description is required";
        if (!Array.isArray(data.benefits) || data.benefits.length === 0)
            errs.benefits = "At least 1 benefit is required";
        if (!Array.isArray(data.prerequisites) || data.prerequisites.length === 0)
            errs.prerequisites = "At least 1 prerequisite is required";
        if (data.price === undefined || data.price < 0)
            errs.price = "Price is required and must be >= 0";
        if (!data.duration || data.duration <= 0)
            errs.duration = "Duration must be greater than 0";
        const hasThumbnail =
            (typeof data.thumbnail === "string" && (data.thumbnail as string).trim() !== "") ||
            (typeof data.thumbnail === "object" &&
                data.thumbnail !== null &&
                "url" in data.thumbnail &&
                typeof (data.thumbnail as any).url === "string" &&
                (data.thumbnail as any).url.trim() !== "");

        if (!hasThumbnail) errs.thumbnail = "Thumbnail is required";
        setErrors(errs);
        return errs;
    };


    const showValidationToast = (errors: Record<string, string>) => {
        const errorMessages = Object.values(errors);
        if (errorMessages.length > 0) {
            toast({
                title: "Validation Error",
                description: (
                    <ul className="list-disc pl-4">
                        {errorMessages.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                ),
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    const handleSaveDraft = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            showValidationToast(errors);
            return;
        }

        setIsSavingDraft(true);
        try {
            const payload = { ...getPayload(), isDraft: true };

            // Always use update if we have a courseId
            if (courseId) {
                await updateCourse({ id: courseId, course: payload }).unwrap();
                toast({
                    title: "Draft updated",
                    description: "Draft updated successfully.",
                    variant: "success"
                });
            } else {
                const res = await createCourse(payload).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");

                // Update both local state and parent component state
                props.setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({
                    title: "Draft created",
                    description: "Draft created successfully.",
                    variant: "success"
                });
            }

            setDraftSaved(true);
        } catch (err) {
            console.error("Error saving draft:", err);
            toast({
                title: "Error",
                description: "Failed to save draft.",
                variant: "destructive"
            });
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handlePublishCourse = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            showValidationToast(errs);
            return;
        }

        // If no courseId exists, save as draft first
        if (!courseId) {
            try {
                await handleSaveDraft();
                // If still no courseId after saving, throw error
                if (!courseId) throw new Error("Failed to create course draft");
            } catch (err) {
                return; // Error already handled by handleSaveDraft
            }
        }

        setIsPublishing(true);
        try {
        // Verify course content
            const sections = sectionData?.data || [];
            if (sections.length === 0 || !sections.some((s: any) => s.lessons?.length > 0)) {
                toast({
                    title: "Error",
                    description: "Course needs at least 1 section and lesson.",
                    variant: "destructive"
                });
                return;
            }

            // Update existing course (don't create new one)
            const payload = {
                ...getPayload(),
                isDraft: false,
                isPublished: false
            };

            await updateCourse({
                id: courseId,
                course: payload
            }).unwrap();

            // Create approval request for the existing course
            const res = await createCourseApprovalRequest({
                courseId,
                message: "Requesting course approval"
            }).unwrap();

            toast({
                title: "Success",
                description: res?.message || "Course submitted for approval!",
                variant: "success",
            });

            router.push(`/dashboard/courses`);
        } catch (err: any) {
            console.error("Publish error:", err);
            toast({
                title: "Error",
                description: err?.data?.message || "Failed to publish course.",
                variant: "destructive"
            });
        } finally {
            setIsPublishing(false);
        }
    };

    // Handle continue to next step

    const handleContinue = async () => {
        const isValid = validateForm();
        if (!isValid) {
            showValidationToast(errors);
            return;
        }

        setIsContinuing(true);
        try {
            if (!courseId) {
                // Chưa có courseId thì tạo draft trước
                const payload = { ...getPayload(), isDraft: true };
                const res = await createCourse(payload).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                props.setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({ title: "Draft created", description: "Draft created successfully.", variant: "success" });
            }
            setStep(2);
        } catch (err) {
            toast({ title: "Error", description: "Failed to create draft for step 2.", variant: "destructive" });
        } finally {
            setIsContinuing(false);
        }
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
                        loading={{
                            continue: isContinuing,
                            draft: isSavingDraft,
                            publish: isPublishing
                        }}
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
                                <CourseBenefits
                                    benefits={localBenefits}
                                    onAdd={handleAddBenefit}
                                    onRemove={handleRemoveBenefit}
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