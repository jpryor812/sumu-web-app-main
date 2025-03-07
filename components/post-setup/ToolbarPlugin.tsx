import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  createCommand,
  $insertNodes,
  $createTextNode,
} from 'lexical';
import { TOGGLE_LINK_COMMAND, $createLinkNode } from '@lexical/link';import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode, $isListNode, ListNode } from '@lexical/list';
import { $getSelection, $isRangeSelection, $createParagraphNode, ElementNode } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_VIDEO_COMMAND } from './plugins/VideoPlugin';
import React from 'react';
import { $createPollNode, createPollOption } from './nodes/PollNode';

import { 
    Bold, 
    Italic, 
    Underline, 
    Heading1, 
    Heading2, 
    Heading3, 
    List, 
    ListOrdered, 
    Link as LinkIcon, 
    Image as ImageIcon, 
    Video, 
    Vote, 
    Undo, 
    Redo 
  } from 'lucide-react';

// Define command types for TypeScript
export const INSERT_IMAGE_COMMAND = createCommand<{
  src: string;
  altText?: string;
  width?: number;
  height?: number;
}>('INSERT_IMAGE_COMMAND');

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

  const formatUnderline = useCallback((): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
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
  const insertLink = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      
      if (!$isRangeSelection(selection)) {
        return;
      }
      
      const url = prompt('Enter URL');
      if (!url) return;
      
      // Instead of extracting nodes (which removes them from the tree),
      // get the text content and create a new text node
      const selectedText = selection.getTextContent();
      
      // Create the link node with the URL
      const linkNode = $createLinkNode(url);
      
      // Delete the selected content first
      selection.removeText();
      
      // If there was selected text, add it to the link
      if (selectedText) {
        const textNode = $createTextNode(selectedText);
        linkNode.append(textNode);
      } else {
        // If no selection, use the URL as the link text
        linkNode.append($createTextNode(url));
      }
      
      // Insert the new link node
      selection.insertNodes([linkNode]);
      
      // Focus the editor
      editor.focus();
    });
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
    const url = prompt('Enter video URL (YouTube, Vimeo, or direct video URL):');
    if (url) {
      editor.dispatchCommand(INSERT_VIDEO_COMMAND, { 
        src: url,
        width: 640, 
        height: 360, 
        showControls: true 
      });
    }
  }, [editor]);


  // Insert poll
  const insertPoll = useCallback((): void => {
    const question = prompt('Enter poll question:') || 'Default poll question';
    
    editor.update(() => {
      try {
        console.log('Creating poll node directly with question:', question);
        
        // Create with explicit options
        const pollNode = $createPollNode(question, [
          createPollOption('Option 1'),
          createPollOption('Option 2')
        ]);
        
        console.log('Poll node created:', pollNode);
        
        // Get selection and insert
        const selection = $getSelection();
        if (selection) {
          selection.insertNodes([pollNode]);
          console.log('Poll inserted at selection');
        } else {
          $insertNodes([pollNode]);
          console.log('Poll inserted without selection');
        }
      } catch (error) {
        console.error('Error inserting poll:', error);
      }
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
<button 
  onClick={formatBold} 
  className="toolbar-item" 
  aria-label="Format Bold"
  title="Bold"  // This creates the tooltip
>
  <Bold size={18} />
</button>

<button 
  onClick={formatItalic} 
  className="toolbar-item" 
  aria-label="Format Italic"
  title="Italic"  // Tooltip for italic
>
  <Italic size={18} />
</button>
  <button onClick={formatUnderline} className="toolbar-item" title="Underline">
  <Underline size={18} />
</button>

<button onClick={() => formatHeading('h1')} className="toolbar-item" title="Heading 1">
  <Heading1 size={18} />
</button>

<button onClick={() => formatHeading('h2')} className="toolbar-item" title="Heading 2">
  <Heading2 size={18} />
</button>

<button onClick={() => formatHeading('h3')} className="toolbar-item" title="Heading 3">
  <Heading3 size={18} />
</button>

<button onClick={formatBulletList} className="toolbar-item" title="Bullet List">
  <List size={18} />
</button>

<button onClick={formatNumberedList} className="toolbar-item" title="Numbered List">
  <ListOrdered size={18} />
</button>

<button onClick={insertLink} className="toolbar-item" title="Insert Link">
  <LinkIcon size={18} />
</button>

<button onClick={insertImage} className="toolbar-item" title="Insert Image">
  <ImageIcon size={18} />
</button>

<button onClick={insertVideo} className="toolbar-item" title="Insert Video">
  <Video size={18} />
</button>

<button onClick={insertPoll} className="toolbar-item" title="Create Poll">
  <Vote size={18} />
</button>

<button onClick={undo} className="toolbar-item" title="Undo">
  <Undo size={18} />
</button>

<button onClick={redo} className="toolbar-item" title="Redo">
  <Redo size={18} />
</button>
</div>
  );
}