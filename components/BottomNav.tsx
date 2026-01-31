
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'catalog', label: 'Catalog', icon: 'fa-th-large' },
    { id: 'profile', label: 'Profile', icon: 'fa-user' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-2 pb-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id ? 'text-black scale-110' : 'text-gray-400'
            }`}
          >
            <div className={`text-xl ${activeTab === tab.id ? 'font-bold' : ''}`}>
              <i className={`fas ${tab.icon}`}></i>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
