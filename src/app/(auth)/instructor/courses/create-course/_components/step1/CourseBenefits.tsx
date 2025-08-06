"use client";
import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

interface Benefit {
    id: string;
    title: string;
}

interface CourseBenefitsProps {
    benefits: Benefit[];
    onAdd: (title: string) => void;
    onRemove: (id: string) => void;
}

export function CourseBenefits({
    benefits = [],
    onAdd,
    onRemove,
}: CourseBenefitsProps) {
    const [newBenefit, setNewBenefit] = React.useState("");

    const handleAddBenefit = () => {
        if (newBenefit.trim() && benefits.length < 3) {
            onAdd(newBenefit);
            setNewBenefit("");
        }
    };

    return (
        <section className="flex w-full items-center p-6 bg-white rounded-3xl">
            <div className="flex flex-col gap-6 items-center w-full">
                <header className="flex flex-col gap-3 items-start self-stretch">
                    <h2 className="self-stretch text-2xl font-bold leading-7 text-stone-950 max-sm:text-xl">
                        Course Benefits
                    </h2>
                    <p className="self-stretch text-xs leading-4 text-right text-blue-600">
                        {benefits.length}/3 benefits
                    </p>
                </header>

                <div className="flex flex-col gap-3 items-start self-stretch w-full">
                    {benefits.map((benefit, index) => (
                        <div
                            key={benefit.id}
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
                                        {index + 1}
                                    </span>
                                </div>
                                <span className="text-xs leading-4 text-stone-950">
                                    {benefit.title}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(benefit.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                aria-label="Remove benefit"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Ẩn hoàn toàn khi đủ 3 benefit */}
                {benefits.length < 3 && (
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
        </section>
    );
}
