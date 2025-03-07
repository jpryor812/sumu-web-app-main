// nodes/VideoNode.tsx
import { DecoratorNode, $getNodeByKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useState } from 'react';

export interface VideoPayload {
  src: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  key?: string;
}

export class VideoNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __width: number;
  __height: number;
  __showControls: boolean;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__width,
      node.__height,
      node.__showControls,
      node.__key
    );
  }

  constructor(
    src: string,
    width: number = 640,
    height: number = 360,
    showControls: boolean = true,
    key?: string
  ) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
    this.__showControls = showControls;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('div');
    dom.style.display = 'block';
    dom.style.textAlign = 'center'; // Center align by default
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getWidth(): number {
    return this.__width;
  }

  getHeight(): number {
    return this.__height;
  }

  setWidth(width: number): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setHeight(height: number): void {
    const writable = this.getWritable();
    writable.__height = height;
  }

  showControls(): boolean {
    return this.__showControls;
  }

  setShowControls(showControls: boolean): void {
    const writable = this.getWritable();
    writable.__showControls = showControls;
  }

  decorate(): React.ReactNode {
    return (
      <VideoComponent
        src={this.__src}
        width={this.__width}
        height={this.__height}
        showControls={this.__showControls}
        nodeKey={this.__key}
      />
    );
  }
}

function VideoComponent({
  src,
  width,
  height,
  showControls,
  nodeKey,
}: {
  src: string;
  width: number;
  height: number;
  showControls: boolean;
  nodeKey: string;
}): React.ReactNode {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);

  // Helper to extract video ID from YouTube URL
  const getYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to extract video ID from Vimeo URL
  const getVimeoID = (url: string): string | null => {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[5] : null;
  };

  // Determine video type and render appropriate embed
  const renderVideo = () => {
    // Check for YouTube
    const youtubeID = getYouTubeID(src);
    if (youtubeID) {
      return (
        <iframe
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${youtubeID}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Check for Vimeo
    const vimeoID = getVimeoID(src);
    if (vimeoID) {
      return (
        <iframe
          width={width}
          height={height}
          src={`https://player.vimeo.com/video/${vimeoID}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Default to standard video player
    return (
      <video
        width={width}
        height={height}
        controls={showControls}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div 
  className={`video-container ${isSelected ? 'selected' : ''}`}
  onClick={() => setIsSelected(!isSelected)}
  style={{
    width: `${width}px`,
    margin: '16px auto', // Changed from '16px 0' to '16px auto'
    display: 'block',    // Added to ensure block-level display
    textAlign: 'center'  // Added for content centering
  }}
>
  {renderVideo()}
</div>
  );
}

export function $createVideoNode({
  src,
  width,
  height,
  showControls,
  key,
}: VideoPayload): VideoNode {
  return new VideoNode(src, width, height, showControls, key);
}

export function $isVideoNode(node: any): node is VideoNode {
  return node instanceof VideoNode;
}