import { ChangeEvent, useState, useEffect } from 'react';

interface BioSectionProps {
  bio: string;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function BioSection({ bio, handleChange }: BioSectionProps) {
  const [showCounter, setShowCounter] = useState(false);
  const maxLength = 500;
  
  // Show counter when bio has content
  useEffect(() => {
    setShowCounter(bio.length > 0);
  }, [bio]);
  
  // Custom handler to enforce character limit
  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      handleChange(e);
    }
  };
  
  // Calculate remaining characters
  const remainingChars = maxLength - bio.length;
  
  // Determine counter color based on remaining characters
  const getCounterColor = () => {
    if (remainingChars <= 50) return 'text-red-500';
    if (remainingChars <= 100) return 'text-yellow-500';
    return 'text-gray-400';
  };
  
  return (
    <div className="mb-8">
      <label className="block text-white text-lg font-medium mb-2">
        Bio
      </label>
      <div className="relative">
        <textarea
          name="bio"
          value={bio}
          onChange={handleBioChange}
          placeholder="Tell your audience about yourself and your content... (Max 500 characters)"
          maxLength={maxLength}
          className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showCounter && (
          <div className={`absolute bottom-2 right-2 text-sm ${getCounterColor()}`}>
            {remainingChars} characters remaining
          </div>
        )}
      </div>
    </div>
  );
} 