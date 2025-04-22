import React, { useRef, useEffect, useState } from 'react';
import { FilterSettings } from '../utils/filterTypes';
import { applyCRTEffect } from '../utils/canvasEffects';

interface CanvasProps {
  image: HTMLImageElement;
  filterSettings: FilterSettings;
  isProcessing: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ image, filterSettings, isProcessing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Calculate the canvas size to fit the container while maintaining aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || containerWidth * 0.6;
    
    const imgAspect = image.width / image.height;
    let canvasWidth = containerWidth;
    let canvasHeight = canvasWidth / imgAspect;
    
    // If the height is too tall, scale based on height instead
    if (canvasHeight > containerHeight) {
      canvasHeight = containerHeight;
      canvasWidth = canvasHeight * imgAspect;
    }
    
    // Update canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setCanvasSize({ width: canvasWidth, height: canvasHeight });

    // Draw the image with effects
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (showOriginal) {
        // Split view - draw original on left, filtered on right
        const splitX = (comparePosition / 100) * canvasWidth;
        
        // Draw original image on whole canvas
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        
        // Draw filtered image on right side
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          applyCRTEffect(tempCtx, filterSettings, tempCanvas.width, tempCanvas.height);
          
          // Draw the filtered portion
          ctx.drawImage(
            tempCanvas,
            splitX, 0, canvasWidth - splitX, canvasHeight,
            splitX, 0, canvasWidth - splitX, canvasHeight
          );
          
          // Draw comparison line (more subtle)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(splitX - 1, 0, 1, canvasHeight);
        }
      } else {
        // Full filtered view
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        applyCRTEffect(ctx, filterSettings, canvasWidth, canvasHeight);
      }
    }
  }, [image, filterSettings, showOriginal, comparePosition, isProcessing]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showOriginal) {
      setIsDragging(true);
      updateComparePosition(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateComparePosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateComparePosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparePosition(pos);
  };

  return (
    <div className="relative">
      <div 
        className="relative bg-gray-900 p-4 border border-gray-700 overflow-hidden"
        style={{ height: '60vh', maxHeight: '600px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          className={`mx-auto transition-opacity duration-300 ${isProcessing ? 'opacity-80' : 'opacity-100'}`}
          style={{ 
            cursor: showOriginal ? 'col-resize' : 'default',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>
      <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-center">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className={`px-4 py-2 rounded-md transition-colors ${
            showOriginal 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {showOriginal ? 'Hide Original' : 'Compare with Original'}
        </button>
      </div>
    </div>
  );
};

export default Canvas;