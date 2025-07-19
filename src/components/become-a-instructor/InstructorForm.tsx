'use client'

import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

export default function InstructorForm() {
    const [logo, setLogo] = useState<File | null>(null)
    const [docImages, setDocImages] = useState<File[]>([]);
    const [agree, setAgree] = useState(false)

    return (
        <div className="max-w-full mx-auto  p-10 text-sm">
            <h2 className="text-2xl font-semibold text-black">Instructor Application Form</h2>
            <p className="text-gray-500 py-4">Complete the information below to submit your instructor profile.</p>
            {/* Instructor Info */}
            <div className='text-black'>
                <div className="rounded-2xl shadow bg-white space-y-4 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Title bên trái */}
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-bold">Your Detail</h3>
                        </div>
                        {/* Form bên phải */}
                        <div className="md:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                {/* Full Name */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="fullName" className="font-medium">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                    />
                                </div>
                                {/* Phone Number*/}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                    />
                                </div>
                                {/* Email Address*/}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="email" className="font-medium">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                    />
                                </div>
                                {/* Day of Birth*/}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="dob" className="font-medium">Day of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                    />
                                </div>
                                {/* Address */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="address" className="font-medium">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="Enter your address"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                    />
                                </div>
                                {/* Category */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="category" className="font-medium">Category</label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            className="w-full appearance-none px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 pr-10"
                                            defaultValue=""
                                        >
                                            <option value="" disabled hidden>Select</option>
                                            <option value="education">Education</option>
                                            <option value="it">Information Technology</option>
                                            <option value="finance">Finance</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="design">Design</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                {/* Description */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="desc" className="font-medium">Description</label>
                                    <textarea
                                        id="desc"
                                        rows={4}
                                        placeholder="About you"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Experience */}
                <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Tiêu đề bên trái */}
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-bold">Your Detail</h3>
                        </div>
                        {/* Form bên phải */}
                        <div className="md:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                {/* Years of Experience */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="experience" className="font-medium">Years of Experience</label>
                                    <input
                                        id="experience"
                                        type="text"
                                        placeholder="E.g. 5"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                    />
                                </div>
                                {/* Previous Roles */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="role" className="font-medium">Previous Roles</label>
                                    <div className="relative">
                                        <select
                                            id="role"
                                            className="w-full appearance-none px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 pr-10"
                                            defaultValue=""
                                        >
                                            <option value="" disabled hidden>e.g. Instructor, Teaching Assistant, Curriculum Developer</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="ta">Teaching Assistant</option>
                                            <option value="cd">Curriculum Developer</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                {/* Institutions / Companies */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="company" className="font-medium">Institutions / Companies</label>
                                    <textarea
                                        id="company"
                                        rows={4}
                                        placeholder="e.g. FPT, Coursera, FUNiX"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upload Certificates */}
                <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
                    <h3 className="text-lg font-bold">Upload Certificate Images</h3>
                    <div className="mt-2 border border-dashed rounded-lg p-6 text-center text-gray-400">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="docUpload"
                            onChange={(e) => {
                                const newFiles = Array.from(e.target.files || []);
                                setDocImages((prev) => [...prev, ...newFiles]);
                            }}
                        />
                        <label htmlFor="docUpload" className="cursor-pointer block">
                            Drag and drop or <span className="text-indigo-600 underline">Choose Files</span> (10MB each)
                        </label>
                    </div>
                    {/* Preview images */}
                    {docImages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {docImages.map((file, index) => (
                                <div key={index} className="relative group flex flex-col items-center space-y-2">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-full rounded-lg border object-cover h-40"
                                    />
                                    {/* Nút remove */}
                                    <button
                                        onClick={() =>
                                            setDocImages((prev) => prev.filter((_, i) => i !== index))
                                        }
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        title="Remove"
                                    >
                                        &times;
                                    </button>
                                    <p className="text-sm text-gray-500 text-center truncate w-full px-2">
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Agreement */}
                <div className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" id="agree" checked={agree} onChange={() => setAgree(!agree)} />
                    <label htmlFor="agree" className="text-sm">
                        I have read and agree to the <span className="text-indigo-600 underline">Terms and Privacy Policy</span>.
                    </label>
                </div>
                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button type="button" className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                        disabled={!agree}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
