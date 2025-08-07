"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetCourseByIdQuery } from "@/lib/redux/features/course/courseApi";
import CourseCreationForm from "@/components/dashboard/instructor-course/create-course/step1/CourseCreationForm";
import { Course } from "@/types/course";

export default function EditCoursePage() {
    const params = useParams();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
    const [formData, setFormData] = useState<Partial<Course>>({});
    const [courseId, setCourseId] = useState<string | null>(id || null);

    const {
        data: response,
        isLoading: loading,
        error,
    } = useGetCourseByIdQuery(id as string);

    const course = response?.courses;


    useEffect(() => {
        if (course) {
            setFormData(course);
            setCourseId(course._id);
        }
    }, [course]);

    if (loading && id) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error loading course</div>;
    return (
        <CourseCreationForm
            isEdit={true} 
            formData={formData}
            setFormData={setFormData}
            courseId={courseId}
        />
    );
}
