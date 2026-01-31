
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <i className="fab fa-apple text-white text-xl"></i>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-gray-900">iStore</h1>
      </div>
      
      <div className="flex-1 mx-4 max-w-md hidden sm:block">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Cari produk Apple..." 
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-black">
          <i className="fas fa-shopping-cart text-lg"></i>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
        </button>
        <button className="p-2 text-gray-600 hover:text-black sm:hidden">
          <i className="fas fa-search text-lg"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
