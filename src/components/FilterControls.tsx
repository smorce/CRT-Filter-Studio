import React, { useState } from 'react';
import { FilterSettings } from '../utils/filterTypes';
import FilterSlider from './FilterSlider';
import { Tv2, Zap, Disc, Lightbulb, ImageIcon, Camera } from 'lucide-react';
import { Tab } from '@headlessui/react';

interface FilterControlsProps {
  settings: FilterSettings;
  onUpdate: (newSettings: Partial<FilterSettings>) => void;
  onPresetSelect: (presetName: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  settings, 
  onUpdate,
  onPresetSelect
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // タブのカテゴリー名と対応するアイコン
  const categories = [
    {
      name: 'CRT Effects',
      icon: <Zap className="w-4 h-4 mr-2" />
    },
    {
      name: 'Lighting',
      icon: <Lightbulb className="w-4 h-4 mr-2" />
    },
    {
      name: 'Color',
      icon: <ImageIcon className="w-4 h-4 mr-2" />
    }
  ];

  // CRT Effectsのコンテンツを生成する関数
  const renderCRTEffectsContent = () => (
    <div className="space-y-4">
      <FilterSlider 
        label="Scan Lines" 
        value={settings.scanlines}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ scanlines: value })}
        tooltip="Adds horizontal lines to simulate CRT monitor scan lines"
      />
      <FilterSlider 
        label="RGB Shift" 
        value={settings.rgbShift}
        min={0}
        max={5}
        step={0.1}
        onChange={(value) => onUpdate({ rgbShift: value })}
        tooltip="Creates color channel separation like old CRT displays"
      />
      <FilterSlider 
        label="Noise" 
        value={settings.noise}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ noise: value })}
        tooltip="Adds static noise/grain to the image"
      />
      <FilterSlider 
        label="Flickering" 
        value={settings.flickering}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ flickering: value })}
        tooltip="Simulates the subtle flickering of CRT displays"
      />
    </div>
  );

  // Lightingのコンテンツを生成する関数
  const renderLightingContent = () => (
    <div className="space-y-4">
      <FilterSlider 
        label="Bloom" 
        value={settings.bloom}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ bloom: value })}
        tooltip="Adds glow around bright areas"
      />
      <FilterSlider 
        label="Vignette" 
        value={settings.vignette}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ vignette: value })}
        tooltip="Darkens the edges of the image"
      />
      <FilterSlider 
        label="Curvature" 
        value={settings.curvature}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => onUpdate({ curvature: value })}
        tooltip="Adds screen curvature like on old CRT monitors"
      />
    </div>
  );

  // Colorのコンテンツを生成する関数
  const renderColorContent = () => (
    <div className="space-y-4">
      <FilterSlider 
        label="Brightness" 
        value={settings.brightness}
        min={0.5}
        max={1.5}
        step={0.01}
        onChange={(value) => onUpdate({ brightness: value })}
        tooltip="Adjusts the overall brightness of the image"
      />
      <FilterSlider 
        label="Contrast" 
        value={settings.contrast}
        min={0.5}
        max={2}
        step={0.01}
        onChange={(value) => onUpdate({ contrast: value })}
        tooltip="Adjusts the difference between dark and light areas"
      />
      <FilterSlider 
        label="Saturation" 
        value={settings.saturation}
        min={0}
        max={2}
        step={0.01}
        onChange={(value) => onUpdate({ saturation: value })}
        tooltip="Adjusts the intensity of colors"
      />
    </div>
  );

  // 選択されたタブに応じたコンテンツをレンダリング
  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return renderCRTEffectsContent();
      case 1:
        return renderLightingContent();
      case 2:
        return renderColorContent();
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-700 border-b border-gray-600">
        <h2 className="text-lg font-semibold text-white">Filter Settings</h2>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-md font-medium text-teal-400 mb-3 flex items-center">
            <Tv2 className="w-4 h-4 mr-2" />
            Presets
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onPresetSelect('subtle')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              Subtle
            </button>
            <button 
              onClick={() => onPresetSelect('classic')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              Classic
            </button>
            <button 
              onClick={() => onPresetSelect('arcade')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              Arcade
            </button>
            <button 
              onClick={() => onPresetSelect('vhs')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              VHS
            </button>
          </div>
        </div>

        <div className="w-full">
          <Tab.Group onChange={setSelectedTabIndex}>
            <Tab.List className="flex space-x-1 rounded-lg bg-gray-700 p-1">
              {categories.map((category, index) => (
                <Tab
                  key={category.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-md py-2 text-sm font-medium leading-5 text-white',
                      'focus:outline-none focus:ring-2 ring-teal-400 ring-opacity-60',
                      selected
                        ? 'bg-gray-800 shadow'
                        : 'text-gray-400 hover:bg-gray-600 hover:text-white'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-5">
              {categories.map((_, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-lg bg-gray-800 p-3',
                    'focus:outline-none'
                  )}
                >
                  {renderTabContent(idx)}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;