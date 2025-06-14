"use client";
import * as React from "react";
import Arrow from "@/public/assets/home/Arrow.svg"
import Image from "next/image";
interface FeatureCardProps {
    title: string;
    description: string;
    backgroundImage: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    backgroundImage,
    className = ""
}) => {
    return (
        <div className={`grow shrink self-stretch my-auto min-w-60 w-[249px] ${className}`}>
            <div className="flex overflow-hidden relative flex-col items-start py-5 pr-6 pl-3 w-full aspect-[1.21] fill-white max-md:pr-5">
                <img
                    src={backgroundImage}
                    alt=""
                    className="object-cover absolute inset-0 size-full"
                />
                <h2 className="relative text-xl font-medium text-black">
                    {title}
                </h2>
                <p className="relative mt-4 text-xs leading-4 text-neutral-500">
                    {description}
                </p>
                    <Image
                        src={Arrow}
                        alt="Arrow"
                        className="right-1 top-0 absolute transition-transform group-hover:rotate-12"
                        width={40}
                        height={40}
                    />
            </div>
        </div>
    );
};
