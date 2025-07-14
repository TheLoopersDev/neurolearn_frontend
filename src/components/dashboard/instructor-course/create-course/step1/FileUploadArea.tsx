'use client';
import Image from 'next/image';
import * as React from 'react';

interface FileUploadAreaProps {
  thumbnail: string | { url: string } | null;
  setThumbnail: (value: string | { public_id: string; url: string }) => void;
}

export function FileUploadArea({ thumbnail, setThumbnail }: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof thumbnail === 'string') {
      setImagePreview(thumbnail);
    } else if (thumbnail && typeof thumbnail === 'object' && 'url' in thumbnail) {
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
      if (typeof reader.result === 'string') {
        const mockUploaded = {
          public_id: `courses/${file.name.split('.')[0]}`,
          url: reader.result,
        };
        setThumbnail(mockUploaded);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="flex items-center p-6 bg-white rounded-3xl w-full">
      {/* ✅ SỬA LỖI 1: Chuyển div thành button và reset style */}
      <button
        type="button"
        className={`flex flex-col justify-center items-center rounded-xl border-2 border-blue-600 border-dashed w-full h-64 cursor-pointer text-left p-0 ${
          isDragOver ? 'bg-blue-50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        aria-label="Upload file area"
      >
        {/* ✅ SỬA LỖI 2: Thêm tabIndex={-1} vào input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        {imagePreview ? (
          <div className="w-full h-full p-2 pointer-events-none">
            <Image
              src={imagePreview}
              alt="Thumbnail Preview"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center text-center pointer-events-none">
            <svg
              width="57"
              height="56"
              viewBox="0 0 57 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="..." />
            </svg>
            <p className="text-xl leading-5 text-neutral-500 max-sm:text-base">
              Drag and drop or <span className="font-bold text-blue-600">Choose File</span> to
              upload (10MB)
            </p>
          </div>
        )}
      </button>
    </section>
  );
}
