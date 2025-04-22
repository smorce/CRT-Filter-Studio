import React from 'react';
import Header from './Header';
import FilterWorkspace from './FilterWorkspace';
import Footer from './Footer';

const CRTFilterApp: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <FilterWorkspace />
      </main>
      <Footer />
    </div>
  );
};

export default CRTFilterApp;