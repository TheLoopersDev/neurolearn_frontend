'use client';
import { useState } from "react";
import CourseCreationForm from "./_components/step1/CourseCreationForm";
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
