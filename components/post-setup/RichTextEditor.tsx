'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CKEditor with SSR disabled
const CKEditorComponent = dynamic(
  () => import('./CKEditorWrapper'),
  { ssr: false }
);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <CKEditorComponent content={content} onChange={onChange} />
    </div>
  );
}