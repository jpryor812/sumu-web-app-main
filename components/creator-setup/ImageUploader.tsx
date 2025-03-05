'use client'

import { ChangeEvent, useState, useMemo } from 'react';
import { Upload, Play, X } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  description: string;
  fileType: 'bannerImage' | 'profileMedia';
  file: File | null;
  handleFileChange: (file: File | null, isVideo: boolean) => void;
  setError: (error: string | null) => void;
  isVideo?: boolean;
  setVideoOrientation?: (orientation: number) => void;
  videoOrientation?: number;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_DURATION = 30; // seconds

export default function ImageUploader({
  label,
  description,
  fileType,
  file,
  handleFileChange,
  setError,
  isVideo = false,
  setVideoOrientation,
  videoOrientation = 0
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localVideoOrientation, setLocalVideoOrientation] = useState(videoOrientation);
  const [isPlaying, setIsPlaying] = useState(false);
  const isProfile = fileType === 'profileMedia';

  const mediaUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        video.currentTime = 0;
        resolve(video.duration);
      };
      
      video.onerror = () => reject(new Error('Video load error'));
      video.src = URL.createObjectURL(file);
    });
  };

  const detectOrientation = (file: File) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const orientation = video.videoWidth < video.videoHeight ? 180 : 0;
        setLocalVideoOrientation(orientation);
        setVideoOrientation?.(orientation);
        resolve(orientation);
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
      const isVideoFile = file.type.startsWith('video/');

      if (isVideoFile) {
        // Video validation
        if (file.size > MAX_VIDEO_SIZE) {
          setError('Video must be under 50MB');
          return;
        }

        try {
          const duration = await Promise.race([
            getVideoDuration(file),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Video load timeout')), 5000)
            )
          ]) as number;

          if (duration > MAX_VIDEO_DURATION) {
            setError('Video must be under 30 seconds');
            return;
          }

          await Promise.race([
            detectOrientation(file),
            new Promise((resolve) => setTimeout(resolve, 5000))
          ]);
        } catch (videoError) {
          console.error('Video processing error:', videoError);
          setError('Error processing video. Please try a different file.');
          return;
        }
      }

      handleFileChange(file, isVideoFile);
    } catch (err) {
      console.error('File processing error:', err);
      setError('Error processing file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`mb-6 ${isProfile ? 'max-w-[192px] mx-auto' : 'w-full'}`}>
      <div className="text-center">
        <label className="block text-white text-lg mb-2">{label}</label>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
      </div>
      
      <div className="relative">
        <div className={`relative border-2 border-dashed border-gray-600 rounded-lg 
          ${isProfile ? 'aspect-square w-48 rounded-full' : 'aspect-[3/1] w-full'}`}
        >
          {!file && (
            <input
              type="file"
              onChange={validateAndHandleFile}
              accept={isProfile ? "image/*,video/*" : "image/*"}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isLoading}
            />
          )}
          
          {file && mediaUrl ? (
            <div className={`absolute inset-0 ${isProfile ? 'rounded-full' : ''} overflow-hidden`}>
              {isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    style={{ 
                      transform: `rotate(${localVideoOrientation}deg)`,
                      objectFit: 'cover'
                    }}
                    ref={(videoEl) => {
                      if (videoEl) {
                        if (isPlaying) {
                          videoEl.play();
                        } else {
                          videoEl.pause();
                        }
                      }
                    }}
                    onEnded={() => setIsPlaying(false)}
                  />
                  {!isPlaying && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPlaying(true);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-20 rounded-full"
                    >
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  )}
                </div>
              ) : (
                <img
                  src={mediaUrl}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className={`absolute inset-0 flex flex-col items-center justify-center 
              ${isProfile ? 'rounded-full' : ''}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm text-center px-4">
                    {isProfile ? 'Upload image or video (max 30s)' : 'Click to upload'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {file && (
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                handleFileChange(null, false);
              }}
              className="flex items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </button>
            
            <input
              type="file"
              id="newUpload"
              onChange={validateAndHandleFile}
              accept={isProfile ? "image/*,video/*" : "image/*"}
              className="hidden"
              disabled={isLoading}
            />
            <label
              htmlFor="newUpload"
              className="cursor-pointer flex items-center py-2 px-3 text-gray-400 hover:text-white transition-colors"
            >
              <Upload className="w-4 h-4 mr-1" />
              Replace
            </label>
          </div>
        )}
      </div>
    </div>
  );
} 