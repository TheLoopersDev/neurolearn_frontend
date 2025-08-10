import React from 'react';
import Image from 'next/image';
import courseImage from '@/public/assets/images/default-course.png'; // Đây là một đối tượng StaticImageData

interface CourseInformationSectionProps {
    course: {
        title: string;
        category: string;
        skillLevel: string;
        tags: string[];
        originalPrice: number;
        salePrice?: number;
        description: string;
        thumbnail: string; // Vẫn giữ loại string nếu bạn muốn linh hoạt truyền URL từ props
    };
}

const CourseInformationSection: React.FC<CourseInformationSectionProps> = ({ course }) => {    
    return (
        <section className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Course Information</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-600">Title</label>
                        <p className="text-lg font-medium text-gray-900">{course.title}</p>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">
                                Coursera Category
                            </label>
                            <p className="text-lg font-medium text-gray-900">{course.category}</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Skill level</label>
                            <p className="text-lg font-medium text-gray-900">{course.skillLevel}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-600">Add Tag</label>
                        <div className="flex flex-wrap gap-2">
                            {course.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Original Price</label>
                            <p className="text-lg font-medium text-gray-900">
                                ${course.originalPrice.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Sale Price</label>
                            <p className="text-lg font-medium text-gray-900">
                                {course.salePrice ? `$${course.salePrice.toFixed(2)}` : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                        <p className="text-lg leading-relaxed text-gray-900">{course.description}</p>
                    </div>
                </div>

                {/* Thumbnail Display */}
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <Image
                        src={course.thumbnail || courseImage.src}
                        alt="Course Thumbnail"
                        width={400}
                        height={256}
                        className="h-auto max-h-64 w-full rounded-md object-cover"
                        unoptimized={typeof course.thumbnail === 'string' && course.thumbnail.startsWith('http')}
                    />
                    <p className="mt-4 text-center text-sm text-gray-500">Course Thumbnail</p>
                </div>
            </div>
        </section>
    );
};

export default CourseInformationSection;