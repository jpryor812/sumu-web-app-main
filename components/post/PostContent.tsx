'use client';

import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { ImageNode } from '@/components/post-setup/nodes/ImageNode';
import { VideoNode } from '@/components/post-setup/nodes/VideoNode';
import { PollNode } from '@/components/post-setup/nodes/PollNode';
import { $getRoot } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import { extractHtmlContent } from '@/components/post-setup/RichTextEditor'; // Import the shared utility function

interface PostContentProps {
  content: {
    html: string;
  } | string | null;
}

export default function PostContent({ content }: PostContentProps) {
  // Extract HTML content using the shared utility
  const htmlContent = extractHtmlContent(content);
  
  // For debugging
  useEffect(() => {
    console.log('PostContent rendering with:', {
      contentType: typeof content,
      contentSample: typeof content === 'string' 
        ? content.substring(0, 100) + '...'
        : JSON.stringify(content).substring(0, 100) + '...',
      extractedHtml: htmlContent.substring(0, 100) + '...',
      htmlLength: htmlContent.length
    });
  }, [content, htmlContent]);
  
  // If we have no content, show a placeholder
  if (!htmlContent) {
    return <div className="text-gray-400">No content to display</div>;
  }
  
  // Initialize the editor with the HTML content
  const initializeEditor = (editor: any) => {
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlContent, 'text/html');
      
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        try {
          // Try to import the DOM nodes
          const nodes = $generateNodesFromDOM(editor, dom);
          nodes.forEach(node => root.append(node));
        } catch (error) {
          console.error('Error importing HTML:', error);
          // If import fails, show an error message in the editor
          const paragraph = editor._createParagraphNode();
          paragraph.setTextContent('Error displaying content');
          root.append(paragraph);
        }
      });
    } catch (error) {
      console.error('Error initializing viewer:', error);
    }
  };

  const initialConfig = {
    namespace: 'PostViewer',
    theme: {
      root: 'viewer-root',
      text: {
        bold: 'viewer-text-bold',
        italic: 'viewer-text-italic',
        underline: 'viewer-text-underline',
      },
      heading: {
        h1: 'viewer-h1',
        h2: 'viewer-h2',
        h3: 'viewer-h3',
      },
      list: {
        ul: 'viewer-list-ul',
        ol: 'viewer-list-ol',
      },
      link: 'viewer-link',
    },
    onError: (error: any) => {
      console.error('Lexical Viewer Error:', error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ImageNode,
      VideoNode,
      PollNode
    ],
    editable: false, // Make it read-only
    editorState: initializeEditor // Use our initialization function
  };

  return (
    <div className="prose prose-invert max-w-none">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="viewer-container">
          <div className="viewer-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="viewer-input" />}
              placeholder={<div className="viewer-placeholder">No content</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}