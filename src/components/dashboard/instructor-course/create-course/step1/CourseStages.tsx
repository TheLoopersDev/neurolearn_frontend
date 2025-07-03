"use client";
import * as React from "react";

interface Stage {
    id: number;
    title: string;
}

export function CourseStages() {
    const [stages, setStages] = React.useState<Stage[]>([
        { id: 1, title: "Model Detailing" },
        { id: 2, title: "Basics of Working in Blender" },
        { id: 3, title: "Learning Lighting Techniques" },
        { id: 4, title: "Creating Animations" }
    ]);

    const handleAddStage = () => {
        const newStage: Stage = {
            id: stages.length + 1,
            title: `New Stage ${stages.length + 1}`
        };
        setStages([...stages, newStage]);
    };

    return (
        <section className="flex w-full items-center p-6 bg-white rounded-3xl">
            <div className="flex flex-col gap-6 items-center">
                <header className="flex flex-col gap-3 items-start self-stretch">
                    <h2 className="self-stretch text-2xl font-bold leading-7 text-stone-950 max-sm:text-xl">
                        The course will have stages
                    </h2>
                    <p className="self-stretch text-xs leading-4 text-right text-blue-600">
                        {stages.length}/5 stages
                    </p>
                </header>

                <div className="flex flex-col gap-3 items-start self-stretch">
                    {stages.map((stage) => (
                        <div
                            key={stage.id}
                            className="flex gap-3 items-center self-stretch p-3 h-14 rounded-xl bg-slate-50"
                        >
                            <div className="flex relative justify-center items-center w-7 h-7">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            "<svg id=\"667:45873\" layer-name=\"Iconly/Regular/Light/Play\" width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"stage-icon\" style=\"width: 28px; height: 28px\"> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M14.0001 3C20.1203 3 25.0834 7.96201 25.0834 14.0833C25.0834 20.2047 20.1203 25.1667 14.0001 25.1667C7.87876 25.1667 2.91675 20.2047 2.91675 14.0833C2.91675 7.96201 7.87876 3 14.0001 3Z\" stroke=\"#6B6B6B\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
                                    }}
                                />
                                <span className="absolute text-xs leading-6 text-neutral-500">
                                    {stage.id}
                                </span>
                            </div>
                            <span className="text-xs leading-4 text-stone-950">
                                {stage.title}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAddStage}
                    className="flex justify-center items-center p-3 w-14 h-14 cursor-pointer bg-slate-50 rounded-[40px] hover:bg-slate-100 transition-colors"
                    aria-label="Add new stage"
                    disabled={stages.length >= 5}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html:
                                "<svg id=\"I667:45907;917:15035\" layer-name=\"vuesax/outline/add\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"add-icon\" style=\"width: 24px; height: 24px\"> <path d=\"M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z\" fill=\"#3858F8\"></path> <path d=\"M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z\" fill=\"#3858F8\"></path> </svg>",
                        }}
                    />
                </button>
            </div>
        </section>
    );
}
