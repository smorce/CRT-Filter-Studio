import React from 'react';
import { Tv2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Tv2 className="h-6 w-6 text-teal-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">RetroTube</h1>
        </div>
        <div className="text-sm text-gray-400">
          CRT Filter Studio
        </div>
      </div>
    </header>
  );
};

export default Header;