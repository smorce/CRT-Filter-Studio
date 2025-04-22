import React, { useState, useRef, useEffect } from 'react';
import { InfoIcon } from 'lucide-react';

interface FilterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltip?: string;
}

const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(max, Math.max(min, steppedValue));
    
    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-gray-300 flex items-center">
          {label}
          {tooltip && (
            <div className="relative inline-block ml-1">
              <InfoIcon 
                className="h-3.5 w-3.5 text-gray-400 cursor-help" 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className="absolute left-full ml-2 bottom-0 w-48 bg-gray-900 text-xs text-white p-2 rounded shadow-lg z-10">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </label>
        <span className="text-xs font-mono text-gray-400">
          {value.toFixed(2)}
        </span>
      </div>
      <div 
        ref={sliderRef}
        className="slider-container relative h-6 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-teal-600 to-purple-500 rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div 
          className={`absolute h-4 w-4 bg-white rounded-full shadow-lg transform -translate-x-1/2 transition-transform ${isDragging ? 'scale-110' : 'hover:scale-110'}`}
          style={{ left: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FilterSlider;