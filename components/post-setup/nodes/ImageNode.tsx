// nodes/ImageNode.tsx
import { DecoratorNode, $getNodeByKey, LexicalNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { Suspense, useState, useRef, useEffect } from 'react';
import ImageResizer from '../../ImageResizer';

export interface ImagePayload {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  alignment?: 'left' | 'center' | 'right';
  key?: string;
}

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __altText: string;
  __width: number | undefined;
  __height: number | undefined;
  __alignment: 'left' | 'center' | 'right';
  __selected: boolean;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__alignment,
      node.__selected,
      node.__key
    );
  }

  constructor(
    src: string,
    altText: string = '',
    width?: number,
    height?: number,
    alignment: 'left' | 'center' | 'right' = 'left',
    selected: boolean = false,
    key?: string
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__alignment = alignment;
    this.__selected = selected;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div');
    dom.style.display = 'inline-block';
    dom.style.position = 'relative';
    dom.style.textAlign = this.__alignment;
    return dom;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    if (prevNode.__alignment !== this.__alignment) {
      dom.style.textAlign = this.__alignment;
      return true;
    }
    return false;
  }

  setAlignment(alignment: 'left' | 'center' | 'right'): void {
    const self = this.getWritable();
    self.__alignment = alignment;
  }

  setWidth(width: number): void {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height: number): void {
    const self = this.getWritable();
    self.__height = height;
  }

  setAltText(altText: string): void {
    const self = this.getWritable();
    self.__altText = altText;
  }

  toggleSelected(): void {
    const self = this.getWritable();
    self.__selected = !self.__selected;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }

  getAlignment(): 'left' | 'center' | 'right' {
    return this.__alignment;
  }

  isSelected(): boolean {
    return this.__selected;
  }

  decorate(): React.ReactNode {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          alignment={this.__alignment}
          nodeKey={this.__key}
          isSelected={this.__selected}
        />
      </Suspense>
    );
  }
}

// Add this helper function and export it
export function $isImageNode(node: LexicalNode | null): node is ImageNode {
  return node instanceof ImageNode;
}

// Add this after the $isImageNode function
export function $createImageNode(payload: ImagePayload): ImageNode {
  return new ImageNode(
    payload.src,
    payload.altText || '',
    payload.width,
    payload.height,
    payload.alignment || 'center',
    false,
    payload.key
  );
}

function ImageComponent({
  src,
  altText,
  width,
  height,
  alignment,
  nodeKey,
  isSelected,
}: {
  src: string;
  altText: string;
  width: number | undefined;
  height: number | undefined;
  alignment: 'left' | 'center' | 'right';
  nodeKey: string;
  isSelected: boolean;
}): React.ReactNode {
  const [editor] = useLexicalComposerContext();
  const imageRef = useRef<HTMLImageElement>(null);
  const [localIsSelected, setLocalIsSelected] = useState(isSelected);
  
  // Track selection both from props and local state
  useEffect(() => {
    setLocalIsSelected(isSelected);
  }, [isSelected]);
  
  // Handle click on image to select it
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle selection in the editor
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node !== null && $isImageNode(node)) {
        node.toggleSelected();
      }
    });
    
    // Also update local state for immediate feedback
    setLocalIsSelected(!localIsSelected);
  };
  
  // Handle outside clicks to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      if (
        imageRef.current && 
        !imageRef.current.contains(target) && 
        localIsSelected
      ) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node !== null && $isImageNode(node) && node.isSelected()) {
            node.toggleSelected();
          }
        });
        
        setLocalIsSelected(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editor, nodeKey, localIsSelected]);

  return (
    <div
      className="image-container"
      style={{ textAlign: alignment }}
    >
      <div
        className={`image-wrapper ${localIsSelected ? 'selected' : ''}`}
        style={{
          display: 'inline-block',
          position: 'relative', 
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
        onClick={handleImageClick}
      >
        <img
          ref={imageRef}
          src={src}
          alt={altText}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: '100%',
          }}
        />
        {localIsSelected && editor.isEditable() && (
          <ImageResizer 
            editor={editor}
            imageRef={imageRef}
            nodeKey={nodeKey}
          />
        )}
      </div>
    </div>
  );
}