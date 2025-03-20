'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ImagesPlugin from './plugins/ImagesPlugin';
import ImageSelectionPlugin from './plugins/ImageSelectionPlugin';
import ToolbarPlugin from './ToolbarPlugin';
import { VideoNode } from './nodes/VideoNode';
import VideoPlugin from './plugins/VideoPlugin';
import { ImageNode } from './nodes/ImageNode';
import { PollNode } from './nodes/PollNode';
import PollPlugin from './plugins/PollPlugin';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

import './editor.css';
import React, { useState, useEffect } from 'react';

// Function to safely extract HTML content from various formats
export const extractHtmlContent = (content: any): string => {
  if (!content) return '';
  
  // If it's a string, check if it's JSON
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        // Handle {"html": "..."} format
        if (typeof parsed.html === 'string') {
          return parsed.html;
        }
        
        // Handle nested {"html": {"html": "..."}} format
        if (parsed.html && typeof parsed.html === 'object' && typeof parsed.html.html === 'string') {
          return parsed.html.html;
        }
      }
      
      // If JSON parsing succeeded but didn't extract HTML, return empty string
      return '';
    } catch (e) {
      // If it's not parseable JSON, assume it's direct HTML
      return content;
    }
  }
  
  // If it's an object, try to extract html property
  if (typeof content === 'object' && content !== null) {
    // Handle {html: "..."} format
    if (typeof content.html === 'string') {
      return content.html;
    }
    
    // Handle nested {html: {html: "..."}} format
    if (content.html && typeof content.html === 'object' && typeof content.html.html === 'string') {
      return content.html.html;
    }
  }
  
  return '';
};

// Update the component signature to accept props
interface RichTextEditorProps {
  content: any; // Accept any format
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  // State to track if editor has been initialized with content
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Extract the HTML content
  const htmlContent = extractHtmlContent(content);
  
  // Debug the content we're receiving
  useEffect(() => {
    console.log('RichTextEditor received content:', {
      contentType: typeof content,
      contentPreview: typeof content === 'string' ? content.substring(0, 100) + '...' : 'non-string',
      htmlContentExtracted: htmlContent.substring(0, 100) + '...',
    });
  }, [content, htmlContent]);

  // Function to handle editor changes
  const handleEditorChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      try {
        // Generate HTML from editor content using the editor instance
        const html = $generateHtmlFromNodes(editor);
        
        // Create a consistent JSON structure for storage
        const contentObject = {
          html: html
        };
        
        // Pass the serialized content to the parent component
        onChange(JSON.stringify(contentObject));
        
        // Debug
        console.log('Editor content updated:', {
          htmlLength: html.length,
          htmlPreview: html.substring(0, 100) + '...',
        });
      } catch (error) {
        console.error('Error serializing editor content:', error);
      }
    });
  };

  // This function prepares the initial editor state
  const prepopulatedContent = (editor: any) => {
    try {
      // Mark as initialized so we don't re-initialize
      setIsInitialized(true);
      
      // If we have HTML content to initialize with
      if (htmlContent) {
        // Parse the HTML content and update the editor
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlContent, 'text/html');
        
        // Access editor internals to properly import HTML
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          
          try {
            // Try to import the DOM nodes
            const nodes = $generateNodesFromDOM(editor, dom);
            nodes.forEach(node => root.append(node));
          } catch (importError) {
            console.error('Error importing HTML into editor:', importError);
            // If import fails, at least create an empty paragraph
            const paragraph = editor._createParagraphNode();
            root.append(paragraph);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing editor content:', error);
    }
  };

  const initialConfig = {
    namespace: 'BlogEditor',
    theme: {
      root: 'editor-root',
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
      },
      heading: {
        h1: 'editor-h1',
        h2: 'editor-h2',
        h3: 'editor-h3',
      },
      list: {
        ul: 'editor-list-ul',
        ol: 'editor-list-ol',
      },
      link: 'editor-link',
    },
    onError: (error: any) => console.error('Lexical editor error:', error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
      AutoLinkNode,
      ImageNode,
      VideoNode,
      PollNode,
    ],
    editorState: isInitialized ? undefined : prepopulatedContent,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin validateUrl={(url) => true} />
          <ClickableLinkPlugin />
          <TablePlugin />
          <ImagesPlugin />
          <ImageSelectionPlugin />
          <VideoPlugin />
          <PollPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}