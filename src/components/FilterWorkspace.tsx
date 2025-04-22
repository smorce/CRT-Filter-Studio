import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Canvas from './Canvas';
import FilterControls from './FilterControls';
import ExportPanel from './ExportPanel';
import { X } from 'lucide-react';
import { defaultFilterSettings, FilterSettings } from '../utils/filterTypes';

const FilterWorkspace: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(defaultFilterSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<FilterSettings[]>([defaultFilterSettings]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleImageUpload = (img: HTMLImageElement) => {
    setImage(img);
  };

  const handleCloseImage = () => {
    setImage(null);
    setFilterSettings(defaultFilterSettings);
    setHistory([defaultFilterSettings]);
    setHistoryIndex(0);
  };

  const updateFilterSettings = (newSettings: Partial<FilterSettings>) => {
    setIsProcessing(true);
    
    const updatedSettings = { ...filterSettings, ...newSettings };
    setFilterSettings(updatedSettings);
    
    // Add to history, removing any "future" if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedSettings);
    
    // Cap history at 20 items to prevent memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
    
    setTimeout(() => setIsProcessing(false), 50);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFilterSettings(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFilterSettings(history[historyIndex + 1]);
    }
  };

  const applyPreset = (presetName: string) => {
    let preset: FilterSettings;
    
    switch (presetName) {
      case 'classic':
        preset = {
          scanlines: 0.5,
          rgbShift: 1.5,
          noise: 0.2,
          bloom: 0.3,
          vignette: 0.4,
          curvature: 0.3,
          brightness: 1.1,
          contrast: 1.2,
          saturation: 1.2,
          flickering: 0.15
        };
        break;
      case 'arcade':
        preset = {
          scanlines: 0.7,
          rgbShift: 2.5,
          noise: 0.3,
          bloom: 0.5,
          vignette: 0.5,
          curvature: 0.5,
          brightness: 1.2,
          contrast: 1.4,
          saturation: 1.4,
          flickering: 0.25
        };
        break;
      case 'vhs':
        preset = {
          scanlines: 0.3,
          rgbShift: 3.0,
          noise: 0.5,
          bloom: 0.2,
          vignette: 0.6,
          curvature: 0.2,
          brightness: 0.9,
          contrast: 1.1,
          saturation: 1.3,
          flickering: 0.4
        };
        break;
      case 'subtle':
      default:
        preset = {
          scanlines: 0.2,
          rgbShift: 0.8,
          noise: 0.1,
          bloom: 0.2,
          vignette: 0.2,
          curvature: 0.1,
          brightness: 1.0,
          contrast: 1.1,
          saturation: 1.1,
          flickering: 0.05
        };
    }
    
    updateFilterSettings(preset);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {!image ? (
        <ImageUploader onImageUpload={handleImageUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
              <button
                onClick={handleCloseImage}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 hover:bg-gray-900 rounded-full transition-colors"
                title="Close image"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
              <Canvas 
                image={image} 
                filterSettings={filterSettings} 
                isProcessing={isProcessing} 
              />
            </div>
            <ExportPanel 
              image={image} 
              filterSettings={filterSettings} 
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
          </div>
          <div className="lg:col-span-1">
            <FilterControls 
              settings={filterSettings} 
              onUpdate={updateFilterSettings}
              onPresetSelect={applyPreset}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterWorkspace;