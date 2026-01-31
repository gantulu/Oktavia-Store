
import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import QuickAction from './components/QuickAction';
import FlashSale from './components/FlashSale';
import PopularProducts from './components/PopularProducts';
import Catalog from './components/Catalog';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fbfbfb] flex flex-col shadow-2xl shadow-black/5 relative">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <>
            <Banner />
            <QuickAction />
            <FlashSale />
            <PopularProducts />
          </>
        )}
        
        {activeTab === 'catalog' && (
          <Catalog />
        )}
        
        {activeTab === 'profile' && (
          <Profile />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
