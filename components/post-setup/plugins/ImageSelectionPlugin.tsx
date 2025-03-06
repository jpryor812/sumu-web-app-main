import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $getNodeByKey, $getSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { $isImageNode } from '../nodes/ImageNode';

export default function ImageSelectionPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Check if the click is on an image
        if (target.tagName === 'IMG') {
          const imageElement = target.closest('.image-wrapper');
          if (imageElement) {
            const nodeKey = imageElement.getAttribute('data-node-key');
            if (nodeKey) {
              editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) {
                  node.toggleSelected();
                }
              });
            }
          }
        } else {
          // Deselect all images when clicking elsewhere
          editor.update(() => {
            const selection = $getSelection();
            if (selection) {
              const nodes = selection.getNodes();
              let deselected = false;
              
              nodes.forEach(node => {
                if ($isImageNode(node) && node.isSelected()) {
                  node.toggleSelected();
                  deselected = true;
                }
              });
              
              return deselected;
            }
            return false;
          });
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}