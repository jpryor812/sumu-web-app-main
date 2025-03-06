'use client'

import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, EditorState, LexicalEditor } from 'lexical';
import { 
  Bold, Italic, Underline, Heading1, Heading2, List, 
  ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon 
} from 'lucide-react';
import { FORMAT_TEXT_COMMAND, COMMAND_PRIORITY_NORMAL } from 'lexical';
import { 
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType 
} from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import type { ErrorBoundaryType } from '@lexical/react/LexicalErrorBoundary';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

function ToolbarPlugin(): React.ReactNode {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isHeading1, setIsHeading1] = useState(false);
    const [isHeading2, setIsHeading2] = useState(false);
    const [isBulletList, setIsBulletList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);
    const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const updateToolbar = (): void => {
      const selection = $getSelection();
      
      if (!selection || !$isRangeSelection(selection)) {
        return;
      }
      
      // Now TypeScript knows selection is a RangeSelection which has hasFormat
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      
      // Check for heading format
      const anchorNode = selection.anchor.getNode();
      const elementDOM = editor.getElementByKey(anchorNode.getKey());
      
      // Check heading levels
      setIsHeading1(!!elementDOM?.tagName?.match(/^h1$/i));
      setIsHeading2(!!elementDOM?.tagName?.match(/^h2$/i));
      
      // Check for list formats
      // This is simplified and may need more complex logic
      setIsBulletList(!!elementDOM?.closest('ul'));
      setIsOrderedList(!!elementDOM?.closest('ol'));
      
      // Check for link format
      setIsLink(!!elementDOM?.closest('a'));
    };
    
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  const insertLink = (): void => {
    const url = prompt('Enter URL');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const formatHeading = (level: number): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          if ($isHeadingNode(node)) {
            const heading = $createHeadingNode(`h${level}` as HeadingTagType);
            node.replace(heading, true); // true preserves children
          } else {
            const heading = $createHeadingNode(`h${level}` as HeadingTagType);
            node.insertBefore(heading);
            heading.select();
          }
        });
      }
    });
  };

  return (
    <div className="bg-gray-800 p-2 flex flex-wrap gap-1 border-b border-gray-700">
            <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`p-2 rounded ${isBold ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`p-2 rounded ${isItalic ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`p-2 rounded ${isUnderline ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <Underline size={18} />
      </button>
      <button
        type="button"
        onClick={() => formatHeading(1)}
        className={`p-2 rounded ${isHeading1 ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => formatHeading(2)}
        className={`p-2 rounded ${isHeading2 ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className={`p-2 rounded ${isBulletList ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className={`p-2 rounded ${isOrderedList ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={insertLink}
        className={`p-2 rounded ${isLink ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps): React.ReactNode {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      root: 'p-4 min-h-[300px] focus:outline-none text-white',
      link: 'text-blue-500 underline',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ],
  };

  const handleEditorChange = (editorState: EditorState, editor: LexicalEditor): void => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      onChange(text);
    });
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="p-4 min-h-[300px] focus:outline-none text-white" />
          }
          placeholder={
            <div className="absolute top-[60px] left-4 text-gray-400 pointer-events-none">
              Write your post...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary as ErrorBoundaryType}
        />
        <OnChangePlugin onChange={handleEditorChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </LexicalComposer>
    </div>
  );
}