import React, { useRef } from 'react';
import { Download, Undo2, Redo2 } from 'lucide-react';
import { FilterSettings } from '../utils/filterTypes';
import { applyCRTEffect } from '../utils/canvasEffects';

interface ExportPanelProps {
  image: HTMLImageElement;
  filterSettings: FilterSettings;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ 
  image, 
  filterSettings,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleExport = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to the original image size for best quality export
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw the image with filters
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    applyCRTEffect(ctx, filterSettings, canvas.width, canvas.height);
    
    // Create a download link
    try {
      const link = document.createElement('a');
      link.download = 'crt-filtered-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('There was an error exporting the image. Please try again.');
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg mt-4 p-4 flex justify-between items-center">
      <div className="flex space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-md transition-colors ${
            canUndo 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-md transition-colors ${
            canRedo 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>
      
      <button
        onClick={handleExport}
        className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-white font-medium transition-colors"
      >
        <Download className="w-5 h-5 mr-2" />
        Export Image
      </button>
      
      {/* Hidden canvas for exporting */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ExportPanel;