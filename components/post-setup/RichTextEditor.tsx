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
import ImagesPlugin from './plugins/ImagesPlugin';
import ImageSelectionPlugin from './plugins/ImageSelectionPlugin';
import ToolbarPlugin from './ToolbarPlugin';
import { VideoNode } from './nodes/VideoNode';
import VideoPlugin from './plugins/VideoPlugin';
import { ImageNode } from './nodes/ImageNode';
import { PollNode } from './nodes/PollNode';
import PollPlugin from './plugins/PollPlugin';

import './editor.css';
import React, { useState, useEffect } from 'react';

// Add this custom error boundary implementation
class LexicalErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {error: any}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Lexical editor error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <h3>Something went wrong</h3>
          <p>The editor encountered an error. Please try again.</p>
          <button onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Update the component signature to accept props
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  // Add state to manage content
  const [editorState, setEditorState] = useState('');
  
  // Add function to handle editor changes
  const handleEditorChange = (editorState: any) => {
    // Extract content as HTML or text
    const htmlContent = editorState.toHTML ? editorState.toHTML() : '';
    onChange(htmlContent);
  };

  // Initialize editor with content if provided
  useEffect(() => {
    if (content && !editorState) {
      // Initialize editor with content
    }
  }, [content, editorState]);

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
    onError: (error: any) => console.error(error),
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
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
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
        </div>
      </div>
    </LexicalComposer>
  );
}