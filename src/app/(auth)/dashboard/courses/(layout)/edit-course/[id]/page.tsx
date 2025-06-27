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

    const { data, isLoading } = useGetCourseByIdQuery(id!, { skip: !id });

    useEffect(() => {
        if (data?.data) {
            setFormData(data.data);
            setCourseId(data.data._id);
        }
    }, [data]);

    if (isLoading && id) return <div>Loading...</div>;

    return (
        <CourseCreationForm
            formData={formData}
            setFormData={setFormData}
            courseId={courseId}
        />
    );
}
