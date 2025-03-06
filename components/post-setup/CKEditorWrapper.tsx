'use client'

import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
}

export default function CKEditorWrapper({ content, onChange }: CKEditorWrapperProps) {
  const [editorData, setEditorData] = useState(content);
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
    
    // Add custom styling for CKEditor
    const style = document.createElement('style');
    style.innerHTML = `
      .ck-editor__editable {
        min-height: 300px !important;
        color: white !important;
        background-color: #1f2937 !important;
      }
      .ck.ck-editor__main>.ck-editor__editable {
        border-color: #374151 !important;
      }
      .ck.ck-toolbar {
        background-color: #111827 !important;
        border-color: #374151 !important;
      }
      .ck.ck-button {
        color: #d1d5db !important;
        background-color: #111827 !important;
      }
      .ck.ck-button.ck-on {
        background-color: #374151 !important;
        color: white !important;
      }
      .ck.ck-button:hover:not(.ck-disabled) {
        background-color: #374151 !important;
      }
      .ck.ck-icon :not([fill]) {
        fill: currentColor !important;
      }
      .ck-dropdown__panel {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }
      .ck-list__item {
        color: #d1d5db !important;
      }
      .ck-list__item:hover:not(.ck-disabled) {
        background-color: #374151 !important;
      }
      .ck-list__item_active {
        background-color: #374151 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data);
  };

  return editorLoaded ? (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      onChange={handleEditorChange}
      config={{
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'link',
          'imageUpload',
          '|',
          'undo',
          'redo'
        ],
        placeholder: 'Write your post...',
      }}
    />
  ) : (
    <div className="p-4 min-h-[300px] bg-gray-800 text-gray-400">Loading editor...</div>
  );
} 