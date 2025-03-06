'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export default function SocialLinks({ links, onChange }: SocialLinksProps) {
  const MAX_LINKS = 5;

  const addLink = () => {
    if (links.length >= MAX_LINKS) return;
    onChange([...links, { platform: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  return (
    <div className="mb-8">
      <label className="block text-white text-lg font-medium mb-2">
        Social Links
      </label>
      <p className="text-gray-400 text-sm mb-4">
        Add up to 5 social media links to display on your page
      </p>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                placeholder="Platform (e.g., Twitter, Instagram)"
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-[2]">
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="URL"
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="text-gray-400 hover:text-white p-2"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {links.length < MAX_LINKS && (
        <button
          type="button"
          onClick={addLink}
          className="mt-4 text-blue-500 hover:text-blue-400 font-medium"
        >
          + Add Social Link
        </button>
      )}
    </div>
  );
} 