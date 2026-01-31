
import React, { useState } from 'react';
import { User } from '../types';
import { APP_CONFIG } from '../constants';

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple simulation
    const mockUser: User = {
      name: "Apple Fanboy",
      phone: "08123456789",
      avatarSeed: "apple"
    };
    setUser(mockUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8 shadow-xl">
          <i className="fab fa-apple text-white text-3xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLoginView ? 'Selamat Datang' : 'Daftar Akun'}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Nikmati pengalaman belanja produk Apple terbaik di iStore.
        </p>

        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          {!isLoginView && (
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          )}
          <input 
            type="tel" 
            placeholder="Nomor Telepon" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          />
          
          <button className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10 hover:opacity-90 transition active:scale-95">
            {isLoginView ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-gray-500 text-sm">
          {isLoginView ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button 
            onClick={() => setIsLoginView(!isLoginView)}
            className="ml-1 text-blue-600 font-bold hover:underline"
          >
            {isLoginView ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed}`} 
            alt="Profile" 
            className="w-16 h-16 rounded-full bg-blue-100 border-2 border-white shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.phone}</p>
          </div>
          <button className="ml-auto p-2 text-gray-400 hover:text-black">
            <i className="fas fa-cog text-xl"></i>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Aktivitas Saya</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Belum Bayar', icon: 'fa-wallet' },
              { label: 'Dikemas', icon: 'fa-box' },
              { label: 'Dikirim', icon: 'fa-truck' },
              { label: 'Beri Nilai', icon: 'fa-star' }
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className="text-[9px] font-medium text-gray-500 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {APP_CONFIG.main.profile.accountMenu.map(menu => (
            <button key={menu.id} className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition active:bg-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className={`fas ${menu.icon}`}></i>
              </div>
              <span className="text-sm font-medium text-gray-800">{menu.name}</span>
              <i className="fas fa-chevron-right ml-auto text-xs text-gray-300"></i>
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full p-4 bg-white text-red-500 rounded-2xl shadow-sm border border-gray-100 font-bold text-sm flex items-center justify-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i>
          Keluar Sesi
        </button>
      </div>
    </div>
  );
};

export default Profile;
