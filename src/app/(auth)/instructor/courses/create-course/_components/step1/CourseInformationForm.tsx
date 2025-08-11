"use client";

import * as React from "react";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { TagList } from "./TagList";
import { Course } from "@/types/course";
import { useGetCategoriesQuery } from "@/lib/redux/features/course/category/categoryApi";
import { useGetLevelsQuery } from "@/lib/redux/features/course/level/levelApi";
import { Plus, Trash2 } from "lucide-react";

interface CourseInformationFormProps {
    formData: Partial<Course>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Course>>>;
    courseId?: string | null;
    onDraftSaved?: (id: string) => void;
}

export function CourseInformationForm({
    formData = {},
    setFormData,
}: CourseInformationFormProps) {
    const [selectedTopic, setSelectedTopic] = React.useState("");
    const [newPrereq, setNewPrereq] = React.useState("");

    const { data: categoryData } = useGetCategoriesQuery();
    const { data: levelData } = useGetLevelsQuery();


    const updateArrayField = (field: keyof Course, value: any[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const topicArray = Array.isArray(formData.tags) ? formData.tags : [];
    const benefitsArray = Array.isArray(formData.benefits) ? formData.benefits : [];
    const prereqArray = Array.isArray(formData.prerequisites) ? formData.prerequisites : [];

    const [newBenefit, setNewBenefit] = React.useState("");

    const handleAddBenefit = () => {
        if (newBenefit.trim() && benefitsArray.length < 3) {
            updateArrayField("benefits", [...benefitsArray, { title: newBenefit }]);
            setNewBenefit("");
        }
    };

    const handleRemoveBenefit = (index: number) => {
        const newBenefits = benefitsArray.filter((_, i) => i !== index);
        updateArrayField("benefits", newBenefits);
    };


    return (
        <section className="p-6 bg-white rounded-xl w-full">
            <div className="flex flex-col gap-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800">Course Information</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <FormInput
                            label="Title"
                            placeholder="Your course title"
                            required
                            value={formData.name || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        />

                        <FormInput
                            label="Sub Title"
                            placeholder="Short course subtitle"
                            value={formData.subTitle || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subTitle: e.target.value }))}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                label="Category"
                                placeholder="Select"
                                options={
                                    categoryData?.categories?.map((cat) => ({
                                        label: cat.title,
                                        value: cat._id,
                                    })) || []
                                }
                                value={
                                    typeof formData.category === "object" && formData.category !== null
                                        ? formData.category._id
                                        : (formData.category as string) || ""
                                }
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                                }
                            />

                            <FormSelect
                                label="Skill level"
                                placeholder="Select"
                                options={
                                    levelData?.levels?.map((lv) => ({
                                        label: lv.name,   // Hiển thị tên
                                        value: lv._id,    // Giá trị là _id
                                    })) || []
                                }
                                value={
                                    typeof formData.level === "object" && formData.level !== null
                                        ? formData.level._id
                                        : (formData.level as string) || ""
                                }
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, level: e.target.value }))
                                }
                            />

                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Original Price"
                                placeholder="Enter price"
                                type="number"
                                value={formData.price?.toString() || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        price: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />

                            <FormInput
                                label="Sale Price"
                                placeholder="Enter sale price"
                                type="number"
                                value={formData.estimatedPrice?.toString() || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        estimatedPrice: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                        </div>

                        <FormInput
                            label="Duration (minutes)"
                            placeholder="e.g. 120"
                            type="number"
                            value={formData.duration?.toString() || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    duration: parseInt(e.target.value) || 0,
                                }))
                            }
                        />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        {/* Topic select */}
                        <div>
                            <FormSelect
                                label="Add Topic"
                                placeholder="Select topic"
                                options={[
                                    { label: "JavaScript", value: "JavaScript" },
                                    { label: "Async", value: "Async" },
                                    { label: "OOP", value: "OOP" },
                                    { label: "DOM", value: "DOM" },
                                    { label: "ES6+", value: "ES6+" },
                                ]}
                                value={selectedTopic}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && !topicArray.includes(val)) {
                                        updateArrayField("tags", [...topicArray, val]);
                                        setSelectedTopic("");
                                    }
                                }}
                            />
                            <TagList
                                tags={topicArray}
                                onRemoveTag={(index) =>
                                    updateArrayField("tags", topicArray.filter((_, i) => i !== index))
                                }
                                className="mt-2 "
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-900">Description</label>
                            <textarea
                                placeholder="Course description"
                                className="p-3 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[120px]"
                                value={formData.description || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-900">Overview</label>
                            <textarea
                                placeholder="Course overview"
                                className="p-3 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[120px]"
                                value={formData.overview || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, overview: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    {/* Prerequisites - same structure as benefits */}
                    <div className="md:col-span-2 space-y-6">
                        <header className="flex flex-col gap-3 items-start self-stretch">
                            <h2 className="self-stretch text-2xl font-bold leading-7 text-stone-950 max-sm:text-xl">
                                Course Prerequisites
                            </h2>
                            <p className="self-stretch text-xs leading-4 text-right text-blue-600">
                                {prereqArray.length}/3 prerequisites
                            </p>
                        </header>

                        {/* List of prerequisites */}
                        <div className="flex flex-col gap-3 items-start self-stretch w-full">
                            {prereqArray.map((p, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center self-stretch p-3 h-14 rounded-xl bg-slate-50 w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex relative justify-center items-center w-7 h-7">
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stage-icon"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M14.0001 3C20.1203 3 25.0834 7.96201 25.0834 14.0833C25.0834 20.2047 20.1203 25.1667 14.0001 25.1667C7.87876 25.1667 2.91675 20.2047 2.91675 14.0833C2.91675 7.96201 7.87876 3 14.0001 3Z"
                                                    stroke="#6B6B6B"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="absolute text-xs leading-6 text-neutral-500">
                                                {i + 1}
                                            </span>
                                        </div>
                                        <span className="text-xs leading-4 text-stone-950">
                                            {p.title}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        onClick={() =>
                                            updateArrayField(
                                                "prerequisites",
                                                prereqArray.filter((_, idx) => idx !== i)
                                            )
                                        }
                                        aria-label="Remove prerequisite"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Input + button, hidden if length >= 3 */}
                        {prereqArray.length < 3 && (
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={newPrereq}
                                    onChange={(e) => setNewPrereq(e.target.value)}
                                    placeholder="Enter prerequisite"
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg"
                                    onKeyDown={(e) => e.key === "Enter" && newPrereq && (() => {
                                        updateArrayField("prerequisites", [...prereqArray, { title: newPrereq }]);
                                        setNewPrereq("");
                                    })()}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newPrereq) {
                                            updateArrayField("prerequisites", [...prereqArray, { title: newPrereq }]);
                                            setNewPrereq("");
                                        }
                                    }}
                                    disabled={!newPrereq.trim()}
                                    className="flex items-center justify-center p-3 w-14 h-14 bg-slate-50 rounded-[40px] hover:bg-slate-100 transition-colors disabled:opacity-50"
                                    aria-label="Add new prerequisite"
                                >
                                    <Plus className="text-blue-600" size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Course Benefits */}
                    <div className="md:col-span-2 space-y-6">
                        <header className="flex flex-col gap-3 items-start self-stretch">
                            <h2 className="self-stretch text-2xl font-bold leading-7 text-stone-950 max-sm:text-xl">
                                Course Benefits
                            </h2>
                            <p className="self-stretch text-xs leading-4 text-right text-blue-600">
                                {benefitsArray.length}/3 benefits
                            </p>
                        </header>

                        <div className="flex flex-col gap-3 items-start self-stretch w-full">
                            {benefitsArray.map((b, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center self-stretch p-3 h-14 rounded-xl bg-slate-50 w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex relative justify-center items-center w-7 h-7">
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stage-icon"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M14.0001 3C20.1203 3 25.0834 7.96201 25.0834 14.0833C25.0834 20.2047 20.1203 25.1667 14.0001 25.1667C7.87876 25.1667 2.91675 20.2047 2.91675 14.0833C2.91675 7.96201 7.87876 3 14.0001 3Z"
                                                    stroke="#6B6B6B"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className="absolute text-xs leading-6 text-neutral-500">{i + 1}</span>
                                        </div>
                                        <span className="text-xs leading-4 text-stone-950">{b.title}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        onClick={() => handleRemoveBenefit(i)}
                                        aria-label="Remove benefit"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {benefitsArray.length < 3 && (
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    placeholder="Enter benefit"
                                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg"
                                    onKeyDown={(e) => e.key === "Enter" && handleAddBenefit()}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddBenefit}
                                    disabled={!newBenefit.trim()}
                                    className="flex items-center justify-center p-3 w-14 h-14 bg-slate-50 rounded-[40px] hover:bg-slate-100 transition-colors disabled:opacity-50"
                                    aria-label="Add new benefit"
                                >
                                    <Plus className="text-blue-600" size={24} />
                                </button>
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </section>
    );
}