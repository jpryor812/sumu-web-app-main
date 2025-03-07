'use client';

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
import { PollNode } from '@/components/post-setup/plugins/PollPlugin';

export default function PostContent({ content }: { content: string }) {
  // Parse the content if it's a string
  const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
  
  const initialConfig = {
    namespace: 'PostViewer',
    theme: {
      // Your theme configuration
    },
    onError: (error) => {
      console.error(error);
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
    editorState: parsedContent
  };

  return (
    <div className="prose prose-invert max-w-none">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">No content</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {/* Add other plugins as needed for rendering */}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
} 