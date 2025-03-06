import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  createCommand,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode, $isListNode, ListNode } from '@lexical/list';
import { $getSelection, $isRangeSelection, $createParagraphNode, ElementNode } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

import React from 'react';

// Define command types for TypeScript
export const INSERT_IMAGE_COMMAND = createCommand<{
  src: string;
  altText?: string;
  width?: number;
  height?: number;
}>('INSERT_IMAGE_COMMAND');

export const INSERT_VIDEO_COMMAND = createCommand<{
  url: string;
}>('INSERT_VIDEO_COMMAND');

export const INSERT_POLL_COMMAND = createCommand<{
  question: string;
  options: string[];
}>('INSERT_POLL_COMMAND');

export default function ToolbarPlugin(): React.ReactNode {
  const [editor] = useLexicalComposerContext();

  // Text formatting
  const formatBold = useCallback((): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }, [editor]);

  const formatItalic = useCallback((): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }, [editor]);

  // Headings
  const formatHeading = useCallback((level: 'h1' | 'h2' | 'h3'): void => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      
      // Get anchor (beginning) and focus (end) nodes
      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();
      
      if (anchorNode === focusNode) {
        // Single node selection
        let targetNode = anchorNode;
        
        // Navigate up to the block parent if we're in a text node
        if (targetNode.getType() === 'text') {
          targetNode = targetNode.getParent() || targetNode;
        }
        
        // Only create heading if we have a valid target
        if (targetNode && !targetNode.isAttached()) return;
        
        // Create the new heading node
        const headingNode = $createHeadingNode(level);
        
        // Capture children before replacing
        if (targetNode instanceof ElementNode) {
          const children = targetNode.getChildren();
          if (children && children.length > 0) {
            headingNode.append(...children);
          }
        }
        
        // Replace the node if it exists and is attached
        targetNode.replace(headingNode);
      } else {
        // Multiple node selection is more complex
        // For now, just handle the simplest case
        console.log('Multiple node selection not fully supported');
      }
    });
  }, [editor]);

  // Lists
  const formatBulletList = useCallback((): void => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const formatNumberedList = useCallback((): void => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  // Alignment
  const formatAlignment = useCallback((alignment: 'left' | 'center' | 'right'): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          if (node.getType() !== 'text') {
            // Apply alignment as a style
            const element = node.getParent();
            if (element) {
              element.setFormat(alignment);
            }
          }
        });
      }
    });
  }, [editor]);

  // Insert link
  const insertLink = useCallback((): void => {
    const url = prompt('Enter URL');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  }, [editor]);

  // Insert image
  const insertImage = useCallback((): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (): void => {
          if (typeof reader.result === 'string') {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              src: reader.result,
              altText: file.name,
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  // Insert video
  const insertVideo = useCallback((): void => {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.)');
    if (url) {
      editor.dispatchCommand(INSERT_VIDEO_COMMAND, { url });
    }
  }, [editor]);

  // Insert table
  const insertTable = useCallback((): void => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { 
      rows: '3', 
      columns: '3' 
    });
  }, [editor]);

  // Insert poll
  const insertPoll = useCallback((): void => {
    editor.dispatchCommand(INSERT_POLL_COMMAND, {
      question: 'What is your favorite feature?',
      options: ['Option 1', 'Option 2', 'Option 3'],
    });
  }, [editor]);

  // History
  const undo = useCallback((): void => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redo = useCallback((): void => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <div className="toolbar">
      {/* Text formatting */}
      <button onClick={formatBold} className="toolbar-item" aria-label="Format Bold">
        Bold
      </button>
      <button onClick={formatItalic} className="toolbar-item" aria-label="Format Italic">
        Italic
      </button>

      {/* Headings */}
      <button onClick={() => formatHeading('h1')} className="toolbar-item">H1</button>
      <button onClick={() => formatHeading('h2')} className="toolbar-item">H2</button>
      <button onClick={() => formatHeading('h3')} className="toolbar-item">H3</button>

      {/* Lists */}
      <button onClick={formatBulletList} className="toolbar-item">Bullet List</button>
      <button onClick={formatNumberedList} className="toolbar-item">Numbered List</button>

      {/* Alignment */}
      <button onClick={() => formatAlignment('left')} className="toolbar-item">Left</button>
      <button onClick={() => formatAlignment('center')} className="toolbar-item">Center</button>
      <button onClick={() => formatAlignment('right')} className="toolbar-item">Right</button>

      {/* Media */}
      <button onClick={insertLink} className="toolbar-item">Link</button>
      <button onClick={insertImage} className="toolbar-item">Image</button>
      <button onClick={insertVideo} className="toolbar-item">Video</button>
      <button onClick={insertTable} className="toolbar-item">Table</button>
      <button onClick={insertPoll} className="toolbar-item">Poll</button>

      {/* History */}
      <button onClick={undo} className="toolbar-item">Undo</button>
      <button onClick={redo} className="toolbar-item">Redo</button>
    </div>
  );
}