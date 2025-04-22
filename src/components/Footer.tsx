import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-400">
        <p>RetroTube CRT Filter © {new Date().getFullYear()}</p>
        <p className="mt-1">Created with ❤️ smorce</p>
      </div>
    </footer>
  );
};

export default Footer;