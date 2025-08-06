'use client';
import { useState } from "react";
import CourseCreationForm from "@/app/(auth)/instructor/courses/create-course/_components/create-course/step1/CourseCreationForm";
import { Course } from "@/types/course";

export default function CreateCoursePage() {
    const [formData, setFormData] = useState<Partial<Course>>({});
    return (
        <CourseCreationForm
            isEdit={false} 
            formData={formData}
            setFormData={setFormData}
        />
    );
}
