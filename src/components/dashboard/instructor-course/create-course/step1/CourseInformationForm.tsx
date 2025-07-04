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
    const [newBenefit, setNewBenefit] = React.useState("");
    const [newPrereq, setNewPrereq] = React.useState("");

    const { data: categoryData } = useGetCategoriesQuery();
    const { data: levelData } = useGetLevelsQuery();

    const topicArray = React.useMemo(() => Array.isArray(formData.tags) ? formData.tags : [], [formData.tags]);
    const benefitArray = React.useMemo(() => Array.isArray(formData.benefits) ? formData.benefits : [], [formData.benefits]);
    const prereqArray = React.useMemo(() => Array.isArray(formData.prerequisites) ? formData.prerequisites : [], [formData.prerequisites]);

    const updateArrayField = (field: keyof Course, value: any[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                                        label: lv.name,
                                        value: lv._id,
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

                    {/* Full width sections */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Benefits */}
                        <div className="flex items-end gap-2">
                            <FormInput
                                label="Add Benefit"
                                placeholder="e.g. Master JS syntax"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newBenefit) {
                                        updateArrayField("benefits", [...benefitArray, { title: newBenefit }]);
                                        setNewBenefit("");
                                    }
                                }}
                                disabled={!newBenefit}
                                className="flex items-center mb-1 gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {benefitArray.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {benefitArray.map((b, i) => (
                                    <li
                                        key={i}
                                        className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs">
                                                {i + 1}
                                            </span>
                                            <span className="text-gray-800">{b.title}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            onClick={() =>
                                                updateArrayField("benefits", benefitArray.filter((_, idx) => idx !== i))
                                            }
                                            aria-label="Remove benefit"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Prerequisites - same structure as benefits */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-end gap-2">
                            <FormInput
                                label="Add Prerequisite"
                                placeholder="e.g. Know HTML/CSS"
                                value={newPrereq}
                                onChange={(e) => setNewPrereq(e.target.value)}
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newPrereq) {
                                        updateArrayField("prerequisites", [...prereqArray, { title: newPrereq }]);
                                        setNewPrereq("");
                                    }
                                }}
                                disabled={!newPrereq}
                                className="flex items-center mb-1 gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {prereqArray.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {prereqArray.map((p, i) => (
                                    <li
                                        key={i}
                                        className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs">
                                                {i + 1}
                                            </span>
                                            <span className="text-gray-800">{p.title}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            onClick={() =>
                                                updateArrayField("prerequisites", prereqArray.filter((_, idx) => idx !== i))
                                            }
                                            aria-label="Remove prerequisite"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}