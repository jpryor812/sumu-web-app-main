// Create a new file: components/SimpleImageResizer.tsx

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, LexicalNode } from 'lexical';
import React, { useRef, useEffect } from 'react';
import { ImageNode, $isImageNode } from './post-setup/nodes/ImageNode';

interface SimpleImageResizerProps {
  nodeKey: string;
  imageRef: React.RefObject<HTMLImageElement>;
  editor: any;
}

export default function SimpleImageResizer({ 
  nodeKey, 
  imageRef,
  editor 
}: SimpleImageResizerProps): React.ReactNode {
  const startSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    startSizeRef.current = {
      width: rect.width,
      height: rect.height
    };
    
    startPosRef.current = { 
      x: e.clientX, 
      y: e.clientY 
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startPosRef.current.x;
    const aspectRatio = startSizeRef.current.width / startSizeRef.current.height;
    
    // Maintain aspect ratio
    const newWidth = Math.max(100, startSizeRef.current.width + dx);
    const newHeight = newWidth / aspectRatio;
    
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node !== null && $isImageNode(node)) {
        node.setWidth(newWidth);
        node.setHeight(newHeight);
      }
    });
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return (
    <>
      <div 
        className="image-resizer-handle"
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: '-6px',
          bottom: '-6px',
          width: '12px',
          height: '12px',
          backgroundColor: '#1d4ed8',
          border: '2px solid white',
          borderRadius: '50%',
          cursor: 'nwse-resize',
          zIndex: 10
        }}
      />
    </>
  );
}