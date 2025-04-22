import React, { useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (img: HTMLImageElement) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageLoad = useCallback((file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          onImageUpload(img);
          setIsLoading(false);
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        handleImageLoad(file);
      }
    }
  }, [handleImageLoad]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageLoad(e.target.files[0]);
    }
  }, [handleImageLoad]);

  const handleDemoImage = useCallback(() => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      onImageUpload(img);
      setIsLoading(false);
    };
    img.src = "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  }, [onImageUpload]);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div
        className={`w-full max-w-xl h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${
          isDragging ? 'border-teal-400 bg-teal-400/10' : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-teal-400 border-gray-700 rounded-full animate-spin"></div>
            <p className="text-gray-300">Loading image...</p>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-300 mb-2">Drop your image here</h2>
            <p className="text-gray-400 text-center mb-6">
              Drag and drop your image file here, or click to browse
            </p>
            <label className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-md text-white font-medium transition-colors cursor-pointer">
              Select Image
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
              />
            </label>
            <div className="mt-8 text-gray-400">or</div>
            <button 
              onClick={handleDemoImage}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors"
            >
              Use Demo Image
            </button>
          </>
        )}
      </div>
      <div className="mt-8 text-center max-w-lg">
        <h3 className="text-lg font-medium text-teal-400 mb-2">
          Create stunning CRT effects
        </h3>
        <p className="text-gray-400">
          Upload any image and transform it with authentic-looking CRT filters.
          Adjust scan lines, RGB shift, noise, and more to perfect your retro aesthetic.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;