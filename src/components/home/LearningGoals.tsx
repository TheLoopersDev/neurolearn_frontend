"use client";
import * as React from "react";
import { FeatureCard } from "./FeatureCard";
import { LargeFeatureCard } from "./LargeFeatureCard";
import Arrow from "@/public/assets/home/Arrow.svg"
import Image from "next/image";

export const LearningGoals: React.FC = () => {
    return (
        <section className="max-w-[1280px] mx-auto px-4 py-16">
            <h1 className="text-2xl md:text-4xl text-black mb-10">
                Learning focused on your goals
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Section (3 cards) */}
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard
                            title="Hands-on training"
                            description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
                            backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/3402c401efdda10ffe811e5a216d36b06c3bcbd4"
                            
                        />
                        <FeatureCard
                            title="Certification prep"
                            description="Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way"
                            backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/7a37112d5b974ed242a4a9f82cb69cf3fc62ef9b"
                           
                        />
                    </div>

                    <LargeFeatureCard
                        title="Insights and analytics"
                        description="Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning."
                        backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/05dedfe8069adb9b6dcfa503abd602a36bc79894"
                
                    />
                </div>

                {/* Right Chart/Image */} 
                <div className="w-full h-full relative">
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0222e8011284b06733ebdc9a94474eda226417ef"
                        alt="Learning score chart"
                        className="w-full h-full object-contain rounded-3xl"
                    />
                    <Image
                        src={Arrow}
                        alt="Arrow"
                        className="top-0 right-0 z-100 absolute transition-transform group-hover:rotate-12"
                        width={60}
                        height={60}
                    />
                </div>
            </div>
        </section>
    );
};

export default LearningGoals;
