'use client'

import { ChangeEvent, useState } from 'react';
import { Upload } from 'lucide-react';

interface VideoUploaderProps {
  label: string;
  description: string;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  setError: (error: string | null) => void;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_DURATION = 30; // seconds

export default function VideoUploader({
  label,
  description,
  file,
  handleFileChange,
  setError
}: VideoUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoOrientation, setVideoOrientation] = useState(0);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve(video.duration);
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const detectOrientation = (file: File) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.videoWidth < video.videoHeight) {
          setVideoOrientation(180);
        } else {
          setVideoOrientation(0);
        }
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const validateAndHandleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check file size
      if (file.size > MAX_VIDEO_SIZE) {
        setError('Video must be under 50MB');
        return;
      }

      // Check duration
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION) {
        setError('Video must be under 30 seconds');
        return;
      }

      await detectOrientation(file);

      handleFileChange(file);
    } catch (err) {
      setError('Error processing video');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white text-lg mb-2">{label}</label>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="relative border-2 border-dashed border-gray-600 rounded-full aspect-square w-48">
        <input
          type="file"
          onChange={validateAndHandleFile}
          accept="video/mp4,video/quicktime"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isLoading}
        />
        
        {file ? (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <video
              src={URL.createObjectURL(file)}
              className="w-full h-full object-cover"
              controls
              playsInline
              style={{ 
                transform: `rotate(${videoOrientation}deg)`,
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm text-center px-4">
                  Upload video (max 30s)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 