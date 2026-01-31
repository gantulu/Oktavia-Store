
import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import QuickAction from './components/QuickAction';
import FlashSale from './components/FlashSale';
import PopularProducts from './components/PopularProducts';
import Catalog from './components/Catalog';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleProductSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-[#fbfbfb] flex flex-col shadow-2xl shadow-black/5 relative ${selectedGroupId ? 'overflow-hidden h-screen' : ''}`}>
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <>
            <Banner />
            <QuickAction />
            <FlashSale onProductClick={handleProductSelect} />
            <PopularProducts onProductClick={handleProductSelect} />
          </>
        )}
        
        {activeTab === 'catalog' && (
          <Catalog onProductClick={handleProductSelect} />
        )}
        
        {activeTab === 'profile' && (
          <Profile />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Product Detail Drawer */}
      {selectedGroupId && (
        <ProductDetail 
          groupId={selectedGroupId} 
          onClose={() => setSelectedGroupId(null)} 
        />
      )}
    </div>
  );
};

export default App;
