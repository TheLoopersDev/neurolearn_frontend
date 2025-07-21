'use client'

import Image from 'next/image';
import React, { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast';

export default function BusinessForm() {
    const [logo, setLogo] = useState<File | null>(null);
    const [docImages, setDocImages] = useState<File[]>([]);
    const [agree, setAgree] = useState(false)
    const [loading, setLoading] = useState(false);
    // refs cho input
    const companyNameRef = useRef<HTMLInputElement>(null);
    const taxCodeRef = useRef<HTMLInputElement>(null);
    const companyEmailRef = useRef<HTMLInputElement>(null);
    const companyAddressRef = useRef<HTMLInputElement>(null);
    const businessSectorRef = useRef<HTMLInputElement>(null);
    const companyDescRef = useRef<HTMLTextAreaElement>(null);
    const repNameRef = useRef<HTMLInputElement>(null);
    const repPhoneRef = useRef<HTMLInputElement>(null);
    const repEmailRef = useRef<HTMLInputElement>(null);
    const repAddressRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    // Validate các trường bắt buộc
    const validate = () => {
        if (!companyNameRef.current?.value ||
            !taxCodeRef.current?.value ||
            !companyEmailRef.current?.value ||
            !companyAddressRef.current?.value ||
            !businessSectorRef.current?.value ||
            !companyDescRef.current?.value ||
            !repNameRef.current?.value ||
            !repPhoneRef.current?.value ||
            !repEmailRef.current?.value ||
            !repAddressRef.current?.value ||
            !logo ||
            docImages.length === 0
        ) {
            toast({
                title: 'Missing information',
                description: 'Please fill in all required fields and upload logo, documents.',
                variant: 'destructive'
            });
            return false;
        }
        if (!agree) {
            toast({
                title: 'Not agreed to terms',
                description: 'You need to agree to the terms before submitting.',
                variant: 'destructive'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('businessName', companyNameRef.current?.value || '');
            formData.append('taxCode', taxCodeRef.current?.value || '');
            formData.append('email', companyEmailRef.current?.value || '');
            formData.append('address', companyAddressRef.current?.value || '');
            formData.append('businessSector', businessSectorRef.current?.value || '');
            formData.append('description', companyDescRef.current?.value || '');
            formData.append('representativeName', repNameRef.current?.value || '');
            formData.append('representativePhone', repPhoneRef.current?.value || '');
            formData.append('representativeEmail', repEmailRef.current?.value || '');
            formData.append('representativeAddress', repAddressRef.current?.value || '');
            if (logo) formData.append('logo', logo);
            docImages.forEach((file) => formData.append('docImages', file));

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/request/create-request-business`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Business registration successful!',
                    variant: 'success',
                });
            } else {
                const data = await res.json();
                toast({
                    title: 'Error',
                    description: data.message || 'Registration failed!',
                    variant: 'destructive',
                });
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'An error occurred!',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-full mx-auto  p-10 text-sm">
            <h2 className="text-2xl font-semibold text-black">Company Registration Form</h2>
            <p className="text-gray-500 py-4">Please provide your company details for verification and approval.</p>
            {/* Instructor Info */}
            <form className='text-black' onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="rounded-2xl shadow bg-white space-y-4 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Title bên trái */}
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-bold">Your Company</h3>
                        </div>
                        {/* Form bên phải */}
                        <div className="md:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                {/* Company Name */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="companyName" className="font-medium">Company Name</label>
                                    <input
                                        id="companyName"
                                        type="text"
                                        placeholder="Official company name"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={companyNameRef}
                                    />
                                </div>
                                {/* Tax*/}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="taxCode" className="font-medium">Tax code</label>
                                    <input
                                        id="taxCode"
                                        type="text"
                                        placeholder="Company tax ID"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={taxCodeRef}
                                    />
                                </div>
                                {/* Email Address*/}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="companyEmail" className="font-medium">Email Address</label>
                                    <input
                                        id="companyEmail"
                                        type="email"
                                        placeholder="Business email"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={companyEmailRef}
                                    />
                                </div>
                                {/* Address */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="companyAddress" className="font-medium">Business Address</label>
                                    <input
                                        id="companyAddress"
                                        type="text"
                                        placeholder="Business address"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                        ref={companyAddressRef}
                                    />
                                </div>
                                {/* Business Sector */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="businessSector" className="font-medium">Business Sector</label>
                                    <input
                                        id="businessSector"
                                        type="text"
                                        placeholder="(E.g., Education, Information Technology, Marketing, Design, Finance, etc.)"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                        ref={businessSectorRef}
                                    />
                                </div>
                                {/* Description */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="companyDesc" className="font-medium">Description</label>
                                    <textarea
                                        id="companyDesc"
                                        rows={4}
                                        placeholder="About you"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                        ref={companyDescRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upload Logo */}
                <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Tiêu đề bên trái */}
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-bold">Upload Company Logo</h3>
                        </div>
                        {/* Form bên phải */}
                        <div className="md:col-span-4 flex justify-center">
                            {!logo ? (
                                <div className="w-[200px] h-[200px] border border-dashed rounded-lg flex items-center justify-center text-center text-gray-400 relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="logoUpload"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setLogo(file);
                                        }}
                                    />
                                    <label htmlFor="logoUpload" className="cursor-pointer block">
                                        Drag and drop or <span className="text-indigo-600 underline">Choose File</span>
                                    </label>
                                </div>
                            ) : (
                                    <div className="relative group">
                                        <Image
                                        src={URL.createObjectURL(logo)}
                                        alt="Company Logo"
                                            className="object-cover border rounded-lg"
                                            width={150}
                                            height={150}
                                    />
                                    <button
                                        onClick={() => setLogo(null)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        title="Remove"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Representative Information */}
                <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
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
                                    <label htmlFor="repName" className="font-medium">Full Name</label>
                                    <input
                                        id="repName"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={repNameRef}
                                    />
                                </div>
                                {/* Phone Number*/}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="repPhone" className="font-medium">Phone Number</label>
                                    <input
                                        id="repPhone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={repPhoneRef}
                                    />
                                </div>
                                {/* Email Address*/}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="repEmail" className="font-medium">Email Address</label>
                                    <input
                                        id="repEmail"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0"
                                        ref={repEmailRef}
                                    />
                                </div>
                                {/* Address */}
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="repAddress" className="font-medium">Address</label>
                                    <input
                                        id="repAddress"
                                        type="text"
                                        placeholder="Enter your address"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700"
                                        ref={repAddressRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upload file */}
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
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        width={200}
                                        height={40}
                                        className="rounded-lg border object-cover"
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
                        disabled={!agree || loading}
                    >
                        {loading ? 'Đang gửi...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    )
}
