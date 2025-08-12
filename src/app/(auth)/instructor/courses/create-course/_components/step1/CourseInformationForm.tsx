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
    errors?: Record<string, string>;
    setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function CourseInformationForm({
    formData = {},
    setFormData,
    errors = {},
    setErrors,
}: CourseInformationFormProps) {
    const [selectedTopic, setSelectedTopic] = React.useState("");
    const [newPrereq, setNewPrereq] = React.useState("");
    const [newBenefit, setNewBenefit] = React.useState("");

    const { data: categoryData } = useGetCategoriesQuery();
    const { data: levelData } = useGetLevelsQuery();

    const topicArray = Array.isArray(formData.tags) ? formData.tags : [];
    const benefitsArray = Array.isArray(formData.benefits) ? formData.benefits : [];
    const prereqArray = Array.isArray(formData.prerequisites) ? formData.prerequisites : [];

    const setField = <K extends keyof Course>(key: K, value: Course[K]) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const updateArrayField = (field: keyof Course, value: any[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const pushError = (key: string, message?: string) => {
        if (!setErrors) return;
        setErrors((prev) => {
            const next = { ...(prev || {}) };
            if (message) next[key] = message;
            else delete next[key];
            return next;
        });
    };

    // Benefits
    const handleAddBenefit = () => {
        const v = newBenefit.trim();
        if (!v) return;
        if (benefitsArray.length >= 3) return;
        updateArrayField("benefits", [...benefitsArray, { title: v }]);
        setNewBenefit("");
        pushError("benefits", undefined);
    };
    const handleRemoveBenefit = (idx: number) => {
        const next = benefitsArray.filter((_, i) => i !== idx);
        updateArrayField("benefits", next);
        if (next.length > 0) pushError("benefits", undefined);
    };

    // Topics (max 3)
    const canAddTopic = (val: string) =>
        !!val && !topicArray.includes(val) && topicArray.length < 3;

    const addTopic = (val: string) => {
        const v = (val || "").trim();
        if (!v) return;
        if (topicArray.length >= 3) {
            pushError("tags", "Maximum 3 topics allowed");
            return;
        }
        if (topicArray.includes(v)) return;
        updateArrayField("tags", [...topicArray, v]);
        setSelectedTopic("");
        pushError("tags", undefined);
    };

    const removeTopic = (index: number) => {
        const next = topicArray.filter((_, i) => i !== index);
        updateArrayField("tags", next);
        if (next.length >= 1 && next.length <= 3) pushError("tags", undefined);
    };

    // --- replace the old TextArea with this simplest version -------------------
    const TextArea = ({
        label,
        value,
        onChange,
        required,
        error,
        placeholder,
    }: {
        label: string;
        value?: string;
            onChange: (v: string) => void; // vẫn báo lên parent, nhưng TÙY lúc
        required?: boolean;
        error?: string;
        placeholder?: string;
        }) => {
        // Uncontrolled: không buộc value theo parent mỗi keystroke
        const ref = React.useRef<HTMLTextAreaElement>(null);

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-900">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <textarea
                    ref={ref}
                    defaultValue={value || ""}               // <-- KHÔNG dùng `value`
                    placeholder={placeholder}
                    className={`p-3 text-sm text-gray-900 rounded-lg border min-h-[120px] outline-none resize-y
        ${error ? "border-red-500 ring-2 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}`}
                    // ghi về parent khi người dùng thật sự “xong” thao tác
                    onBlur={() => onChange(ref.current?.value ?? "")}
                    onInput={() => {
                        // nếu bạn VẪN muốn parent biết trong lúc gõ, dùng onInput nhẹ nhàng:
                        // onChange((e.target as HTMLTextAreaElement).value);
                    }}
                    // tránh Enter kích hoạt submit form → “out”
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            // cho phép Ctrl/Cmd+Enter nếu bạn muốn
                            onChange(ref.current?.value ?? "");
                        }
                    }}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    };


    return (
        <section className="p-6 bg-white rounded-xl w-full">
            <div className="flex flex-col gap-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800">Course Information</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                    onSubmit={(e) => e.preventDefault()} >
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <FormInput
                            label="Title"
                            placeholder="Your course title"
                            required
                            value={formData.name || ""}
                            onChange={(e) => {
                                setField("name", e.target.value);
                                if (e.target.value.trim()) pushError("name", undefined);
                            }}
                            error={errors.name}
                        />

                        <FormInput
                            label="Sub Title"
                            placeholder="Short course subtitle"
                            value={formData.subTitle || ""}
                            onChange={(e) => setField("subTitle", e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                label="Category"
                                placeholder="Select"
                                required
                                options={
                                    categoryData?.categories?.map((cat) => ({
                                        label: cat.title,
                                        value: cat._id,
                                    })) || []
                                }
                                value={
                                    typeof formData.category === "object" && formData.category !== null
                                        ? (formData.category as any)._id
                                        : (formData.category as string) || ""
                                }
                                onChange={(e) => {
                                    setField("category", e.target.value);
                                    if (e.target.value) pushError("category", undefined);
                                }}
                                error={errors.category}
                            />

                            <FormSelect
                                label="Skill level"
                                placeholder="Select"
                                required
                                options={
                                    levelData?.levels?.map((lv) => ({
                                        label: lv.name,
                                        value: lv._id,
                                    })) || []
                                }
                                value={
                                    typeof formData.level === "object" && formData.level !== null
                                        ? (formData.level as any)._id
                                        : (formData.level as string) || ""
                                }
                                onChange={(e) => {
                                    setField("level", e.target.value);
                                    if (e.target.value) pushError("level", undefined);
                                }}
                                error={errors.level}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Original Price"
                                placeholder="Enter price"
                                type="number"
                                required
                                value={formData.price?.toString() || ""}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setField("price", Number.isFinite(v) ? v : 0);
                                    if (Number.isFinite(v) && v >= 0) pushError("price", undefined);
                                }}
                                error={errors.price}
                            />

                            <FormInput
                                label="Sale Price"
                                placeholder="Enter sale price"
                                type="number"
                                value={formData.estimatedPrice?.toString() || ""}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setField("estimatedPrice", Number.isFinite(v) ? v : 0);
                                }}
                            />
                        </div>

                        <FormInput
                            label="Duration (minutes)"
                            placeholder="e.g. 120"
                            type="number"
                            required
                            value={formData.duration?.toString() || ""}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                setField("duration", Number.isFinite(v) ? v : 0);
                                if (Number.isFinite(v) && v > 0) pushError("duration", undefined);
                            }}
                            error={errors.duration}
                        />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        {/* Topics */}
                        <div>
                            <div className="flex items-end justify-between mb-2">
                                <label className="text-sm font-bold text-gray-900">
                                    Topics <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-blue-600">{topicArray.length}/3 topics</p>
                            </div>
                            <FormSelect
                                placeholder={topicArray.length >= 3 ? "Reached limit" : "Select topic"}
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
                                    if (!val) return;
                                    if (!canAddTopic(val)) {
                                        pushError(
                                            "tags",
                                            topicArray.length >= 3
                                                ? "Maximum 3 topics allowed"
                                                : "Topic already added"
                                        );
                                        return;
                                    }
                                    addTopic(val);
                                }}
                                disabled={topicArray.length >= 3}
                                error={errors.tags}
                            />

                            <TagList
                                tags={topicArray}
                                onRemoveTag={(index) => removeTopic(index)}
                                className="mt-2"
                            />

                            {/* Nếu muốn hiển thị lỗi ngay dưới danh sách tag */}
                            {errors.tags && <p className="text-sm text-red-500 mt-2">{errors.tags}</p>}
                        </div>

                        <TextArea
                            label="Description"
                            required
                            placeholder="Course description"
                            value={formData.description || ""}
                            onChange={(v) => {
                                setFormData((prev) => ({ ...prev, description: v })); // chỉ commit khi blur (mặc định)
                            }}
                            error={errors.description}
                        />

                        <TextArea
                            label="Overview"
                            placeholder="Course overview (optional)"
                            value={formData.overview || ""}
                            onChange={(v) => setFormData((prev) => ({ ...prev, overview: v }))}
                        />

                    </div>

                    {/* Prerequisites */}
                    <div className="md:col-span-2 space-y-6">
                        <header className="flex flex-col gap-3 items-start">
                            <h2 className="text-2xl font-bold text-stone-950 max-sm:text-xl">
                                Course Prerequisites <span className="text-red-500">*</span>
                            </h2>
                            <p className="text-xs text-blue-600">{prereqArray.length}/3 prerequisites</p>
                        </header>

                        <div className="flex flex-col gap-3 w-full">
                            {prereqArray.map((p, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center p-3 h-14 rounded-xl bg-slate-50 w-full"
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
                                        <span className="text-xs leading-4 text-stone-950">{p.title}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        onClick={() => {
                                            const next = prereqArray.filter((_, idx) => idx !== i);
                                            updateArrayField("prerequisites", next);
                                            if (next.length > 0) pushError("prerequisites", undefined);
                                        }}
                                        aria-label="Remove prerequisite"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {errors.prerequisites && (
                            <p className="text-sm text-red-500">{errors.prerequisites}</p>
                        )}

                        {prereqArray.length < 3 && (
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={newPrereq}
                                    onChange={(e) => setNewPrereq(e.target.value)}
                                    placeholder="Enter prerequisite"
                                    className={`flex-1 p-2 text-sm border rounded-lg outline-none
                    ${errors.prerequisites ? "border-red-500 ring-2 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && newPrereq.trim()) {
                                            updateArrayField("prerequisites", [
                                                ...prereqArray,
                                                { title: newPrereq.trim() },
                                            ]);
                                            setNewPrereq("");
                                            pushError("prerequisites", undefined);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const v = newPrereq.trim();
                                        if (!v) return;
                                        updateArrayField("prerequisites", [...prereqArray, { title: v }]);
                                        setNewPrereq("");
                                        pushError("prerequisites", undefined);
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

                    {/* Benefits */}
                    <div className="md:col-span-2 space-y-6">
                        <header className="flex flex-col gap-3 items-start">
                            <h2 className="text-2xl font-bold text-stone-950 max-sm:text-xl">
                                Course Benefits <span className="text-red-500">*</span>
                            </h2>
                            <p className="text-xs text-blue-600">{benefitsArray.length}/3 benefits</p>
                        </header>

                        <div className="flex flex-col gap-3 w-full">
                            {benefitsArray.map((b, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center p-3 h-14 rounded-xl bg-slate-50 w-full"
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

                        {errors.benefits && <p className="text-sm text-red-500">{errors.benefits}</p>}

                        {benefitsArray.length < 3 && (
                            <div className="flex gap-2 w-full">
                                <input
                                    type="text"
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    placeholder="Enter benefit"
                                    className={`flex-1 p-2 text-sm border rounded-lg outline-none
                    ${errors.benefits ? "border-red-500 ring-2 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
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
