import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  createCommand,
  $insertNodes,
  $createTextNode,
  $getRoot,
  LexicalNode,
  ElementNode,
} from 'lexical';
import { TOGGLE_LINK_COMMAND, $createLinkNode } from '@lexical/link';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $createListNode, $isListNode, ListNode } from '@lexical/list';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_VIDEO_COMMAND } from './plugins/VideoPlugin';
import React from 'react';
import { $createPollNode, createPollOption } from './nodes/PollNode';
import { $findMatchingParent } from '@lexical/utils';

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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [activeList, setActiveList] = useState('');

  // Update toolbar state based on current selection
  useEffect(() => {
    const updateToolbar = () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        // Text formatting
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));

        // Get current node
        const anchorNode = selection.anchor.getNode();
        
        // Check for heading
        const headingNode = $findMatchingParent(
          anchorNode, 
          node => $isHeadingNode(node)
        );
        setActiveHeading(headingNode && $isHeadingNode(headingNode) ? headingNode.getTag() : '');
        
        // Check for list
        const listNode = $findMatchingParent(
          anchorNode, 
          node => $isListNode(node)
        );
        setActiveList(listNode && $isListNode(listNode) ? listNode.getListType() : '');
      });
    };

    // Register update listener
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

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

  // Headings - Fixed implementation
  const formatHeading = useCallback((level: 'h1' | 'h2' | 'h3'): void => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Check if we're toggling the same heading level off
      const shouldRemoveHeading = activeHeading === level;
      
      // Get selected nodes
      const nodes = selection.getNodes();
      
      if (nodes.length === 0) return;
      
      for (const node of nodes) {
        // Find the block parent of this node
        const blockParent = $findMatchingParent(
          node,
          parent => parent.getType() !== 'text' && parent.getType() !== 'linebreak'
        );
        
        if (!blockParent) continue;
        
        // Check if parent is a root node, which can't be replaced
        if (blockParent.getType() === 'root') {
          // For root nodes, we need to clear and append
          const root = $getRoot();
          
          if (shouldRemoveHeading) {
            // Create paragraph with text content
            const paragraph = $createParagraphNode();
            const content = blockParent.getTextContent();
            paragraph.setTextContent(content);
            
            root.clear();
            root.append(paragraph);
          } else {
            // Create heading with text content
            const headingNode = $createHeadingNode(level);
            const content = blockParent.getTextContent();
            headingNode.setTextContent(content);
            
            root.clear();
            root.append(headingNode);
          }
        } else {
          // Regular case - not a root node
          const content = blockParent.getTextContent();
          
          if (shouldRemoveHeading) {
            // Convert heading to paragraph
            const paragraph = $createParagraphNode();
            paragraph.setTextContent(content);
            
            blockParent.replace(paragraph);
          } else {
            // Convert to heading
            const headingNode = $createHeadingNode(level);
            headingNode.setTextContent(content);
            
            blockParent.replace(headingNode);
          }
        }
      }
    });
  }, [editor, activeHeading]);

  // Lists - Use built-in commands for better handling
  const formatBulletList = useCallback((): void => {
    // If already in bullet list, this will toggle it off
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const formatNumberedList = useCallback((): void => {
    // If already in numbered list, this will toggle it off
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
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
      
      // Get the selected text
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
        height: 380, 
        showControls: true 
      });
    }
  }, [editor]);

  // Insert poll
  const insertPoll = useCallback((): void => {
    const question = prompt('Enter poll question:') || 'Default poll question';
    
    editor.update(() => {
      try {
        // Create with explicit options
        const pollNode = $createPollNode(question, [
          createPollOption('Option 1'),
          createPollOption('Option 2')
        ]);
        
        // Get selection and insert
        const selection = $getSelection();
        if (selection) {
          selection.insertNodes([pollNode]);
        } else {
          $insertNodes([pollNode]);
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
        type="button"
        onClick={formatBold} 
        className={`toolbar-item ${isBold ? 'active' : ''}`}
        aria-label="Format Bold"
        data-tooltip="Bold"
      >
        <Bold size={18} />
      </button>

      <button 
        type="button"
        onClick={formatItalic} 
        className={`toolbar-item ${isItalic ? 'active' : ''}`}
        aria-label="Format Italic"
        data-tooltip="Italic"
      >
        <Italic size={18} />
      </button>

      <button 
        type="button"
        onClick={formatUnderline} 
        className={`toolbar-item ${isUnderline ? 'active' : ''}`}
        aria-label="Format Underline"
        data-tooltip="Underline"
      >
        <Underline size={18} />
      </button>

      <button 
        type="button"
        onClick={() => formatHeading('h1')} 
        className={`toolbar-item ${activeHeading === 'h1' ? 'active' : ''}`}
        aria-label="Format Heading 1"
        data-tooltip="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button 
        type="button"
        onClick={() => formatHeading('h2')} 
        className={`toolbar-item ${activeHeading === 'h2' ? 'active' : ''}`}
        aria-label="Format Heading 2"
        data-tooltip="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <button 
        type="button"
        onClick={() => formatHeading('h3')} 
        className={`toolbar-item ${activeHeading === 'h3' ? 'active' : ''}`}
        aria-label="Format Heading 3"
        data-tooltip="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <button 
        type="button"
        onClick={formatBulletList} 
        className={`toolbar-item ${activeList === 'bullet' ? 'active' : ''}`}
        aria-label="Format Bullet List"
        data-tooltip="Bullet List"
      >
        <List size={18} />
      </button>

      <button 
        type="button"
        onClick={formatNumberedList} 
        className={`toolbar-item ${activeList === 'number' ? 'active' : ''}`}
        aria-label="Format Numbered List"
        data-tooltip="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <button 
        type="button"
        onClick={insertLink} 
        className="toolbar-item"
        aria-label="Insert Link"
        data-tooltip="Link"
      >
        <LinkIcon size={18} />
      </button>

      <button 
        type="button"
        onClick={insertImage} 
        className="toolbar-item"
        aria-label="Insert Image"
        data-tooltip="Image"
      >
        <ImageIcon size={18} />
      </button>

      <button 
        type="button"
        onClick={insertVideo} 
        className="toolbar-item"
        aria-label="Insert Video"
        data-tooltip="Video"
      >
        <Video size={18} />
      </button>

      <button 
        type="button"
        onClick={insertPoll} 
        className="toolbar-item"
        aria-label="Create Poll"
        data-tooltip="Poll"
      >
        <Vote size={18} />
      </button>

      <button 
        type="button"
        onClick={undo} 
        className="toolbar-item"
        aria-label="Undo"
        data-tooltip="Undo"
      >
        <Undo size={18} />
      </button>

      <button 
        type="button"
        onClick={redo} 
        className="toolbar-item"
        aria-label="Redo"
        data-tooltip="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}