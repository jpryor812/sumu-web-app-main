'use client'

import { useState } from 'react';
import Image from 'next/image';

interface PostImageUploaderProps {
  label: string;
  description: string;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  setError: (error: string | null) => void;
}

export default function PostImageUploader({
  label,
  description,
  file,
  handleFileChange,
  setError
}: PostImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    handleFileChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-white text-lg font-medium mb-2">
        {label}
      </label>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="w-[300px] aspect-[4/3] relative bg-gray-700 rounded-lg overflow-hidden">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-xs text-gray-400">Click to upload or drag and drop</p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
} 