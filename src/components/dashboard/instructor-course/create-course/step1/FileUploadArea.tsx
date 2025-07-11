"use client";
import * as React from "react";

interface FileUploadAreaProps {
    thumbnail: string | { url: string } | null;
    setThumbnail: (value: string | { public_id: string; url: string }) => void;
}

export function FileUploadArea({ thumbnail, setThumbnail }: FileUploadAreaProps) {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (typeof thumbnail === "string") {
            setImagePreview(thumbnail);
        } else if (thumbnail && typeof thumbnail === "object" && "url" in thumbnail) {
            setImagePreview(thumbnail.url);
        } else {
            setImagePreview(null);
        }
    }, [thumbnail]);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processImage(file);
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processImage(e.target.files[0]);
        }
    };

    const processImage = (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        const reader = new FileReader();
        reader.onloadend = async () => {
            if (typeof reader.result === "string") {
                // 👉 Upload lên Cloudinary giả lập
                // Replace đoạn này bằng thực tế nếu có upload server
                const mockUploaded = {
                    public_id: `courses/${file.name.split(".")[0]}`,
                    url: reader.result, // Giả lập: gán base64 thành url
                };

                setThumbnail(mockUploaded); // ✅ Gửi object thay vì string
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <section className="flex items-center p-6 bg-white rounded-3xl w-full">
            <div
                className={`flex flex-col justify-center items-center rounded-xl border-2 border-blue-600 border-dashed w-full h-64 ${isDragOver ? "bg-blue-50" : ""
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />

                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Thumbnail Preview"
                        onClick={handleFileSelect}
                        className="w-full max-h-60 object-contain rounded-xl cursor-pointer hover:opacity-80"
                    />
                ) : (
                    <div className="flex flex-col gap-4 items-center">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `<svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="..."/></svg>`,
                            }}
                        />
                        <p className="text-xl leading-5 text-center text-neutral-500 max-sm:text-base">
                            <span>Drag and drop or</span>
                            <br />
                            <button
                                type="button"
                                onClick={handleFileSelect}
                                className="font-bold text-blue-600 hover:underline"
                            >
                                Choose File
                            </button>
                            <span> to upload (10MB)</span>
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
