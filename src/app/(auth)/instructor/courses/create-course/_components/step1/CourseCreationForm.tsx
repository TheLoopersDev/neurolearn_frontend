"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import {
    useCreateCourseMutation,
    useGetCourseByDetailQuery,
    useUpdateCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { useCreateCourseApprovalRequestMutation } from "@/lib/redux/features/request/requestApi";
import { useGetAllSectionsQuery, useCreateSectionMutation } from "@/lib/redux/features/course/section/sectionApi";
import { useCreateLessonMutation } from "@/lib/redux/features/course/section/lesson/lessonApi";
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
    const [isContinuingAI, setIsContinuingAI] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);
    // Optional document to guide AI curriculum generation
    const [curriculumDoc, setCurriculumDoc] = useState<File | null>(null);
    const docInputRef = useRef<HTMLInputElement | null>(null);
    const [isDocDragOver, setIsDocDragOver] = useState(false);
    const handleDocDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDocDragOver(true); };
    const handleDocDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDocDragOver(false); };
    const handleDocDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDocDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setCurriculumDoc(file);
    };
    const handleDocClick = () => { docInputRef.current?.click(); };
    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        setCurriculumDoc(f || null);
    };

    const { data: courseData, isSuccess } = useGetCourseByDetailQuery(courseId as string, { skip: !courseId });
    const { refetch: refetchAllSections, } = useGetAllSectionsQuery(courseId!, { skip: !courseId });
    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const [createCourseApprovalRequest] = useCreateCourseApprovalRequestMutation();
    const [createSection] = useCreateSectionMutation();
    const [createLesson] = useCreateLessonMutation();

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
            const fetch = await refetchAllSections();
            const sections = 'data' in fetch ? (fetch.data?.data || []) : [];

            if (!sections.length || !sections.some((s: any) => s.lessons?.length)) {
                toast({ title: "Error", description: "Course needs at least 1 section & lesson.", variant: "destructive" });
                return;
            }

            await updateCourse({ id: courseId, course: { ...getPayload(), isDraft: false } }).unwrap();
            const res = await createCourseApprovalRequest({ courseId, message: "Requesting course approval" }).unwrap();
            toast({ title: "Success", description: res?.message || "Submitted!", variant: "success" });
            router.push("/instructor/courses");
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

    const handleContinueAI = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);

        setIsContinuingAI(true);
        try {
            let id = courseId;
            if (!id) {
                const res = await createCourse({ ...getPayload(), isDraft: true }).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                id = newId;
            }
            if (!id) throw new Error('Missing course id');

            const d = formData;
            const topicList = Array.isArray(d.tags) ? d.tags.join(", ") : '';
            const levelName = typeof d.level === 'object' ? (d.level?.name || d.level?._id || '') : String(d.level || '');

            const fd = new FormData();
            fd.append('mode', 'curriculum');
            fd.append('prompt', 'Generate a course curriculum.');
            fd.append('title', d.name || '');
            fd.append('subtitle', d.subTitle || '');
            fd.append('description', d.description || '');
            fd.append('overview', d.overview || '');
            fd.append('topics', topicList);
            fd.append('level', levelName);
            fd.append('duration', String(d.duration || ''));
            if (curriculumDoc) fd.append('file', curriculumDoc);

            const res = await fetch('/api/ai/summarize', { method: 'POST', body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'AI generation failed');

            const curriculum = json?.curriculum;
            if (!curriculum || !Array.isArray(curriculum.sections)) throw new Error('Invalid AI curriculum response');

            for (const section of curriculum.sections as Array<{ title: string; description?: string; lessons?: Array<{ title: string; isFree?: boolean }> }>) {
                const sectionPayload: any = { title: section.title || 'Section', description: section.description || '' };
                const createdSec = await createSection({ courseId: id, data: sectionPayload }).unwrap();
                const secId = createdSec?.data?._id || createdSec?._id;
                if (!secId) continue;
                if (Array.isArray(section.lessons)) {
                    for (const lesson of section.lessons) {
                        await createLesson({ courseId: id, sectionId: secId, data: { title: lesson.title || 'Lesson', isFree: lesson.isFree ?? true } }).unwrap();
                    }
                }
            }

            toast({ title: 'AI Curriculum generated', description: 'Sections and lessons created.', variant: 'success' });
            setStep(2);
        } catch (e: any) {
            toast({ title: 'AI Error', description: e?.message || 'Failed to generate curriculum.', variant: 'destructive' });
        } finally {
            setIsContinuingAI(false);
        }
    };

    return (
        <ToastProvider>
            <main className="w-full h-full">
                <div className="flex flex-col gap-6 w-full">
                    <HeaderStepControls
                        step={step}
                        onContinue={handleContinue}
                        onContinueAI={handleContinueAI}
                        onBack={() => setStep(1)}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublishCourse}
                        draftSaved={draftSaved}
                        loading={{ continue: isContinuing, draft: isSavingDraft, publish: isPublishing, ai: isContinuingAI }}
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
                                {/* Optional curriculum source document for AI */}
                                <div className="w-full bg-white rounded-3xl p-6 shadow-sm">
                                    <div className="font-medium mb-2">Curriculum source document (optional)</div>
                                    <p className="text-xs text-gray-500 mb-2">Provide a TXT / PDF / DOCX to guide AI when generating the course curriculum.</p>
                                    <button
                                        type="button"
                                        className={`flex flex-col justify-center items-center rounded-xl border-2 border-blue-600 border-dashed w-full h-64 cursor-pointer text-left p-0 ${isDocDragOver ? 'bg-blue-50' : ''}`}
                                        onDragOver={handleDocDragOver}
                                        onDragLeave={handleDocDragLeave}
                                        onDrop={handleDocDrop}
                                        onClick={handleDocClick}
                                        aria-label="Upload curriculum document"
                                    >
                                        <input
                                            ref={docInputRef}
                                            id="curriculum-doc-input"
                                            type="file"
                                            accept=".txt,.pdf,.docx"
                                            onChange={handleDocChange}
                                            className="hidden"
                                            aria-hidden="true"
                                            tabIndex={-1}
                                        />
                                        <div className="flex flex-col gap-2 items-center text-center pointer-events-none px-4">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#2563eb" strokeWidth="1.5"/>
                                                <path d="M14 2V8H20" stroke="#2563eb" strokeWidth="1.5"/>
                                                <path d="M8 13H16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
                                                <path d="M8 17H12" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            <p className="text-sm leading-5 text-neutral-500">
                                                Drag and drop or <span className="font-bold text-blue-600">Choose File</span> (max 10MB)
                                            </p>
                                            {curriculumDoc && (
                                                <div className="text-xs text-gray-600 truncate w-full">Selected: {curriculumDoc.name}</div>
                                            )}
                                        </div>
                                    </button>
                                </div>
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
